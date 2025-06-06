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
        className="navbar fixed-bottom navbar-light d-lg-none d-md-none "
        style={{
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
          background: "#25616a",
        }}
      >
        <div
          className={`col-3 col-md text-center text-white mx-4  ${
            activeIcon === "home" ? "active-icon" : ""
          }`}
          title="Home"
          onMouseEnter={() => handleIconHover("home")}
        >
          <div>
            <FaHome />
          </div>
          {activeIcon === "home" && <div className="hover-text ">Home</div>}
        </div>

        <div
          className={`col-3 col-md text-center text-white mx-4${
            activeIcon === "menu" ? "active-icon" : ""
          }`}
          title="Menu"
          onMouseEnter={() => handleIconHover("menu")}
        >
          <div
            onClick={handleLogin}
            data-bs-toggle={store.user.isLogin ? "offcanvas" : ""}
            data-bs-target="#offcanvasDarkNavbar"
          >
            <FaBars />
          </div>
          {activeIcon === "menu" && <div className="hover-text">Menu</div>}
          <Login showLogin={isLoginModal} setShowLogin={setIsLoginModal} />
        </div>
      </div>
    </div>
  );
};

export default HamburgerNavBar;
