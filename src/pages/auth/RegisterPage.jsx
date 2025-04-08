import React, { useState } from "react";
import { Form, Button, Spinner, InputGroup } from "react-bootstrap";
import { register } from "../../services/auth.service";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await register(
                form.name,
                form.email,
                form.password,
                form.confirmPassword
            );
            toast.success(res?.data?.message || "Registered successfully! Please verify OTP.");
            navigate("/auth/verify-otp/email", { state: { email: form.email } });
        } catch (err) {
            toast.error(err?.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const passwordsMatch = form.password === form.confirmPassword;

    return (
        <>
            <h4 className="mb-3 text-center">Create an Account</h4>
            <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                        name="name"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type={showPass ? "text" : "password"}
                            name="password"
                            placeholder="Create a password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        <Button
                            variant="outline-secondary"
                            onClick={() => setShowPass((prev) => !prev)}
                            tabIndex={-1}
                        >
                            {showPass ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type={showConfirm ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Re-enter your password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            isInvalid={form.confirmPassword && !passwordsMatch}
                        />
                        <Button
                            variant="outline-secondary"
                            onClick={() => setShowConfirm((prev) => !prev)}
                            tabIndex={-1}
                        >
                            {showConfirm ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                        <Form.Control.Feedback type="invalid">
                            Passwords do not match
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                <Button
                    variant="success"
                    type="submit"
                    className="w-100"
                    disabled={loading || !passwordsMatch}
                >
                    {loading ? <Spinner size="sm" animation="border" /> : "Register"}
                </Button>

                <div className="text-center mt-3">
                    Already have an account?{" "}
                    <Link to="/auth/login" className="text-primary fw-semibold">
                        Login
                    </Link>
                </div>
            </Form>
        </>
    );
};

export default RegisterPage;
