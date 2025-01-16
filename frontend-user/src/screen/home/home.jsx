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
import Footer from "../common/Footer";
import Login from "../loginModal/loginModal";
import AOS from "aos";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const { store } = useAppContext();

  useEffect(() => {
    AOS.init();
  }, []);

  const getLoginHomePage = () => (
    <div className="global-margin-top-logged">
      <AppDrawer showCarousel={true} isMobile={false} isHomePage={true} showResetModal={showResetModal} setShowResetModal={setShowResetModal}>
        <GameWithMarketList isSingleMarket={false} />
      </AppDrawer>
    </div>
  );

  const homePage = () => (
    <div className="global-margin-top" >
      <Carousel />
      <HitGames />
      <Gif />
      <GameWithMarketList isSingleMarket={false} />
      <DownloadApp />
      <Footer />
      <Login showLogin={showLogin} setShowLogin={setShowLogin}/>
    </div>
  );

  const getBody = () => (
    <>
      <Layout />
      {store.user.isLogin ? getLoginHomePage() : homePage()}
    </>
  );

  return getBody();
};

export default Home;
