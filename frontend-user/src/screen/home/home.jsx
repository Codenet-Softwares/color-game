import "./home.css";
import { dSlider, dHitGames, sGif } from "../../utils/dummyData";
import { aAdvertisement } from "../../utils/dummyData";
import { useEffect, useState } from "react";
import { useAppContext } from "../../contextApi/context";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../layout/layout";
import AppDrawer from "../common/appDrawer";
import GameWithMarketList from "../common/gameListView/gameWithMarketList";
import Carousel from "../common/Carousel";
import HitGames from "../HitGames";
import Gif from "../common/Gif";
import DownloadApp from "../DownloadApp";
import Login from "../loginModal/loginModal";
import AOS from "aos";
import GetwholeMarket from "../common/gameListView/GetwholeMarket";
import { getOpenBet } from "../../utils/getInitiateState";
import {
  getOpenBetsGame,
  user_getBackLayData_api,
} from "../../utils/apiService";
import strings from "../../utils/constant/stringConstant";
import Footer from "../common/Footer";
import { MdAndroid } from "react-icons/md"; // Material Design Icon replacement
import { singleOuterImg } from "../../utils/apiService";
import homepageBackground from "../../asset/homepageBackground.png";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [openBetData, setOpenBetData] = useState(getOpenBet());
  const [currentGameTab, setCurrentGameTab] = useState("Lottery");
  const [SingleOutImage, setSingleOutImage] = useState([]);

  const { store } = useAppContext();

  const accessTokenFromStore = JSON.parse(
    localStorage.getItem(strings.LOCAL_STORAGE_KEY)
  )?.user?.accessToken;

  useEffect(() => {
    AOS.init();
  }, []);
  const fetchOuterSingleImage = async () => {
    try {
      const response = await singleOuterImg();
      if (response.data.length > 0) {
        setSingleOutImage(response.data);
      } else {
        console.error("error", response);
        setSingleOutImage(aAdvertisement);
      }
    } catch (error) {
      console.error("error", error);
      setSingleOutImage([]);
    }
  };

  useEffect(() => {
    fetchOuterSingleImage();
  }, []);
  const handleOpenBetsSelectionMenu = (e) => {
    const { name, value } = e.target;

    setOpenBetData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  async function handleGetData() {
    const response = await user_getBackLayData_api({
      marketId: openBetData?.selectColorGame,
    });
    if (response?.data) {
      setOpenBetData((prev) => ({
        ...prev,
        openBet: response.data,
      }));
    }
  }

  const openBetsGame = async () => {
    const response = await getOpenBetsGame();
    if (response?.data) {
      setOpenBetData((prev) => ({
        ...prev,
        openBetGameNames: response.data,
      }));
    }
  };
  useEffect(() => {
    if (store.user.isLogin && accessTokenFromStore) openBetsGame();
  }, [accessTokenFromStore]);

  useEffect(() => {
    if (openBetData?.selectColorGame != "") {
      handleGetData();
    }
  }, [openBetData?.selectColorGame]);

  const getLoginHomePage = () => (
    <div className="global-margin-top-logged">
      <AppDrawer
        showCarousel={true}
        isMobile={false}
        isHomePage={true}
        showResetModal={showResetModal}
        setShowResetModal={setShowResetModal}
        openBetData={openBetData}
        handleOpenBetsSelectionMenu={handleOpenBetsSelectionMenu}
        setCurrentGameTab={setCurrentGameTab}
        currentGameTab={currentGameTab}
      >
        <GetwholeMarket currentGameTab={currentGameTab} />
      </AppDrawer>
    </div>
  );

  const homePage = () => (
    <div className="mb-0">
      {/* Carousel-like Image */}
      
      <div className="home-scroll-wrapper bg-white"
      // style={{
      //   backgroundImage: `url(${homepageBackground})`,
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      //   height: "100vh",
      // }}
      >
        {SingleOutImage.map((item, index) => (
        <div className="carousel-img-container ">
          <img
            src={item.image}
            alt="Cricket Banner"
            className=" d-block w-100 carousel-img "
          />
        </div>
         ))}

        {/* Motivational Text */}
        <div className="motivational-text text-uppercase fw-bold text-dark mt-5">
          <h2>The more you play, the more you win</h2>
        </div>

        {/* Section Title */}
        <div className="start-play-section text-danger text-uppercase mt-5">
          <h3>Let’s Start Playing</h3>
        </div>

        <div>
          <HitGames />
        </div>

        {/* View More Button */}
        <div className="d-flex justify-content-center mt-5 mb-2">
          <button
            type="button"
            mat-button=""
            onClick={() => setShowLogin(true)}
            className="btn btn-view py-1 text-danger fw-bold fs-4 text-uppercase "
            style={{
              boxShadow: "inset 0 0 3px 2px #000",
              border: "2px solid #000",
              borderRadius: "50px",
              fontWeight: 900,
              padding: "30px 40px 43px",
              opacity: 1,
              fontSize: "19px",
              backgroundColor: "transparent",
            }}
          >
            View More
          </button>
        </div>
        {/* Download App Floating Icon */}
        <h2
          className="download-icon-btnw"
          style={{
            position: "fixed",
            bottom: "60px",
            right: "5px",
            margin: "0",
            fontWeight: "bolder",
            zIndex: 3,
            textTransform: "uppercase",
            fontSize: "14px",
            padding: "10px 15px",
            borderRadius: "50px",
            background: "#222",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
          }}
        >
          <MdAndroid size={18} /> download app
        </h2>
        <DownloadApp />
        <Footer />
        <Login showLogin={showLogin} setShowLogin={setShowLogin} />
      </div>

      {/* const homePage = () => (
    <div className="home-scroll-wrapper">
      <div className="home-scroll-content">
        <div className="carousel-wrapper">
          <Carousel />
        </div>
        <HitGames />
        <Gif />
        <GetwholeMarket />
        <DownloadApp />
        <Footer />
        <Login showLogin={showLogin} setShowLogin={setShowLogin} />
      </div>
    </div>
  ); */}
    </div>
  );

  const getBody = () => (
    <>
      <Layout
        openBetData={openBetData}
        handleOpenBetsSelectionMenu={handleOpenBetsSelectionMenu}
      />
      {store.user.isLogin ? getLoginHomePage() : homePage()}
    </>
  );

  return getBody();
};

export default Home;
