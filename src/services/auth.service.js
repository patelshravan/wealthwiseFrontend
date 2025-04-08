import axios from "axios";

// const API_BASE = "http://localhost:5000/v1/auth";
const API_BASE = "https://wealthwise-backend-6nis.onrender.com/v1/auth";

export const register = (name, email, password, confirmPassword) =>
    axios.post(`${API_BASE}/register`, { name, email, password, confirmPassword });

export const login = (email, password) =>
    axios.post(`${API_BASE}/login`, { email, password });

export const verifyOtp = (email, otp, type) =>
    axios.post(`${API_BASE}/verify-otp`, { email, otp, type });

export const forgotPassword = (email) =>
    axios.post(`${API_BASE}/forgot-password`, { email });

export const resetPassword = (email, newPassword, confirmPassword) =>
    axios.post(`${API_BASE}/reset-password`, { email, newPassword, confirmPassword });

export const resendEmailOtp = (email) =>
    axios.post(`${API_BASE}/resend-otp`, { email });

export const resendPasswordResetOtp = (email) =>
    axios.post(`${API_BASE}/resend-password-reset-otp`, { email });
