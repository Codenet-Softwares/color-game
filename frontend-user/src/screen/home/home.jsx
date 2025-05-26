import "./home.css";
import { dSlider, dHitGames, sGif } from "../../utils/dummyData";
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

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [openBetData, setOpenBetData] = useState(getOpenBet());

  const { store } = useAppContext();

  useEffect(() => {
    AOS.init();
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
    if (store.user.isLogin) openBetsGame();
  }, []);

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
      >
        <GetwholeMarket />
      </AppDrawer>
    </div>
  );

  const homePage = () => (
    <div className="global-margin-top">
      <Carousel />
      <HitGames />
      <Gif />
      <GetwholeMarket />
      <DownloadApp />
      {/* <Footer /> */}
      <Login showLogin={showLogin} setShowLogin={setShowLogin} />
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
