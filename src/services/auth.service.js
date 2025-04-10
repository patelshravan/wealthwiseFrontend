import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export const register = (name, email, password, confirmPassword) =>
  axios.post(`${API_BASE}/auth/register`, {
    name,
    email,
    password,
    confirmPassword,
  });

export const login = (email, password) =>
  axios.post(`${API_BASE}/auth/login`, { email, password });

export const verifyOtp = (email, otp, type) =>
  axios.post(`${API_BASE}/auth/verify-otp`, { email, otp, type });

export const forgotPassword = (email) =>
  axios.post(`${API_BASE}/auth/forgot-password`, { email });

export const resetPassword = (email, newPassword, confirmPassword) =>
  axios.post(`${API_BASE}/auth/reset-password`, {
    email,
    newPassword,
    confirmPassword,
  });

export const changePassword = (email, currentPassword, newPassword, confirmPassword) =>
  axios.post(`${API_BASE}/auth/change-password`, {
    email,
    currentPassword,
    newPassword,
    confirmPassword,
  });

export const resendEmailOtp = (email) =>
  axios.post(`${API_BASE}/auth/resend-otp`, { email });

export const resendPasswordResetOtp = (email) =>
  axios.post(`${API_BASE}/auth/resend-password-reset-otp`, { email });
