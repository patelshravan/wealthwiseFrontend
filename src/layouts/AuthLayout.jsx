import React from "react";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

const AuthLayout = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 auth-wrapper">
      <Container
        className="p-4 bg-white rounded shadow-sm"
        style={{ maxWidth: 400 }}
      >
        <Outlet />
      </Container>
    </div>
  );
};

export default AuthLayout;
