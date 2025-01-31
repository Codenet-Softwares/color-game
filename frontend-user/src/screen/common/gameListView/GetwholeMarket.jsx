import React, { useEffect, useState } from "react";
import "../common.css";
import { user_getAllGamesWithMarketData_api } from "../../../utils/apiService";
import { useAppContext } from "../../../contextApi/context";
import strings from "../../../utils/constant/stringConstant";
import { toast } from "react-toastify";
import AppDrawer from "../appDrawer";
import { Link } from "react-router-dom";
const formatDate = (dateStr) => {
  const date = new Date(dateStr);

  // Check if the date is valid
  if (isNaN(date)) {
    return "Invalid Date"; // Return a fallback message if the date is invalid
  }

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ordinalSuffix = ["th", "st", "nd", "rd"][(day % 10) - 1] || "th"; // To get 1st, 2nd, etc.
  const formattedTime = `${day}${ordinalSuffix} ${month} ${hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;
  return formattedTime;
};

const GetwholeMarket = () => {
  const [user_allGamesWithMarketData, setUser_allGamesWithMarketData] =
    useState([]);

  const { store, dispatch } = useAppContext();

  useEffect(() => {
    user_getAllGamesWithMarketData();
  }, []);

  const handleGameId = (id) => {
    dispatch({
      type: strings.placeBidding,
      payload: { gameId: id },
    });
  };
  const handleMarketId = (id) => {
    dispatch({
      type: strings.placeBidding,
      payload: { marketId: id },
    });
  };
  async function user_getAllGamesWithMarketData() {
    const response = await user_getAllGamesWithMarketData_api();
    if (response) {
      setUser_allGamesWithMarketData(response.data);
    }
  }

  return (
    <>
      {/* <AppDrawer showCarousel={true} isMobile={false} isHomePage={true}> */}
      <div className="row p-0 m-0 m-2">
        {user_allGamesWithMarketData &&
          user_allGamesWithMarketData
            .slice(0, store.user.isLogin ? 5 : 3)
            .map((gameWithMarketData) => {
              return (
                <>
                  {gameWithMarketData.gameName === "Lottery" ? (
                    <>
                      <div
                        className="col-12 p-1 mt-3  text-white"
                        style={{
                          backgroundColor: "#18ADC5",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        {gameWithMarketData.gameName}
                      </div>

                      {gameWithMarketData &&
                        gameWithMarketData.markets
                          .slice(0, store.user.isLogin ? 5 : 3)
                          .map((marketData, index) => (
                            <div
                              key={index}
                              className="row my-2 p-2"
                              style={{
                                backgroundColor: "#f9f9f9",
                                borderRadius: "5px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              
                              {/* Market Header */}
                              <div className="row align-items-center">
                                <span
                                  className="col-12 font-weight-bold text-uppercase text-primary fw-bold"
                                  style={{
                                    fontSize: "16px",
                                    borderBottom: "2px solid #ddd",
                                    // paddingBottom: "5px",
                                  }}
                                >
                                  💹 {marketData?.marketName ?? "Unknown"} |{" "}
                                  <span
                                    className=""
                                    style={{ color: "#022C44" }}
                                  >
                                    {formatDate(marketData.start_time)}
                                  </span>
                                </span>
                              </div>

                              {/* Range Details */}
                              <div className="row mt-1 " >
                                <div className="col-3">
                                  <p className="m-0">
                                    <strong>Group Range:</strong>
                                  </p>
                                  <p className="m-0">
                                    {marketData?.group_start ?? "N/A"} -{" "}
                                    {marketData?.group_end ?? "N/A"}
                                  </p>
                                </div>
                                <div className="col-3">
                                  <p className="m-0">
                                    <strong>Series Range:</strong>
                                  </p>
                                  <p className="m-0">
                                    {marketData?.series_start ?? "N/A"} -{" "}
                                    {marketData?.series_end ?? "N/A"}
                                  </p>
                                </div>
                                <div className="col-3">
                                  <p className="m-0">
                                    <strong>Number Range:</strong>
                                  </p>
                                  <p className="m-0">
                                    {marketData?.number_start ?? "N/A"} -{" "}
                                    {marketData?.number_end ?? "N/A"}
                                  </p>
                                </div>
                                <div className="col-3">
                                  <p className="m-0">
                                    <strong>Price:</strong>
                                  </p>
                                  <p className="m-0">
                                    {marketData?.price ?? "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}

                      {gameWithMarketData.markets.length > 0 ? (
                        <Link
                          className={`col-12 text-dark text-decoration-none text-nowrap fw-bold`}
                          // to={`/gameView/${gameWithMarketData?.gameName?.replace(
                          //   /\s/g,
                          //   ""
                          // )}/${gameWithMarketData?.marketId}`}
                          to={`/lottery-home`}
                          style={{ textAlign: "right", margin:"16px" }}
                        >
                          View more.....
                        </Link>
                      ) : (
                        <p
                          className="text-center fw-bold"
                          style={{ backgroundColor: "orange" }}
                        >
                          No market Available
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <div
                        className="col-12 p-2 fw-bold h6 text-white shadow-lg border"
                        style={{ backgroundColor: "#18ADC5" }}
                      >
                        {gameWithMarketData.gameName}
                      </div>
                      <div className="col-12 fw-bold h6 text-white"></div>
                      {/* Render only if markets are available */}
                      {gameWithMarketData &&
                        gameWithMarketData.markets.length > 0 && (
                          <div className="row px-0 m-0 text-center">
                            <span className="col-6 text-dark text-decoration-none text-nowrap fw-bold h6"></span>
                            <div className="col-3 rounded fw-bold">BACK</div>
                            <div className="col-3 rounded fw-bold">LAY</div>
                          </div>
                        )}
                      {gameWithMarketData &&
                        gameWithMarketData.markets
                          .slice(0, store.user.isLogin ? 5 : 3)
                          .map((marketData) => {
                            return (
                              <div
                                className=" p-0 m-0 "
                                style={{
                                  backgroundColor: "white",
                                  borderTop: "1px solid #ccc",
                                }}
                              >
                                <div className="row py-1 px-0 m-0 ">
                                  {/* Runner Name and Balance */}
                                  <span className="col-6 text-dark text-decoration-none text-nowrap fw-bold h6 d-flex">
                                    <span
                                      className=""
                                      style={{ color: "#022C44" }}
                                    >
                                      {formatDate(marketData.startTime)}
                                    </span>
                                    |{" "}
                                    <h6 className="text-primary px-1 fw-bold">
                                      {marketData?.marketName}
                                    </h6>
                                  </span>
                                  {/* Back and Lay Rates */}
                                  <div
                                    className="col-3 rounded p-1 fw-bold"
                                    style={{ backgroundColor: "#80C2F1" }}
                                  >
                                    {marketData?.runners[0]?.rate[0]?.back ??
                                      "N/A"}
                                  </div>

                                  <div
                                    className="col-3 rounded p-1 fw-bold"
                                    style={{ backgroundColor: "#FAA9BA" }}
                                  >
                                    {marketData?.runners[0]?.rate[0]?.lay ??
                                      "N/A"}
                                  </div>
                                </div>
                                {/* );
                            }
                          )} */}
                              </div>
                            );
                          })}
                      {gameWithMarketData.markets.length > 0 ? (
                        <a
                          className={`col-12 text-dark text-decoration-none text-nowrap border-top fw-bold`}
                          href={`/gameView/${gameWithMarketData?.gameName?.replace(
                            /\s/g,
                            ""
                          )}/${gameWithMarketData?.gameId}`}
                          style={{
                            textAlign: "right",
                            padding: "2px",
                            display: "block",
                          }}
                          onClick={() =>
                            handleGameId(gameWithMarketData?.gameId)
                          }
                        >
                          View More...
                        </a>
                      ) : (
                        <p
                          className="text-center pt-1 fw-bold"
                          style={{
                            margin: 0,
                          }}
                        >
                          No market Available
                        </p>
                      )}
                    </>
                  )}
                </>
              );
            })}
      </div>
      {/* </AppDrawer> */}
    </>
  );
};

export default GetwholeMarket;
