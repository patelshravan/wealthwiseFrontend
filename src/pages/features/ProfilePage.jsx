import React, { useEffect, useState } from "react";
import { Form, Button, Card, Spinner, Image } from "react-bootstrap";
import { getUserProfile, updateUserProfile } from "../../services/user.service";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import defaultAvatar from "../../assets/default-avatar.png";

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const [originalUser, setOriginalUser] = useState({});

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
      const response = await updateUserProfile(storedUser._id, user, token);
      const updatedUser = response.data;

      // 🔄 Update localStorage with full user object
      localStorage.setItem("user", JSON.stringify(updatedUser));

      window.dispatchEvent(new Event("storage")); // Optional: trigger listeners
      toast.success("Profile updated successfully");

      setOriginalUser(updatedUser);
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
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
                disabled
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
    </div>
  );
};

export default ProfilePage;
