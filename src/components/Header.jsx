import React, { useEffect, useState } from "react";
import { Button, Navbar, Container, Dropdown, Image } from "react-bootstrap";
import { List, ChevronDown } from "react-bootstrap-icons";
import defaultAvatar from "../assets/default-avatar.png";
import Swal from "sweetalert2";

const Header = ({ onLogout, onToggleSidebar }) => {
  const [user, setUser] = useState({
    name: "Guest",
    profileImage: defaultAvatar,
  });

  useEffect(() => {
    const loadUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      setUser({
        name: storedUser.name || "Guest",
        profileImage: storedUser.profileImage || defaultAvatar,
      });
    };

    loadUser();

    // 🔁 Listen to localStorage changes (e.g., profile update)
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  // 🔧 Custom dropdown toggle to avoid Bootstrap caret
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="d-flex align-items-center gap-2"
      style={{ cursor: "pointer" }}
    >
      {children}
    </div>
  ));

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from this session.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      onLogout();
    }
  };

  return (
    <Navbar className="shadow-sm px-4 bg-light">
      <Container fluid>
        <Button variant="light" className="me-3" onClick={onToggleSidebar}>
          <List size={24} />
        </Button>
        <div className="ms-auto d-flex align-items-center gap-3">
          <Dropdown align="end">
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom">
              <Image
                src={user.profileImage}
                roundedCircle
                width={40}
                height={40}
                alt="User"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
              />
              <span className="fw-semibold">{user.name}</span>
              <ChevronDown />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="/profile">Profile</Dropdown.Item>
              <Dropdown.Item href="/settings">Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
