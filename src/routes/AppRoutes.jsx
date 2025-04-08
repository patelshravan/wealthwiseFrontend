import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import PublicRoute from "../components/PublicRoute";
import PrivateRoute from "../components/PrivateRoute";
import ProfilePage from "../pages/features/ProfilePage";
import DashboardPage from "../pages/features/DashboardPage";
import ExpensePage from "../pages/features/ExpensePage";
import SavingsPage from "../pages/features/SavingsPage";
import MainLayout from "../layouts/MainLaout";
import AuthLayout from "../layouts/AuthLayout";
import InvestmentPage from "../pages/features/InvestmentPage";
import PolicyPage from "../pages/features/PolicyPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Pages */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route
          path="login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />
        <Route
          path="reset-password"
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />
        <Route
          path="verify-otp/:type"
          element={
            <PublicRoute>
              <VerifyOtpPage />
            </PublicRoute>
          }
        />
      </Route>

      {/* Protected Pages */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="/expenses" element={<ExpensePage />} />
        <Route path="/savings" element={<SavingsPage />} />
        <Route path="/investments" element={<InvestmentPage />} />
        <Route path="/policies" element={<PolicyPage />} />
        {/* Default route */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;
