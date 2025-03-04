import React from "react";
import AppDrawer from "../../common/appDrawer";
import { useAppContext } from "../../../contextApi/context";
import Layout from "../../layout/layout";


import { useParams } from "react-router-dom";
import LotteryUserPurchase from "./LotteryUserPurchase";

const LotteryBuyLayout = () => {
  const { store } = useAppContext();
   const { marketId } = useParams()
 

  function newGame() {
    return (
      <div
        className={`global-margin-top${store.user.isLogin ? "-logged" : ""} `}
      >
        <AppDrawer showCarousel={false} isHomePage={true}>
          <LotteryUserPurchase MarketId={marketId} />
        </AppDrawer>
      </div>
    );
  }

  function getBody() {
    return (
      <>
        <Layout />
        {newGame()}
      </>
    );
  }
  return getBody();
};

export default LotteryBuyLayout;
