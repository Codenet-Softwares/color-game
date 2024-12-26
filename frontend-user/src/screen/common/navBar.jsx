import React, { useState, useEffect } from "react";
import Logo from "../../asset/Logo.png";
import { useAppContext } from "../../contextApi/context";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  FaCoins,
  FaUser,
  FaFileAlt,
  FaMoneyCheck,
  FaChartLine,
  FaHistory,
  FaRunning,
  FaSignOutAlt,
  FaKey,
  FaBook,
  FaTicketAlt,
} from "react-icons/fa";
import Login from "../loginModal/loginModal";
import strings from "../../utils/constant/stringConstant";
import { toast } from "react-toastify";
import ansmt from "../../asset/ancmntv.png";
import AppDrawer from "./appDrawer";
import HamburgerNavBar from "./hamburgerNavBar";
import { logout, userWallet } from "../../utils/apiService";

const NavBar = () => {
  const navigate = useNavigate();
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [exposureAndWallet, setExposureAndWallet] = useState({
    exposure: null,
    wallet: null,
  });

  const { store, dispatch } = useAppContext();
  console.log("store from nav", store);

  const userId = store.user?.userId;

  const accessTokenFromStore = JSON.parse(
    localStorage.getItem(strings.LOCAL_STORAGE_KEY)
  )?.user?.accessToken;
  useEffect(() => {
    if (userId && accessTokenFromStore) {
      handleUserWallet();
    }
  }, [userId, accessTokenFromStore]);

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

  const handleUserWallet = async () => {
    console.log("userId", userId);
    const response = await userWallet(userId, true);
    console.log("response wallet=>>>>", response);
    if (response) {
      dispatch({
        type: strings.UserWallet,
        payload: {
          ...response.data,
        },
      });
      console.log(response);
    }
  };

  const handlePasswordChangeClick = () => {
    navigate("/forgetPassword");
  };

  const handleRulesPageClick = () => {
    navigate("/rulesPage");
  };

  const takeMetoProfitAndLoss = () => {
    navigate("/profit-loss");
  };

  const handleBetHistoryClick = () => {
    navigate("/betHistory");
  };

  const handleActivityLog = () => {
    navigate("/activityLog");
  };
  // handle lottery purchase history
  function handleLotteryPurchasesClick() {
    // Add your logic here for navigating or opening the lottery purchases page/modal
    console.log("Navigating to My Lottery Purchases");
    navigate("/LotteryPurchaseHistory");
  }


  function handleResultsClick() {
    // Add your logic here for navigating or opening the lottery purchases page/modal
    console.log("Navigating to Winning");
    navigate("/WinningResult");
  }
  const handleAccountStatementClick = () => {
    navigate("/accountStatement");
  };

  // const handleLogout = () => {
  //   dispatch({
  //     type: strings.LOG_OUT,
  //     payload: { isLogin: false },
  //   });
  //   const closeButton = document.querySelector(".btn-close");
  //   if (closeButton) {
  //     closeButton.click();
  //   }
  //   navigate("/home");
  //   toast.info("Logout successfully");
  // };

  const handleLogout = async () => {
    try {
      // Call the logout API
      const response = await logout({ userId }, true);

      if (response && response.success) {
        dispatch({
          type: strings.LOG_OUT,
          payload: { isLogin: false },
        });

        const closeButton = document.querySelector(".btn-close");
        if (closeButton) {
          closeButton.click();
        }

        navigate("/home");
        toast.info("Logout successfully");
      } else {
        toast.error(response.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout");
    }
  };

  // date formatting to show in Navbar
  const currentDate = new Date();
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);

  function getNav() {
    return (
      <nav
        className="navbar navbar-dark bg-dark  p-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, #0a262c, #114651, #17687a, #1b8da6, #20b3d4)",
        }}
      >
        {!store.user.isLogin && (
          <div
            class="w-100 d-flex justify-content-between"
            style={{ background: "#25616a" }}
          >
            <img
              src={ansmt}
              style={{ width: "30px", height: "30px", marginLeft: "10px" }}
            />
            {/* <FaCoins className="m-2" style={{ color: "#fec015" }} /> */}
            <marquee className="text-white">
              This is a Demo Announcement
            </marquee>
            <span
              className="text-nowrap text-white px-2"
              style={{ fontSize: "14px" }}
            >
              {formattedDate}
            </span>
          </div>
        )}

        <div class="container-fluid">
          <button
            class="btn btn-primary d-lg-none hambargerIcon"
            type="button"
            style={{ width: "44px" }}
          >
            ☰
          </button>
          <a class="navbar-brand" href={`/home`}>
            <img src={Logo} style={{ width: "150px" }} />
          </a>
          <button class="navbar-toggler border-0" type="button">
            {store.user.isLogin && store.user.isLogin ? (
              <span
                class="d-flex flex-column align-items-start"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasDarkNavbar"
                aria-controls="offcanvasDarkNavbar"
                aria-label="Toggle navigation"
              >
                <span
                  className="btn btn-info mb-1 w-100 d-flex align-items-center text-white border border-white"
                  style={{
                    height: "30px",
                    backgroundImage:
                      "linear-gradient(to top, #114551, #226575, #34879b, #47abc2, #5ad0eb)",
                    fontSize: "13px",
                  }}
                >
                  <FaCoins style={{ color: "#fec015" }} />
                  &nbsp; {store?.user?.wallet?.balance}
                </span>
                <span
                  className="btn btn-info w-100 d-flex align-items-center text-white border border-white"
                  style={{
                    height: "30px",
                    backgroundImage:
                      "linear-gradient(to top, #114551, #226575, #34879b, #47abc2, #5ad0eb)",
                    fontSize: "13px",
                  }}
                >
                  Exp : {exposureAndWallet.exposure ?? 0}
                </span>
              </span>
            ) : (
              <span
                className="btn  text-white border border-white col"
                style={{
                  backgroundImage:
                    "linear-gradient(to top, #114551, #226575, #34879b, #47abc2, #5ad0eb)",
                  fontSize: "13px",
                }}
                onClick={() => setShowModalLogin(true)}
              >
                <FaUser style={{ width: "12px" }} className="mb-1" />
                &nbsp;
                <b>LOG IN</b>
              </span>
            )}
          </button>
        </div>
      </nav>
    );
  }

  function getRightSlider() {
    return (
      <div>
        <div
          class="offcanvas offcanvas-end p-0 text-white"
          tabindex="-1"
          id="offcanvasDarkNavbar"
          aria-labelledby="offcanvasDarkNavbarLabel"
          style={{ width: "300px", background: "#0D505A" }}
        >
          <div class="offcanvas-header">
            <h6 class="offcanvas-title" id="offcanvasDarkNavbarLabel">
              <FaUser
                style={{
                  width: "12px",
                  color: "#fec015",
                }}
              />
              &nbsp;&nbsp;
              {store.user?.userName} - ({store?.user?.wallet?.balance})
            </h6>
            <button
              type="button"
              class="btn-close btn-close-dark"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav justify-content-end flex-grow-1 ">
              <li class="nav-item mb-3 align-items-start">
                <span className="d-flex flex-row gap-1">
                  <span
                    type="button"
                    class="btn  d-flex justify-content-start text-white fw-bold border border-white"
                    style={{
                      width: "500px",
                      height: "60px",
                      background: "#2FA8BA",
                    }}
                  >
                    Exposure {store.user?.wallet?.exposure}
                  </span>
                  <span
                    type="button"
                    class="btn btn-info d-flex justify-content-start text-white fw-bold border border-white"
                    style={{
                      width: "500px",
                      height: "60px",
                      background: "#2FA8BA",
                    }}
                  >
                    P&L {store.user?.wallet?.profit_loss}
                  </span>
                </span>
              </li>

              <li
                class="nav-item mb-3 align-items-start text-start"
                style={{
                  color: "white", // Initial color
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#2FA8BA"; // Color change on hover
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "white"; // Color back to original on mouse out
                }}
                onClick={handleAccountStatementClick}
              >
                <FaFileAlt
                  style={{
                    color: "#fec015",
                  }}
                />{" "}
                Account Statement
              </li>
              <li
                class="nav-item mb-3 align-items-start"
                style={{
                  color: "white", // Initial color
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#2FA8BA"; // Color change on hover
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "white"; // Color back to original on mouse out
                }}
              >
                <FaMoneyCheck
                  style={{
                    color: "#fec015",
                  }}
                />{" "}
                Rolling Commission
              </li>
              <li
                onClick={handlePasswordChangeClick}
                class="nav-item mb-3 align-items-start"
                style={{
                  color: "white", // Initial color
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#2FA8BA"; // Color change on hover
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "white"; // Color back to original on mouse out
                }}
              >
                <FaKey
                  style={{
                    color: "#fec015",
                  }}
                />{" "}
                Change Password
              </li>

              <li
                class="nav-item mb-3 align-items-start"
                style={{
                  color: "white", // Initial color
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#2FA8BA"; // Color change on hover
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "white"; // Color back to original on mouse out
                }}
                onClick={handleLotteryPurchasesClick}
              >
                <FaTicketAlt
                  style={{
                    color: "#fec015",
                  }}
                />{" "}
                My Lottery Purchases
              </li>

              <li
                class="nav-item mb-3 align-items-start"
                style={{
                  color: "white", // Initial color
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#2FA8BA"; // Color change on hover
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "white"; // Color back to original on mouse out
                }}
                onClick={handleResultsClick}  
              >
                <FaTicketAlt
                  style={{
                    color: "#fec015",
                  }}
                />{" "}
                Winning Results
              </li>

              <li
                class="nav-item mb-3 align-items-start"
                style={{
                  color: "white", // Initial color
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#2FA8BA"; // Color change on hover
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "white"; // Color back to original on mouse out
                }}
                onClick={takeMetoProfitAndLoss}
              >
                <FaChartLine
                  style={{
                    color: "#fec015",
                  }}
                />{" "}
                Profit & Loss
              </li>
              <li
                class="nav-item mb-3 align-items-start"
                onClick={handleBetHistoryClick}
                style={{
                  color: "white", // Initial color
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#2FA8BA"; // Color change on hover
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "white"; // Color back to original on mouse out
                }}
              >
                <FaHistory
                  style={{
                    color: "#fec015",
                  }}
                />{" "}
                Bets History
              </li>

              <li
                class="nav-item mb-3 align-items-start"
                onClick={handleActivityLog}
                style={{
                  color: "white", // Initial color
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#2FA8BA"; // Color change on hover
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "white"; // Color back to original on mouse out
                }}
              >
                <FaRunning
                  style={{
                    color: "#fec015",
                  }}
                />{" "}
                Activity Log
              </li>

              <li
                onClick={handleRulesPageClick}
                class="nav-item mb-3 align-items-start text-start"
                style={{
                  color: "white", // Initial color
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#2FA8BA"; // Color change on hover
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "white"; // Color back to original on mouse out
                }}
              >
                <FaBook
                  style={{
                    color: "#fec015",
                  }}
                />{" "}
                Rules
              </li>

              <li
                class="nav-item mb-3 align-items-start"
                style={{
                  color: "white", // Initial color
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#2FA8BA"; // Color change on hover
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "white"; // Color back to original on mouse out
                }}
                onClick={handleLogout}
              >
                <FaSignOutAlt
                  style={{
                    color: "#fec015",
                  }}
                />{" "}
                Logout
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  function leftNav() {
    return (
      <>
        <div
          class="offcanvas offcanvas-start"
          data-bs-scroll="true"
          data-bs-backdrop="false"
          tabindex="-1"
          id="offcanvasScrolling"
          aria-labelledby="offcanvasScrollingLabel"
          style={{ width: "300px" }}
        >
          <AppDrawer showCarousel={false} isMobile={true} />
        </div>
      </>
    );
  }

  function getBody() {
    return (
      <>
        <HamburgerNavBar />
        {getNav()}
        {getRightSlider()}
        {leftNav()}
        <Outlet />
        <Login showLogin={showModalLogin} setShowLogin={setShowModalLogin} />
      </>
    );
  }

  return <>{getBody()} </>;
};

export default NavBar;
