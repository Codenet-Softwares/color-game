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
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    // Extract UTC values directly
    const day = date.getUTCDate();
    const month = date.toLocaleString("en-US", {
      month: "short",
      timeZone: "UTC",
    });
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ordinalSuffix = ["th", "st", "nd", "rd"][(day % 10) - 1] || "th"; // 1st, 2nd, etc.

    return `${day}${ordinalSuffix} ${month} ${hours}:${
      minutes < 10 ? "0" + minutes : minutes
    } `;
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
        className={`global-margin-top${store.user.isLogin ? "-logged" : ""} mb-5`}
      >
        <AppDrawer showCarousel={true} isMobile={false} isHomePage={true}>
          <div className="row p-0 m-0">
            <div
              className="col-12 p-2 mt-2 text-white fw-bold h6"
              style={{ backgroundColor: "#18ADC5", fontSize: "16px" }}
            >
              {user_gameWithMarketData[0]?.gameName}
            </div>
            {user_gameWithMarketData[0]?.markets.length > 0 ? (
              <>
                <div className="row px-0 m-0">
                  <div className="col-8"></div>
                  <div
                    className="col-2 fw-bold rounded-top-3 text-uppercase"
                    style={{background: "#80C2F1",
                      fontSize: "14px",
                      padding: "5px",
                    }}
                  >
                    {" "}
                    Back
                  </div>
                  <div
                    className="col-2 fw-bold rounded-top-3 text-uppercase"
                    style={{
                      background: "#FAA9BA",
                      fontSize: "14px",
                      padding: "5px",
                    }}
                  >
                    {" "}
                    Lay
                  </div>
                </div>
                {user_gameWithMarketData &&
                  user_gameWithMarketData[0]?.markets.map((marketData) => {
                    return (
                      <div
                        className="row py-1 px-0 m-0"
                        style={{
                          backgroundColor: "white",
                          borderTop: "1px solid #ccc",
                        }}
                        key={marketData.marketId}
                      >
                        <Link
                          className={`col-8 text-dark text-decoration-none text-nowrap`}
                          style={{ fontSize: "14px" }}
                          to={`/gameView/${user_gameWithMarketData[0]?.gameName?.replace(
                            /\s/g,
                            ""
                          )}/${marketData?.marketName?.replace(/\s/g, "")}/${
                            marketData?.marketId
                          }`}
                          onClick={() => handleMarketId(marketData?.marketId)}
                        >
                          <span className="fw-bold">
                            {formatDate(marketData.startTime)}
                          </span>{" "}
                          |{" "}
                          <span className="fw-bold text-primary">
                            {" "}
                            {marketData.marketName}
                          </span>
                        </Link>
                        <div
                          className="col-2 rounded fw-bold "
                          style={{  backgroundColor: "#80C2F1",
                            fontSize: "13px",
                            padding: "5px",}}
                        >
                          {marketData?.runners[0]?.rate[0]?.back ?? "N/A"}
                        </div>
                        <div
                          className="col-2 rounded fw-bold"
                          style={{ backgroundColor: "#FAA9BA",
                            fontSize: "13px",
                            padding: "5px", }}
                        >
                          {marketData?.runners[0]?.rate[0]?.lay ?? "N/A"}
                        </div>
                      </div>
                    );
                  })}
              </>
            ) : (
              <p
                className="text-center fw-bold"
                style={{ backgroundColor: "#FAA9BA",
                  fontSize: "13px",
                  padding: "5px", }}
              >
                No market Available
              </p>
            )}
          </div>
        </AppDrawer>
      </div>
    </>
  );
};

export default GetSingleMarket;
