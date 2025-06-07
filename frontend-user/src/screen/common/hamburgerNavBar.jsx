import React, { useState } from "react";
import { FaHome, FaPlay, FaBars, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contextApi/context";
import Login from "../loginModal/loginModal";

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

  // ❗ Conditional rendering: Show navbar only when logged in
  if (!store.user.isLogin) return null;
  return (
<div className="container-fluid">
  <div
    className="navbar fixed-bottom navbar-light d-lg-none d-md-none"
    style={{
      borderTopLeftRadius: "15px",
      borderTopRightRadius: "15px",
      background: "#f1ac44",
    }}
  >
    <div className="d-flex justify-content-around w-100 text-white">
      {/* Home */}
      <div
        className="text-center flex-fill"
        title="Home"
        onClick={() => navigate("/home")}
        style={{ cursor: "pointer" }}
      >
        <div><FaHome size={24} /></div>
        <div className="mt-1">Home</div>
      </div>

      {/* In-Play */}
      <div
        className="text-center flex-fill"
        title="Video Play"
        onClick={() => navigate("/home")}
        style={{ cursor: "pointer" }}
      >
        <div><FaPlay size={24} /></div>
        <div className="mt-1">In-Play</div>
      </div>

      {/* Menu */}
      <div
        className="text-center flex-fill"
        title="Menu"
        onClick={handleLogin}
        data-bs-toggle={store.user.isLogin ? "offcanvas" : ""}
        data-bs-target="#offcanvasDarkNavbar"
        style={{ cursor: "pointer" }}
      >
        <div><FaBars size={24} /></div>
        <div className="mt-1">Menu</div>
        <Login showLogin={isLoginModal} setShowLogin={setIsLoginModal} />
      </div>
    </div>
  </div>
</div>

  );
};

export default HamburgerNavBar;
