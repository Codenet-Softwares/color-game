import React, { useEffect, useState } from "react";
import "../common.css";
import { user_getGameWithMarketData_api } from "../../../utils/apiService";
import { getGameWithMarketDataInitialState } from "../../../utils/getInitiateState";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../../../contextApi/context";
import strings from "../../../utils/constant/stringConstant";
import { toast } from "react-toastify";
import AppDrawer from "../appDrawer";
import Layout from "../../layout/layout";
const GetSingleMarket = () => {
  const [user_gameWithMarketData, setUser_gameWithMarketData] = useState(
    getGameWithMarketDataInitialState()
  );

  const { store, dispatch } = useAppContext();
  console.log("store", store);

  const gameIdFromUrl = useLocation().pathname.split("/")[3];

  useEffect(() => {
    user_getGameWithMarketData();
  }, [gameIdFromUrl]);

  const handleMarketId = (id) => {
    dispatch({
      type: strings.placeBidding,
      payload: { marketId: id },
    });
  };

  async function user_getGameWithMarketData() {
    const response = await user_getGameWithMarketData_api({
      gameId: gameIdFromUrl,
    });
    if (response) {
      setUser_gameWithMarketData(response.data);
    }
  }
  return (
    <>
      <Layout />
      <div
        className={`global-margin-top${store.user.isLogin ? "-logged" : ""}`}
      >
        <AppDrawer showCarousel={true} isMobile={false} isHomePage={true}>
          <div className="row p-0 m-0">
            <div
              className="col-12 p-1 mt-2"
              style={{ backgroundColor: "#a1aed4" }}
            >
              {user_gameWithMarketData[0]?.gameName}
            </div>
            {user_gameWithMarketData &&
              user_gameWithMarketData[0]?.markets.map((marketData) => {
                console.log("first", marketData);
                return (
                  <div className="row py-1 px-0 m-0 border">
                    <Link
                      className={`col-4 text-dark text-decoration-none text-nowrap`}
                      to={`/gameView/${user_gameWithMarketData[0]?.gameName?.replace(
                        /\s/g,
                        ""
                      )}/${marketData?.marketName?.replace(/\s/g, "")}/${
                        marketData?.marketId
                      }`}
                      onClick={() => handleMarketId(marketData?.marketId)}
                    >
                      <span>{marketData.timeSpan}</span> |{" "}
                      <span> {marketData.marketName}</span>
                    </Link>

                    <div
                      className="col-8"
                      style={{ backgroundColor: "orange" }}
                    >
                      col-8
                    </div>
                  </div>
                );
              })}
          </div>
        </AppDrawer>
      </div>
    </>
  );
};

export default GetSingleMarket;
