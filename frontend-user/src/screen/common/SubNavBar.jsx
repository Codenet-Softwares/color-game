import React, { useEffect, useState } from "react";
import { FaCoins, FaUser, FaDollarSign } from "react-icons/fa";
import { useAppContext } from "../../contextApi/context";
import Logo from "../../asset/Logo.png";
import {
  userWallet,
} from "../../utils/apiService";
import Login from "../loginModal/loginModal";
import OpenBetsOffCanvas from "../../components/OpenBetsOffCanvas";
import strings from "../../utils/constant/stringConstant";
import NotificationIcon from "../Notification/NotificationIcon";
import "./SubNavBar.css";

const SubNavbar = ({ openBetData, handleOpenBetsSelectionMenu }) => {
  const { store, dispatch } = useAppContext();
  const [showModalLogin, setShowModalLogin] = useState(false);
  const currentDate = new Date();
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);
  const [exposureAndWallet, setExposureAndWallet] = useState({
    exposure: null,
    wallet: null,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth);
  const [isRefresh, setIsRefresh] = useState(false);
  const [rotate, setRotate] = useState(false);
  const handleClick = () => {
    setIsRefresh((prev) => !prev);
    setRotate(true);
    setTimeout(() => {
      setRotate(false);
    }, 500);
  };

  const accessTokenFromStore = JSON.parse(
    localStorage.getItem(strings.LOCAL_STORAGE_KEY)
  )?.user?.accessToken;

  const handleUserWallet = async () => {
    const response = await userWallet(store.user.userId, true);
    if (response) {
      dispatch({
        type: strings.UserWallet,
        payload: {
          ...response.data,
        },
      });
    }
  };
  useEffect(() => {
    if (store?.user?.isLogin && accessTokenFromStore) handleUserWallet();
  }, [isRefresh, accessTokenFromStore]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let currentExposure = null;
    store.user.wallet?.marketListExposure.forEach((entry) => {
      currentExposure += Object.values(entry)[0];
    });

    setExposureAndWallet({
      ...exposureAndWallet,
      exposure: currentExposure,
    });
  }, [store.user.wallet?.marketListExposure]);

  return store?.user?.isLogin ? (
    <>
      <nav className="user_navbar p-0">
        <div
          className="container-fluid d-flex align-items-center justify-content-between "
          style={{
            maxWidth: "100%",
            padding: store?.user?.islogin ? "4px 10px" : "",
          }}
        >
          <OpenBetsOffCanvas
            handleOpenBetsSelectionMenu={handleOpenBetsSelectionMenu}
            openBetData={openBetData}
          />
          <a href="/home" className="navbar-brand">
            <img
              src={Logo}
              alt="Logo"
              style={{
                width: "90px",
                maxWidth: "100%",
                height: "auto",
              }}
              className="img-fluid"
            />
          </a>
          <div className="d-flex align-items-center ms-auto">
            <div className="me-3 d-flex align-items-center">
              <NotificationIcon isMobile={isMobile} />
            </div>
            <button className="navbar-toggler border-0" type="button">
              {store.user.isLogin ? (
                <div className="d-flex align-items-center">
                  <span className="d-flex flex-column align-items-start me-2">
                    <span
                      className="w-100 d-flex align-items-center text-white fw-bold"
                      style={{
                        height: "30px",
                        fontSize: "12px",
                        padding: "5px 8px",
                      }}
                    >
                      Main PTI {store?.user?.wallet?.balance}
                    </span>
                    <span
                      className="w-100 d-flex align-items-center text-white fw-bold"
                      style={{
                        height: "30px",
                        fontSize: "12px",
                        padding: "5px 8px",
                      }}
                    >
                      Exp : (
                      <span className="text-danger">
                        {exposureAndWallet.exposure ??
                          store?.user?.wallet?.exposure ??
                          0}
                      </span>
                      )
                    </span>
                  </span>
                  <span>
                    {isMobile <= 435 && (
                      <button
                        className="btn border border-white my-1 d-lg-none hambargerIcon "
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasTop"
                        aria-controls="offcanvasTop"
                        style={{
                          width: "44px",
                          height: "35px",
                          fontSize: "18px",
                          padding: "5px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          lineHeight: "1",
                        }}
                      >
                        <small
                          className="fw-bold text-white "
                          style={{ fontSize: "12px" }}
                        >
                          Bets
                        </small>
                        <FaDollarSign size={15} color="white" />
                      </button>
                    )}

                    <button
                      className="btn btn-sm border border-white me-2 d-flex align-items-center justify-content-center text-white mx-1"
                      style={{
                        height: "35px",
                        width: "35px",
                        backgroundColor: "#2d2d2d",
                        fontSize: "14px",
                        padding: "5px 8px",
                      }}
                      onClick={handleClick}
                    >
                      <i
                        className={`fa fa-rotate-left text-warning ${
                          rotate ? "rotate" : ""
                        }`}
                      ></i>
                    </button>
                  </span>

                  {isMobile >= 435 && (
                    <button
                      className="btn btn-sm border border-white text-white fw-bold"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasDarkNavbar"
                      aria-controls="offcanvasDarkNavbar"
                      aria-label="Toggle navigation"
                      style={{
                        height: "35px",
                        backgroundColor: "#2d2d2d",
                        fontSize: "13px",
                        padding: "5px 8px",
                      }}
                    >
                      <p>
                        <FaUser
                          style={{
                            width: "12px",
                            color: "#fec015",
                          }}
                        />
                        &nbsp;&nbsp; My Account
                      </p>
                    </button>
                  )}
                </div>
              ) : (
                <></>
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  ) : (
    <>
      <nav
        className="navbar navbar-expand-lg fixed-top"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          zIndex: 1030,
          backgroundColor: "rgba(0, 0, 0, 0.15)", // translucent black background
        }}
      >
        <div className="container">
          <a href="#" className="navbar-brand">
            <img
              src={Logo}
              className="img-fluid"
              alt="Logo"
              style={{
                width: "100px",
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </a>

          {/* Login Button for Mobile (visible on small screens) */}
          <button
            type="button"
            className="btn btn-login py-1 d-block d-sm-none"
            onClick={() => setShowModalLogin(true)}
            style={{
              color: "#fff",
              borderRadius: "10px",
              padding: "20px 40px",
              fontSize: "16px",
              fontWeight: "500",
              letterSpacing: "0",
              textTransform: "uppercase",
              cursor: "pointer",
              backgroundColor: "#f6a21e",
              border: "2px solid white",
            }}
          >
            Log In
          </button>

          <div
            id="navbarSupportedContent"
            className="collapse navbar-collapse d-none d-sm-flex justify-content-end"
          >
            <form className="form-inline my-2 my-lg-0">
              <button
                type="button"
                className="btn btn-login py-2"
                onClick={() => setShowModalLogin(true)}
                style={{
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "20px 40px",
                  fontSize: "16px",
                  fontWeight: "500",
                  letterSpacing: "0",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  backgroundColor: "#f6a21e",
                  border: "2px solid white",
                }}
              >
                &nbsp;<b>Log In</b>
              </button>
            </form>
          </div>
        </div>
      </nav>
      <Login showLogin={showModalLogin} setShowLogin={setShowModalLogin} />
    </>
  );
};

export default SubNavbar;
