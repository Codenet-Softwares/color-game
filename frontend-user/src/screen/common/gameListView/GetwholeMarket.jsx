import React, { useEffect, useState } from "react";
import "../common.css";
import { user_getAllGamesWithMarketData_api } from "../../../utils/apiService";
import { useAppContext } from "../../../contextApi/context";
import strings from "../../../utils/constant/stringConstant";
import { toast } from "react-toastify";
import AppDrawer from "../appDrawer";
import { Link } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../.././Lottery/firebaseStore/lotteryFirebase";

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
  const [isLotteryUpdate, setIsLotteryUpdate] = useState(null);
  const [isColorgameUpdate, setIsColorgameUpdate] = useState(null);

  const { store, dispatch } = useAppContext();

  useEffect(() => {
    user_getAllGamesWithMarketData();
  }, [isLotteryUpdate, isColorgameUpdate]);

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

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "lottery-db"), (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Messages Data:", messagesData);
      setIsLotteryUpdate(messagesData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "color-game-db"),
      (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Messages Data:", messagesData);
        setIsColorgameUpdate(messagesData);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* <AppDrawer showCarousel={true} isMobile={false} isHomePage={true}> */}
      <div className="row m-1">
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
                              className="row my-2 m-0"
                              style={{
                                borderRadius: "5px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              {/* Market Header */}
                              <div className="row align-items-center">
                                <span
                                  className="col-12 font-weight-bold text-uppercase text-primary fw-bold text-wrap"
                                  style={{
                                    fontSize: "16px",
                                    wordBreak: "break-word",
                                    whiteSpace: "normal",
                                  }}
                                >
                                  💹{marketData?.marketName ?? "Unknown"} |{" "}
                                  <span
                                    className=""
                                    style={{ color: "#022C44" }}
                                  >
                                    {formatDate(marketData.start_time)}
                                  </span>
                                </span>
                              </div>

                              {/* Range Details */}
                              <table className="table table-bordered mt-1 text-start">
                                <thead>
                                  <tr>
                                    <th>Group Range</th>
                                    <th>Series Range</th>
                                    <th>Number Range</th>
                                    <th>Price</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      {marketData?.group_start ?? "N/A"} -{" "}
                                      {marketData?.group_end ?? "N/A"}
                                    </td>
                                    <td>
                                      {marketData?.series_start ?? "N/A"} -{" "}
                                      {marketData?.series_end ?? "N/A"}
                                    </td>
                                    <td>
                                      {marketData?.number_start ?? "N/A"} -{" "}
                                      {marketData?.number_end ?? "N/A"}
                                    </td>
                                    <td>{marketData?.price ?? "N/A"}</td>
                                  </tr>
                                </tbody>
                              </table>
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
                          style={{ textAlign: "right", margin: "16px" }}
                        >
                          View more...
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
                        className="col-12 p-2 fw-bold h6 text-white shadow-lg"
                        style={{ backgroundColor: "#18ADC5" }}
                      >
                        {gameWithMarketData.gameName}
                      </div>
                      <div className="col-12 fw-bold h6 text-white"></div>
                      {/* Render only if markets are available */}
                      {gameWithMarketData &&
                        gameWithMarketData.markets.length > 0 && (
                          <div className="row px-0 m-0">
                            <span className="col-12 col-md-6 d-none d-md-block text-dark text-decoration-none text-nowrap fw-bold h6"></span>
                            <div
                              className="col-6 col-md-3 rounded-top-2 fw-bold p-1"
                              style={{ background: "#80C2F1" }}
                            >
                              BACK
                            </div>
                            <div
                              className="col-6 col-md-3 rounded-top-2 fw-bold p-1"
                              style={{ background: "#FAA9BA" }}
                            >
                              LAY
                            </div>
                          </div>
                        )}
                      {gameWithMarketData &&
                        gameWithMarketData.markets
                          .slice(0, store.user.isLogin ? 4 : 3)
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
                                  <span className="col-12 col-md-6 text-dark text-decoration-none text-nowrap h6 d-flex flex-wrap">
                                    <i className="far fa-calendar-alt text-dark me-2 d-block d-md-none mt-1"></i>
                                    <span
                                      className=""
                                      style={{ color: "#022C44" }}
                                    >
                                      {formatDate(marketData.startTime)}
                                    </span>
                                    |{" "}
                                    <h6
                                      className="text-primary px-1 text-wrap"
                                      style={{
                                        wordBreak: "break-word",
                                        whiteSpace: "normal",
                                      }}
                                    >
                                      {marketData?.marketName}
                                    </h6>
                                  </span>
                                  {/* Back and Lay Rates */}
                                  <div
                                    className="col-6 col-md-3 rounded p-1 h6"
                                    style={{ backgroundColor: "#80C2F1" }}
                                  >
                                    {marketData?.runners[0]?.rate[0]?.back ??
                                      "N/A"}
                                  </div>

                                  <div
                                    className="col-6 col-md-3 rounded p-1 h6"
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
