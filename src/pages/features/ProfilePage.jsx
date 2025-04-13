import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Card,
  Spinner,
  Image,
  Modal,
  FormControl,
} from "react-bootstrap";
import {
  getUserProfile,
  requestEmailUpdate,
  updateUserProfile,
  verifyEmailUpdate,
} from "../../services/user.service";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import defaultAvatar from "../../assets/default-avatar.png";

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const [originalUser, setOriginalUser] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [updatingEmail, setUpdatingEmail] = useState(false);

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserProfile(storedUser._id, token);
        setUser(res.data);
        setOriginalUser(res.data);
        setPreview(res.data.profileImage || "");
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [storedUser._id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const hasChanges = () => {
    return (
      user.name !== originalUser.name ||
      user.bio !== originalUser.bio ||
      user.mobile !== originalUser.mobile ||
      user.email !== originalUser.email ||
      user.profileImage instanceof File
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser((prev) => ({ ...prev, profileImage: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (user.email !== originalUser.email) {
        // Trigger OTP flow
        const otpRes = await requestEmailUpdate(user.email, token);
        if (otpRes.success) {
          toast.info(otpRes.message);
          setShowOtpModal(true);
        } else {
          toast.error(otpRes.message || "Failed to send OTP");
        }
      } else {
        await updateUserDetails();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
      setSaving(false);
    }
  };

  const handleVerifyOtp = async () => {
    setUpdatingEmail(true);
    try {
      const verifyRes = await verifyEmailUpdate(otp, token);
      if (verifyRes.success) {
        toast.success("Email updated successfully");
        setShowOtpModal(false);
        await updateUserDetails(); // Proceed with saving profile
      } else {
        toast.error(verifyRes.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error("OTP verification failed");
    } finally {
      setUpdatingEmail(false);
    }
  };

  const updateUserDetails = async () => {
    const response = await updateUserProfile(storedUser._id, user, token);
    const updatedUser = response.data;

    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("storage"));
    toast.success("Profile updated successfully");
    setOriginalUser(updatedUser);
    setSaving(false);
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      <div className="w-100" style={{ maxWidth: "600px" }}>
        <Card className="p-4 shadow-sm">
          <h4 className="mb-3 text-center">My Profile</h4>
          <Form onSubmit={handleSubmit}>
            <div className="mb-4 text-center position-relative">
              <Image
                src={preview || defaultAvatar}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
                roundedCircle
                width={120}
                height={120}
                style={{ objectFit: "cover", aspectRatio: 1 }}
              />
              <label
                htmlFor="profileImage"
                className="position-absolute bg-white rounded-circle p-2 shadow-sm"
                style={{
                  bottom: "0",
                  right: "calc(50% - 60px)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FaCamera />
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={user.name || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={user.email || ""}
                onChange={(e) => {
                  setUser((prev) => ({ ...prev, email: e.target.value }));
                  setNewEmail(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                name="mobile"
                value={user.mobile || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                name="bio"
                rows={3}
                value={user.bio || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Button
              type="submit"
              disabled={saving || !hasChanges()}
              className="w-100"
            >
              {saving ? "Updating..." : "Update Profile"}
            </Button>
          </Form>
        </Card>
      </div>
      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Email Verification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Please enter the OTP sent to <strong>{newEmail}</strong>
          </p>
          <FormControl
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOtpModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleVerifyOtp}
            disabled={updatingEmail}
          >
            {updatingEmail ? "Verifying..." : "Verify OTP"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfilePage;
