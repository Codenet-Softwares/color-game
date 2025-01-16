import React, { useEffect, useState } from "react";
import "../common.css";
import { user_getAllGamesWithMarketData_api } from "../../../utils/apiService";
import { useAppContext } from "../../../contextApi/context";
import strings from "../../../utils/constant/stringConstant";
import { toast } from "react-toastify";
import AppDrawer from "../appDrawer";
import { Link } from "react-router-dom";

const GetwholeMarket = () => {
  const [user_allGamesWithMarketData, setUser_allGamesWithMarketData] =
    useState([]);

  const { store, dispatch } = useAppContext();
  console.log("store", store);

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
      <div className="row p-0 m-0">
        {user_allGamesWithMarketData &&
          user_allGamesWithMarketData.slice(0, 3).map((gameWithMarketData) => {
            return (
              <>
                {gameWithMarketData.gameName === "Lottery" ? (
                  <>
                    <div
                      className="col-12 p-2 mt-2"
                      style={{
                        backgroundColor: "#a1aed4",
                        borderRadius: "5px",
                        fontSize: "18px",
                        fontWeight: "bold",
                      }}
                    >
                      {gameWithMarketData.gameName}
                      {console.log("gameWithMarketData", gameWithMarketData)}
                    </div>

                    {gameWithMarketData &&
                      gameWithMarketData.markets
                        .slice(0, 3)
                        .map((marketData, index) => (
                          <div
                            key={index}
                            className="row mx-0 my-2 p-2"
                            style={{
                              backgroundColor: "#f9f9f9",
                              borderRadius: "5px",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            {/* Market Header */}
                            <div className="row mx-0 px-2 align-items-center">
                              <span
                                className="col-12 text-dark font-weight-bold text-uppercase"
                                style={{
                                  fontSize: "16px",
                                  borderBottom: "2px solid #ddd",
                                  paddingBottom: "5px",
                                }}
                              >
                                Market: {marketData?.marketName ?? "Unknown"}
                              </span>
                            </div>

                            {/* Range Details */}
                            <div className="row mx-0 px-2 mt-2">
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
                        className={`col-12 text-dark text-decoration-none text-nowrap`}
                        to={`/gameView/${gameWithMarketData?.gameName?.replace(
                          /\s/g,
                          ""
                        )}/${gameWithMarketData?.marketId}`}
                        style={{ textAlign: "right" }}
                        onClick={() =>
                          handleMarketId(gameWithMarketData?.marketId)
                        }
                      >
                        View more
                      </Link>
                    ) : (
                      <p
                        className="text-center pt-1"
                        style={{ backgroundColor: "orange" }}
                      >
                        No market
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <div
                      className="col-12 p-2 mt-2 fw-bold h6 text-white shadow-lg border"
                      style={{ backgroundColor: "#18ADC5" }}
                    >
                      {gameWithMarketData.gameName}
                    </div>
                    {/* <div  className="col-12 p-1 mt-2 fw-bold h6 text-white"></div> */}
                    {/* <div className="row px-0 m-0 text-center">
                      <span className=" col-6 text-dark text-decoration-none text-nowrap fw-bold h6"></span>
                      <div className="col-3 rounded p-1 fw-bold">1</div>
                      <div className="col-3 rounded p-1 fw-bold">2</div>
                    </div> */}
                    {gameWithMarketData &&
                      gameWithMarketData.markets
                        .slice(0, 2)
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
                                <span className="col-6 text-dark text-decoration-none text-nowrap fw-bold h6">
                                  {marketData?.marketName}
                                </span>
                                {/* Back and Lay Rates */}
                                <div
                                  className="col-3 rounded p-1"
                                  style={{ backgroundColor: "#80C2F1" }}
                                >
                                  {marketData?.runners[0]?.rate[0]?.back ?? "N/A"}
                                </div>

                                <div
                                  className="col-3 rounded p-1"
                                  style={{ backgroundColor: "#FAA9BA" }}
                                >
                                  {marketData?.runners[0]?.rate[0]?.lay ?? "N/A"}
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
                        onClick={() => handleGameId(gameWithMarketData?.gameId)}
                      >
                        View More...
                      </a>
                    ) : (
                      <p
                        className="text-center pt-1"
                        style={{
                          backgroundColor: "orange",
                          margin: 0,
                          borderTop: "1px solid #ccc",
                        }}
                      >
                        No market
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
