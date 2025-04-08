import React, { useState, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import {
    verifyOtp,
    resendEmailOtp,
    resendPasswordResetOtp,
} from "../../services/auth.service";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const RESEND_TIMEOUT = 30; // seconds

const VerifyOtpPage = () => {
    const { type } = useParams(); // "email" or "reset"
    const { state } = useLocation();
    const navigate = useNavigate();

    const [email, setEmail] = useState(state?.email || "");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [timer, setTimer] = useState(RESEND_TIMEOUT);

    // Countdown logic
    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await verifyOtp(email, otp, type);
            toast.success(res?.data?.message || "OTP verified successfully!");
            navigate(type === "reset" ? "/auth/reset-password" : "/auth/login", {
                state: { email },
            });
        } catch (err) {
            toast.error(err?.response?.data?.message || "Invalid OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!email) {
            return toast.error("Please enter your email.");
        }

        setResending(true);
        try {
            const res =
                type === "reset"
                    ? await resendPasswordResetOtp(email)
                    : await resendEmailOtp(email);
            toast.success(res?.data?.message || "OTP resent successfully!");
            setTimer(RESEND_TIMEOUT); // Restart countdown
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to resend OTP.");
        } finally {
            setResending(false);
        }
    };

    return (
        <>
            <h4 className="text-center mb-3">
                {type === "reset" ? "Verify OTP to Reset Password" : "Verify Your Email"}
            </h4>

            <Form onSubmit={handleVerify}>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>OTP</Form.Label>
                    <Form.Control
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button type="submit" className="w-100 mb-2" disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : "Verify OTP"}
                </Button>

                <div className="text-center">
                    <Button
                        variant="link"
                        className="p-0"
                        onClick={handleResendOtp}
                        disabled={resending || timer > 0}
                    >
                        {resending
                            ? "Resending..."
                            : timer > 0
                                ? `Resend OTP in ${timer}s`
                                : "Resend OTP"}
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default VerifyOtpPage;
