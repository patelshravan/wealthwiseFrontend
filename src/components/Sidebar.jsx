import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  BsBarChartLine,
  BsCreditCard2Front,
  BsPiggyBank,
  BsGraphUpArrow,
  BsFileEarmarkText,
} from "react-icons/bs";

import logoFull from "../assets/logo-full.png";
import logoSm from "../assets/logo-sm.png";

const Sidebar = ({ collapsed }) => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <BsBarChartLine /> },
    { path: "/expenses", label: "Expense", icon: <BsCreditCard2Front /> },
    { path: "/savings", label: "Savings", icon: <BsPiggyBank /> },
    { path: "/investments", label: "Investment", icon: <BsGraphUpArrow /> },
    { path: "/policies", label: "LIC Policy", icon: <BsFileEarmarkText /> },
  ];

  return (
    <div
      className="vh-100 d-flex flex-column border-end"
      style={{
        backgroundColor: "var(--sidebar-bg)",
        width: collapsed ? "70px" : "250px",
        transition: "width 0.3s",
      }}
    >
      {/* Logo */}
      <div className="text-center py-3 border-bottom">
        <img
          src={collapsed ? logoSm : logoFull}
          alt="Logo"
          width={collapsed ? 30 : 150}
        />
      </div>

      {/* Nav Links */}
      <Nav className="flex-column mt-3">
        {navItems.map((item, idx) => (
          <Nav.Link
            as={Link}
            to={item.path}
            key={idx}
            className={`d-flex align-items-center gap-3 px-3 py-2 nav-link ${
              location.pathname === item.path
                ? "fw-bold border-start border-primary border-4 active"
                : ""
            }`}
          >
            <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
