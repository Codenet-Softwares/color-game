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
          background: "#f1ac44",
        }}
        onClick={() => navigate("/home")}
      >
        <div className="col-3 col-md text-center text-white mx-4" title="Home">
          <div>
            <FaHome size={24} />
          </div>
          <div className="mt-1">Home</div>
        </div>

        <div
          className={`col-3 col-md text-center text-white `}
          title="Video Play"
          onClick={() => navigate("/home")}
        >
          <div>
            <FaPlay size={24} />
          </div>
          <div className="mt-1">In-Play</div>
        </div>
        <div
          className={`col-3 col-md text-center text-white mx-4`}
          title="Menu"
        >
          <div
            onClick={handleLogin}
            data-bs-toggle={store.user.isLogin ? "offcanvas" : ""}
            data-bs-target="#offcanvasDarkNavbar"
          >
            <FaBars size={24} />
          </div>
          <div className="hover-text">Menu</div>
          <Login showLogin={isLoginModal} setShowLogin={setIsLoginModal} />
        </div>
      </div>
    </div>
  );
};

export default HamburgerNavBar;
