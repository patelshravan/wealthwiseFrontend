import React, { useState } from "react";
import { Form, Button, Spinner, InputGroup } from "react-bootstrap";
import { resetPassword } from "../../services/auth.service";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPasswordPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [email] = useState(state?.email || "");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);
        try {
            const res = await resetPassword(email, newPassword, confirmPassword);
            toast.success(res?.data?.message || "Password updated!");
            navigate("/auth/login");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h4 className="mb-3 text-center">Reset Your Password</h4>
            <Form onSubmit={handleReset}>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type={showNewPass ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <Button
                            variant="outline-secondary"
                            onClick={() => setShowNewPass((prev) => !prev)}
                            tabIndex={-1}
                        >
                            {showNewPass ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type={showConfirmPass ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <Button
                            variant="outline-secondary"
                            onClick={() => setShowConfirmPass((prev) => !prev)}
                            tabIndex={-1}
                        >
                            {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                    </InputGroup>
                </Form.Group>

                <Button type="submit" className="w-100" disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : "Reset Password"}
                </Button>
            </Form>
        </>
    );
};

export default ResetPasswordPage;
