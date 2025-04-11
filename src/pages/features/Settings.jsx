import React, { useContext, useEffect, useState } from "react";
import { Card, Form, Button, Row, Col, Accordion } from "react-bootstrap";
import { toast } from "react-toastify";
import { changePassword } from "../../services/auth.service";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import {
  deleteAccount,
  fetchLoginActivity,
  getTaxReportData,
  updatePreferences,
  verifyPasswordBeforeDelete,
} from "../../services/user.service";
import { PreferencesContext } from "../../context/PreferencesContext";
import { formatCurrency } from "../../utils/formatCurrency";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    mobile: "",
    country: "India",
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
    theme: "light",
    monthlyGoal: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loginHistory, setLoginHistory] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const visibleLogins = showAll ? loginHistory : loginHistory.slice(0, 5);

  const navigate = useNavigate();
  const { setPrefs } = useContext(PreferencesContext);
  const { prefs, exchangeRates } = useContext(PreferencesContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setSettings((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        ...user.preferences,
      }));
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (user && token) {
      fetchLoginActivity(user._id, token)
        .then((res) => setLoginHistory(res.data))
        .catch(() => toast.error("Failed to load login history"));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleThemeToggle = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  };

  const handleSaveSettings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return toast.error("User not found in storage");

      const updatedPrefs = {
        dateFormat: settings.dateFormat,
        theme: settings.theme,
        country: settings.country,
        currency: settings.currency,
        monthlyGoal: settings.monthlyGoal,
      };

      const token = localStorage.getItem("token");

      // ✅ Call backend to update
      await updatePreferences(updatedPrefs, token);

      // ✅ Update localStorage and context
      const updatedUser = { ...user, preferences: updatedPrefs };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setPrefs(updatedPrefs);

      toast.success("Preferences updated successfully!");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save preferences.");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    try {
      const response = await changePassword(
        settings.email,
        currentPassword,
        newPassword,
        confirmPassword
      );
      toast.success(response.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  const getConvertedGoal = () => {
    const baseValue = Number(settings.monthlyGoal || 0);
    const from = "INR";
    const to = prefs.currency;

    if (from === to) return baseValue;

    const rate = exchangeRates?.[from]?.[to];
    if (!rate) return baseValue;

    return (baseValue * rate).toFixed(2);
  };

  const downloadTaxReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getTaxReportData(token);
      const { expenses, investments, policies, savings } = res.data;

      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Tax Report", 14, 20);

      let currentY = 30;

      const formatAmount = (amt) =>
        `Rs. ${Number(amt).toLocaleString("en-IN")}`;
      const formatDate = (date) => new Date(date).toLocaleDateString("en-IN");

      if (expenses.length) {
        autoTable(doc, {
          startY: currentY,
          head: [["Amount", "Category", "Note", "Date"]],
          body: expenses.map((e) => [
            formatAmount(e.amount),
            e.category,
            e.note || "-",
            formatDate(e.date),
          ]),
        });
        currentY = doc.lastAutoTable.finalY + 10;
      }

      if (investments.length) {
        autoTable(doc, {
          startY: currentY,
          head: [["Name", "Type", "Invested", "Current Value", "Start Date"]],
          body: investments.map((i) => [
            i.name,
            i.type,
            formatAmount(i.amountInvested),
            formatAmount(i.currentValue),
            formatDate(i.startDate),
          ]),
        });
        currentY = doc.lastAutoTable.finalY + 10;
      }

      if (policies.length) {
        autoTable(doc, {
          startY: currentY,
          head: [["Policy", "Premium", "Mode", "Due", "Paid"]],
          body: policies.map((p) => [
            p.policyName,
            formatAmount(p.premiumAmount),
            p.premiumMode,
            formatDate(p.dueDate),
            p.lastPaidDate ? formatDate(p.lastPaidDate) : "-",
          ]),
        });
        currentY = doc.lastAutoTable.finalY + 10;
      }

      if (savings.length) {
        autoTable(doc, {
          startY: currentY,
          head: [["Amount", "Note", "Date"]],
          body: savings.map((s) => [
            formatAmount(s.amount),
            s.note || "-",
            formatDate(s.date),
          ]),
        });
      }

      doc.save("tax-report.pdf");
    } catch (err) {
      console.error("Failed to generate tax report:", err);
      toast.error("Failed to download tax report");
    }
  };

  const handleDeleteAccount = async () => {
    const { value: password } = await Swal.fire({
      title: "Confirm Password",
      input: "password",
      inputLabel: "Enter your current password to proceed",
      inputPlaceholder: "Password",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Verify",
      showLoaderOnConfirm: true,
      preConfirm: async (pass) => {
        try {
          const token = localStorage.getItem("token");
          const res = await verifyPasswordBeforeDelete(pass, token);
          if (!res?.success) {
            throw new Error(res.message || "Invalid password");
          }
          return true;
        } catch (err) {
          const backendMsg =
            err?.response?.data?.message ||
            err.message ||
            "Something went wrong";
          Swal.showValidationMessage(backendMsg);
          return false;
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (password) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will delete your account permanently!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await deleteAccount(token);

          localStorage.clear();
          sessionStorage.clear();
          Swal.fire("Deleted!", "Your account has been deleted.", "success");

          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 1500);
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire("Error", "Something went wrong. Try again.", "error");
        }
      }
    }
  };

  return (
    <>
      <Card className="p-4 shadow-sm">
        <h4 className="mb-4">
          Settings -- COMING SOON (DEVELOPMENT IN PROGRESS 🧑‍💻)
        </h4>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  value={settings.name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  readOnly
                  value={settings.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Change Password</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3 position-relative">
                      <Form.Label>Current Password</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showCurrent ? "text" : "password"}
                          placeholder="Current Password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <span
                          onClick={() => setShowCurrent((prev) => !prev)}
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "10px",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#888",
                          }}
                        >
                          {showCurrent ? <BsEyeSlash /> : <BsEye />}
                        </span>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3 position-relative">
                      <Form.Label>New Password</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showNew ? "text" : "password"}
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <span
                          onClick={() => setShowNew((prev) => !prev)}
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "10px",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#888",
                          }}
                        >
                          {showCurrent ? <BsEyeSlash /> : <BsEye />}
                        </span>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3 position-relative">
                      <Form.Label>Confirm Password</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showConfirm ? "text" : "password"}
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span
                          onClick={() => setShowConfirm((prev) => !prev)}
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "10px",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#888",
                          }}
                        >
                          {showCurrent ? <BsEyeSlash /> : <BsEye />}
                        </span>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  variant="outline-primary"
                  onClick={handleChangePassword}
                >
                  Update Password
                </Button>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Preferences</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        name="country"
                        value={settings.country}
                        onChange={handleChange}
                        placeholder="e.g., India"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Currency</Form.Label>
                      <Form.Select
                        name="currency"
                        value={settings.currency}
                        onChange={handleChange}
                      >
                        <option value="INR">INR ₹</option>
                        <option value="USD">USD $</option>
                        <option value="EUR">EUR €</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Select
                      name="dateFormat"
                      value={settings.dateFormat}
                      onChange={handleChange}
                    >
                      <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                      <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                      <option value="yyyy-MM-dd">YYYY-MM-DD</option>
                      <option value="do MMMM yyyy">5th April 2025</option>
                      <option value="MMMM do, yyyy">April 5th, 2025</option>
                    </Form.Select>
                  </Col>
                  <Col md={6} className="d-flex align-items-end">
                    <Form.Check
                      type="switch"
                      label="Dark Mode"
                      checked={settings.theme === "dark"}
                      onChange={handleThemeToggle}
                    />
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>Financial Goal</Accordion.Header>
              <Accordion.Body>
                <Form.Group>
                  <Form.Label>
                    Monthly Goal ({prefs.currency})
                    {prefs.currency !== "INR" && settings.monthlyGoal && (
                      <span className="text-muted ms-1 small">
                        (Converted from ₹
                        {Number(settings.monthlyGoal).toLocaleString("en-IN")})
                      </span>
                    )}
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="monthlyGoal"
                    value={
                      settings.monthlyGoal !== ""
                        ? Number(settings.monthlyGoal).toLocaleString("en-IN")
                        : ""
                    }
                    onChange={(e) => {
                      const raw = e.target.value.replace(/,/g, "");
                      if (!isNaN(raw)) {
                        setSettings((prev) => ({
                          ...prev,
                          monthlyGoal: raw,
                        }));
                      }
                    }}
                    placeholder="Enter your monthly goal"
                  />

                  {prefs.currency !== "INR" && settings.monthlyGoal && (
                    <div className="mt-1 small text-success fw-semibold">
                      ≈
                      {formatCurrency(
                        getConvertedGoal(),
                        prefs.currency,
                        exchangeRates
                      )}
                    </div>
                  )}
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>Recent Login Activity</Accordion.Header>
              <Accordion.Body>
                {visibleLogins.length === 0 ? (
                  <p className="text-muted">No recent activity found.</p>
                ) : (
                  <ul className="small ps-2">
                    {visibleLogins.map((entry, idx) => (
                      <li key={idx} className="mb-2">
                        <span className="text-danger me-2">📍</span>
                        <strong>IP:</strong>{" "}
                        <span className="text-primary">{entry.ipAddress}</span>{" "}
                        | <span className="text-primary">{entry.browser}</span>
                        <br />
                        <small className="text-muted">
                          {new Date(entry.loggedInAt).toLocaleString()}
                        </small>
                      </li>
                    ))}
                  </ul>
                )}

                {loginHistory.length > 5 && (
                  <Button
                    variant="link"
                    className="px-0 text-decoration-none"
                    onClick={() => setShowAll((prev) => !prev)}
                  >
                    {showAll ? "Show Less ▲" : "Show More ▼"}
                  </Button>
                )}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>Tax Report</Accordion.Header>
              <Accordion.Body>
                <Button variant="outline-success" onClick={downloadTaxReport}>
                  Download Tax Report
                </Button>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
              <Accordion.Header>Danger Zone</Accordion.Header>
              <Accordion.Body>
                <Button
                  variant="outline-danger"
                  className="w-100"
                  onClick={handleDeleteAccount}
                >
                  Delete My Account
                </Button>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Button
            variant="primary"
            className="mt-4 w-100"
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
        </Form>
      </Card>
    </>
  );
};

export default SettingsPage;
