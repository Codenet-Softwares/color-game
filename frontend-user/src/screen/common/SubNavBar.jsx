import React, { useEffect, useState } from "react";
import { FaCoins, FaUser, FaDollarSign } from "react-icons/fa";
import ansmt from "../../asset/ancmntv.png";
import { useAppContext } from "../../contextApi/context";
import Logo from "../../asset/Logo.png";
import {
  getAnnouncement,
  getInnerAnnouncement,
  userWallet,
} from "../../utils/apiService";
import Login from "../loginModal/loginModal";
import OpenBetsOffCanvas from "../../components/OpenBetsOffCanvas";
import strings from "../../utils/constant/stringConstant";

const SubNavbar = ({ openBetData, handleOpenBetsSelectionMenu }) => {
  const { store, dispatch } = useAppContext();
  const [announcementInnerData, setAnnouncemenInnertData] = useState([]);
  const [announcementOuterData, setAnnouncementOuterData] = useState([]);
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

  console.log("window====>", isMobile);

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
    if (accessTokenFromStore) handleUserWallet();
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

  const fetchOuterAnnouncement = async () => {
    try {
      const response = await getAnnouncement();
      if (response && response.data) {
        setAnnouncementOuterData(response.data);
      } else {
        console.error("error", response);
        setAnnouncementOuterData([]);
      }
    } catch (error) {
      console.error("error", error);
      setAnnouncementOuterData([]);
    }
  };

  const fetchInnerAnnouncement = async () => {
    try {
      const response = await getInnerAnnouncement();
      if (response && response.data) {
        setAnnouncemenInnertData(response.data);
      } else {
        console.error("Error fetching announcements", response);
        setAnnouncemenInnertData([]);
      }
    } catch (error) {
      console.error("Error fetching announcements", error);
      setAnnouncemenInnertData([]);
    }
  };

  useEffect(() => {
    fetchInnerAnnouncement();
    fetchOuterAnnouncement();
  }, []);

  return (
    <>
      <nav className="user_navbar p-0">
        {store.user.isLogin ? (
          <div
            className="w-100 d-flex justify-content-between "
            style={{ background: "#f1ac44" }}
          >
            <img src={ansmt} alt="Announcement" className="announcementImg" />
            <marquee className="text-black" style={{ fontSize: "18px" }}>
              {announcementInnerData
                .map((item) => item.announcement)
                .join(" | ")}
            </marquee>
            <span
              className="text-nowrap text-black px-2"
              style={{ fontSize: "14px" }}
            >
              {formattedDate}
            </span>
          </div>
        ) : (
          <div
            className="w-100 d-flex justify-content-between "
            style={{ background: "#f1ac44" }}
          >
            <img src={ansmt} alt="Announcement" className="announcementImg" />
            <marquee className="text-black" style={{ fontSize: "18px" }}>
              {announcementOuterData
                .map((item) => item.announcement)
                .join(" | ")}
            </marquee>
            <span
              className="text-nowrap text-black px-2"
              style={{ fontSize: "14px" }}
            >
              {formattedDate}
            </span>
          </div>
        )}

        <div
          className="container-fluid d-flex align-items-center justify-content-between"
          style={{
            maxWidth: "100%",
            padding: store?.user?.islogin ? "4px 10px" : "",
          }}
        >
          {/* {store.user.isLogin && (
            <div className="d-flex flex-column">
              <div className="mt-4"></div>
              <button
                className="btn border border-white mt-2 d-lg-none hambargerIcon "
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
                  className="fw-bold text-white"
                  style={{ fontSize: "12px", marginBottom: "2px" }}
                >
                  Bets
                </small>
                <FaDollarSign size={15} color="white" />
              </button>
            </div>
          )} */}

          <OpenBetsOffCanvas
            handleOpenBetsSelectionMenu={handleOpenBetsSelectionMenu}
            openBetData={openBetData}
          />
          <a className="navbar-brand" href={`/home`}>
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
                        {
                          exposureAndWallet.exposure ??
                          store?.user?.wallet?.exposure ??
                          0
                       }
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
                      onClick={() => setIsRefresh((prev) => !prev)}
                    >
                      <i class="fa fa-rotate-left text-white"></i>
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
                <span
                  className="btn text-white"
                  style={{
                    backgroundColor: "#f6a21e",
                    fontSize: "13px",
                    border: "2px solid white",
                    borderRadius: "12px",
                    padding: "6px 10px",
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
        </div>
      </nav>
      <Login showLogin={showModalLogin} setShowLogin={setShowModalLogin} />
    </>
  );
};

export default SubNavbar;
