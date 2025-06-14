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
import { capitalizeEachWord } from "../../../utils/helper";
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
      <div style={{ marginTop: "-10px" }}>
        <Layout />
      </div>
      <div
        className={`global-margin-top${
          store.user.isLogin ? "-logged" : ""
        } mb-5`}
      >
        <AppDrawer showCarousel={true} isMobile={false} isHomePage={true}>
          <div className="row p-0 m-0">
            <div
              className="col-12 p-2 mt-2 text-white fw-bold h6 "
              style={{ backgroundColor: "#202020", fontSize: "16px" }}
            >
              {user_gameWithMarketData[0]?.gameName}
            </div>
            {user_gameWithMarketData[0]?.markets.length > 0 ? (
              <>
                {/* <div className="col-12 p-0 m-0">
                  <div className="row px-0 m-0 align-items-center">
                    <div className="col-12 col-md-9 p-0"></div>
                    <div className="col-12 col-md-3 p-0 m-0 py-1">
                      <div className="row gx-1 justify-content-end text-center">
                        <div className="col-6">
                          <div
                            className="rounded-start fw-bold py-1 px-2"
                            style={{ background: "#80C2F1" }}
                          >
                            BACK
                          </div>
                        </div>
                        <div className="col-6">
                          <div
                            className="rounded-end fw-bold py-1 px-2"
                            style={{ background: "#FAA9BA" }}
                          >
                            LAY
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                {user_gameWithMarketData &&
                  user_gameWithMarketData[0]?.markets.map((marketData) => {
                    return (
                      <div
                        className="p-0 m-0"
                        style={{
                          backgroundColor: "white",
                          borderBottom: "1px solid #ccc",
                        }}
                        key={marketData.marketId}
                      >
                        <div className="row px-0 m-0 align-items-center">
                          <div className="col-12 col-md-9 d-flex align-items-center flex-wrap p-0">
                            <i className="far fa-calendar-alt text-dark me-2 d-block d-md-none mt-1"></i>

                            <Link
                              style={{
                                textDecoration: "none",

                                color: "#27a7e4",
                                fontWeight: "bold",
                              }}
                              to={`/gameView/${user_gameWithMarketData[0]?.gameName?.replace(
                                /\s/g,
                                ""
                              )}/${marketData?.marketName?.replace(
                                /\s/g,
                                ""
                              )}/${marketData?.marketId}`}
                              onClick={() =>
                                handleMarketId(marketData?.marketId)
                              }
                            >
                              <span
                                className="col-12 font-weight-bold text-uppercase text-primary text-wrap"
                                style={{
                                  fontSize: "16px",
                                  wordBreak: "break-word",
                                  whiteSpace: "normal",
                                }}
                              >
                                {capitalizeEachWord(marketData.marketName)}
                              </span>
                              <span className="pt-2">|</span>
                              <span className="" style={{ color: "#b2b2b2" }}>
                                {formatDate(marketData.startTime)}
                              </span>
                            </Link>
                          </div>
                          {/* <div className="col-12 col-md-3 p-0 m-0 py-1">
                            <div className="row gx-2 justify-content-end">
                              <div className="col-6">
                                <div
                                  className="rounded-start fw-bold py-1 px-2 text-md-center"
                                  style={{
                                    backgroundColor: "#80C2F1",
                                    fontSize: "13px",
                                  }}
                                >
                                  {marketData?.runners[0]?.rate[0]?.back ??
                                    "N/A"}
                                </div>
                              </div>
                              <div
                                className="col-6 rounded-end fw-bold text-md-center"
                                style={{
                                  backgroundColor: "#FAA9BA",
                                  fontSize: "13px",
                                  // padding: "5px",
                                }}
                              >
                                {marketData?.runners[0]?.rate[0]?.lay ?? "N/A"}
                              </div>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    );
                  })}
              </>
            ) : (
              <p
                className="text-center fw-bold"
                style={{
                  backgroundColor: "#FAA9BA",
                  fontSize: "13px",
                  padding: "5px",
                }}
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
