import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, InputGroup } from "react-bootstrap";
import { login } from "../../services/auth.service";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login: doLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedPassword = localStorage.getItem("rememberedPassword");
    if (rememberedEmail && rememberedPassword) {
      setEmail(rememberedEmail);
      setPassword(rememberedPassword);
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(email, password);
      const { token, _id, name, profileImage, message } = res.data;

      doLogin({ token });

      if (remember) {
        localStorage.setItem("token", token);
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      } else {
        sessionStorage.setItem("token", token);
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      // ✅ Save user details
      localStorage.setItem("userId", _id);
      localStorage.setItem("userName", name);
      localStorage.setItem("userAvatar", profileImage || "");

      toast.success(message || "Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err?.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h4 className="mb-3 text-center">Login</h4>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPass ? "text" : "password"}
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
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

        <div className="d-flex justify-content-between align-items-center mb-3">
          <Form.Check
            type="checkbox"
            label="Remember me"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <Link to="/auth/forgot-password" className="text-decoration-none">
            Forgot password?
          </Link>
        </div>

        <Button
          variant="primary"
          type="submit"
          className="w-100"
          disabled={loading}
        >
          {loading ? <Spinner size="sm" animation="border" /> : "Login"}
        </Button>

        <div className="text-center mt-3">
          Don’t have an account?{" "}
          <Link to="/auth/register" className="text-primary fw-semibold">
            Register
          </Link>
        </div>
      </Form>
    </>
  );
};

export default LoginPage;
