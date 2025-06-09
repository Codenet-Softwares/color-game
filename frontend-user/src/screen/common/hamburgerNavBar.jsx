import React, { useState } from "react";
import { FaHome, FaPlay, FaBars, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contextApi/context";
import "./hamburgerNavBar.css";
import Login from "../loginModal/loginModal";
import NotificationIcon from "../Notification/NotificationIcon";

const HamburgerNavBar = () => {
  const [activeIcon, setActiveIcon] = useState(null);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const { store } = useAppContext();
  const navigate = useNavigate();

  const handleIconHover = (icon) => {
    setActiveIcon(icon);
    if (icon === "home") {
      navigate("/");
    }
  };

  function handleLogin() {
    if (!store.user.isLogin) {
      setIsLoginModal(!isLoginModal);
    }
  }

  if (!store.user.isLogin) return null;

  return (
    <div className="hamburger-navbar-container">
      <nav className="hamburger-navbar">
        {/* Home */}
        <button
          className="nav-item"
          title="Home"
          onClick={() => navigate("/home")}
          aria-label="Home"
        >
          <FaHome className="nav-icon" />
          <span className="nav-label">Home</span>
        </button>

        {/* In-Play */}
        <button
          className="nav-item"
          title="In-Play"
          onClick={() => navigate("/home")}
          aria-label="In-Play"
        >
          <FaPlay className="nav-icon" />
          <span className="nav-label">In-Play</span>
        </button>
        {/* notification */}
        <button
          className="nav-item"
          title="Notifications"
          aria-label="Notifications"
        >
          <NotificationIcon    isMobile={true} />
          <span className="nav-label">Notifications</span>
        </button>

        {/* Menu */}
        <button
          className="nav-item"
          title="Menu"
          onClick={handleLogin}
          data-bs-toggle={store.user.isLogin ? "offcanvas" : ""}
          data-bs-target="#offcanvasDarkNavbar"
          aria-label="Menu"
        >
          <FaBars className="nav-icon" />
          <span className="nav-label">Menu</span>
          <Login showLogin={isLoginModal} setShowLogin={setIsLoginModal} />
        </button>
      </nav>
    </div>
  );
};

export default HamburgerNavBar;
