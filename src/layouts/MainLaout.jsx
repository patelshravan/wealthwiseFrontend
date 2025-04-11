import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div
        style={{
          width: collapsed ? "70px" : "250px",
          flexShrink: 0,
          height: "100vh",
          overflowY: "auto",
          position: "sticky",
          top: 0,
          zIndex: 1020,
          backgroundColor: "var(--sidebar-bg)",
        }}
      >
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Main Content */}
      <div className="d-flex flex-column flex-grow-1 overflow-hidden">
        {/* Header */}
        <div
          style={{
            height: "60px",
            flexShrink: 0,
            position: "sticky",
            top: 0,
            zIndex: 1030,
            backgroundColor: "var(--header-bg)",
          }}
        >
          <Header onLogout={handleLogout} onToggleSidebar={toggleSidebar} />
        </div>

        {/* Scrollable Page Area */}
        <div
          style={{
            flexGrow: 1,
            overflowY: "auto",
            padding: "24px",
            backgroundColor: "var(--body-bg)",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
