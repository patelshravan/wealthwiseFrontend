import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { forgotPassword } from "../../services/auth.service";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await forgotPassword(email);
            toast.success(res?.data?.message || "OTP sent to your email!");
            navigate("/auth/verify-otp/reset", { state: { email } });
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h4 className="mb-3 text-center">Forgot Password</h4>

            <Form onSubmit={handleSendOtp}>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button
                    type="submit"
                    className="w-100 mb-3"
                    variant="primary"
                    disabled={loading}
                >
                    {loading ? <Spinner size="sm" animation="border" /> : "Send OTP"}
                </Button>

                <div className="text-center">
                    <Link to="/auth/login" className="text-decoration-none">
                        <Button variant="link" className="p-0">← Back to Login</Button>
                    </Link>
                </div>
            </Form>
        </>
    );
};

export default ForgotPasswordPage;
