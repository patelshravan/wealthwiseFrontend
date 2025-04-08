import React, { useState } from "react";
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Accordion,
  Modal,
} from "react-bootstrap";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    name: "John Doe",
    email: "john@example.com",
    mobile: "",
    country: "India",
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
    theme: "light",
    monthlyGoal: "",
  });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

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

  const handleVerifyOtp = async () => {
    if (otp === "123456") {
      // Assume success
      console.log("OTP verified. Email updated to", pendingEmail);
      setShowOtpModal(false);
      // Later: Call backend to update profile with verified email
    } else {
      alert("Invalid OTP. Try again.");
    }
  };

  return (
    <>
      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Verify New Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Enter OTP sent to {pendingEmail}</Form.Label>
            <Form.Control
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOtpModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleVerifyOtp}>
            Verify & Save Email
          </Button>
        </Modal.Footer>
      </Modal>

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
                  value={settings.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              name="mobile"
              value={settings.mobile}
              onChange={handleChange}
              placeholder="+91 9876543210"
            />
          </Form.Group>

          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Change Password</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="New Password"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control type="password" placeholder="Confirm" />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="outline-primary">Update Password</Button>
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
