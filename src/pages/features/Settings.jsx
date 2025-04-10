import React, { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col, Accordion } from "react-bootstrap";
import { toast } from "react-toastify";
import { changePassword } from "../../services/auth.service";
import { BsEye, BsEyeSlash } from "react-icons/bs";

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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setSettings((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
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
    if (settings.email !== "john@example.com") {
      // Simulate backend OTP request
      console.log("Sending OTP to:", settings.email);
      setPendingEmail(settings.email);
      setShowOtpModal(true);
    } else {
      console.log("Saving other settings...");
      // Later: Send other updated values to backend
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
                    <Form.Group className="mb-3">
                      <Form.Label>Date Format</Form.Label>
                      <Form.Select
                        name="dateFormat"
                        value={settings.dateFormat}
                        onChange={handleChange}
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      </Form.Select>
                    </Form.Group>
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
                  <Form.Label>Monthly Goal (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="monthlyGoal"
                    value={settings.monthlyGoal}
                    onChange={handleChange}
                    placeholder="Enter your monthly goal"
                  />
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>Recent Login Activity</Accordion.Header>
              <Accordion.Body>
                <ul>
                  <li>📍 IP: 192.168.1.1 | Chrome on Windows 10</li>
                  <li>📍 IP: 103.23.45.21 | Safari on iPhone</li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>Tax Report</Accordion.Header>
              <Accordion.Body>
                <Button variant="outline-success">Download Tax Report</Button>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
              <Accordion.Header>Danger Zone</Accordion.Header>
              <Accordion.Body>
                <Button variant="outline-danger" className="w-100">
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
