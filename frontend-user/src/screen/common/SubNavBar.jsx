import React, { useEffect, useState } from "react";
import { FaCoins, FaUser, FaDollarSign } from "react-icons/fa";
import ansmt from "../../asset/ancmntv.png";
import { useAppContext } from "../../contextApi/context";
import Logo from "../../asset/Logo.png";
import { getAnnouncement } from "../../utils/apiService";
import Login from "../loginModal/loginModal";
import OpenBetsOffCanvas from "../../components/OpenBetsOffCanvas";

const SubNavbar = ({ openBetData, handleOpenBetsSelectionMenu }) => {
  const { store } = useAppContext();
  const [announcementData, setAnnouncementData] = useState([]);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const currentDate = new Date();
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);
  const [exposureAndWallet, setExposureAndWallet] = useState({
    exposure: null,
    wallet: null,
  });

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

  const fetchAnnouncement = async () => {
    try {
      const response = await getAnnouncement();
      if (response && response.data) {
        setAnnouncementData(response.data);
      } else {
        console.error("error", response);
        setAnnouncementData([]);
      }
    } catch (error) {
      console.error("error", error);
      setAnnouncementData([]);
    }
  };

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  return (
    <>
      <nav className="user_navbar p-0">
        {!store.user.isLogin && (
          <div
            className="w-100 d-flex justify-content-between "
            style={{ background: "#045662" }}
          >
            <img src={ansmt} alt="Announcement" className="announcementImg" />
            <marquee className="text-white" style={{ fontSize: "18px" }}>
              {announcementData.map((item) => item.announcement).join(" | ")}
            </marquee>
            <span
              className="text-nowrap text-white px-2"
              style={{ fontSize: "14px" }}
            >
              {formattedDate}
            </span>
          </div>
        )}

        <div
          className="container-fluid d-flex align-items-center justify-content-between"
          style={{ maxWidth: "100%", padding: "5px 10px" }}
        >
          <div className="d-flex flex-column">
            <button
              className="btn btn-primary d-lg-none hambargerIcon d-md-none"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasScrolling"
              aria-controls="offcanvasScrolling"
            >
              ☰
            </button>
            {store.user.isLogin && (
              <button
                className="btn btn-primary mt-2 d-lg-none hambargerIcon d-md-none"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasTop"
                aria-controls="offcanvasTop"
                style={{
                  width: "44px",
                  height: "40px",
                  fontSize: "18px",
                  padding: "5px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: "1",
                }}
              >
                <small style={{ fontSize: "12px", marginBottom: "2px" }}>
                  Bets
                </small>
                <FaDollarSign size={15} color="white" />
              </button>
            )}
          </div>

          <OpenBetsOffCanvas
            handleOpenBetsSelectionMenu={handleOpenBetsSelectionMenu}
            openBetData={openBetData}
          />
          <a className="navbar-brand" href={`/home`}>
            <img
              src={Logo}
              alt="Logo"
              style={{
                width: "170px",
                maxWidth: "100%",
                height: "auto",
              }}
              className="img-fluid"
            />
          </a>
          <div className="d-flex align-items-center ms-auto">
            <button className="navbar-toggler border-0" type="button">
              {store.user.isLogin ? (
                <span
                  className="d-flex flex-column align-items-start"
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
                      padding: "5px 8px",
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
                      padding: "5px 8px",
                    }}
                  >
                    Exp :{" "}
                    {exposureAndWallet.exposure ??
                      store?.user?.wallet?.exposure ??
                      0}
                  </span>
                </span>
              ) : (
                <span
                  className="btn text-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(to top, #21778A, #21778A, #34879b, #47abc2, #5ad0eb)",
                    fontSize: "13px",
                    border: "2px solid #72BBEF",
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
