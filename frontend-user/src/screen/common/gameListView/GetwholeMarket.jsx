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
  }, [isLotteryUpdate, isColorgameUpdate, currentGameTab]);

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
      const filteredData = response.data.filter(
        (game) =>
          game.gameName.toLowerCase().replace(/[\s\-_]/g, "") ==
          currentGameTab.toLowerCase().replace(/[\s\-_]/g, "")
      );
      setUser_allGamesWithMarketData(filteredData);
    }
  }

  console.log("user_allGamesWithMarketData", user_allGamesWithMarketData);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "lottery-db"), (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

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

        setIsColorgameUpdate(messagesData);
      }
    );

    return () => unsubscribe();
  }, []);

  console.log("currentGameTab", user_allGamesWithMarketData, currentGameTab);

  return (
    <>
      {/* <AppDrawer showCarousel={true} isMobile={false} isHomePage={true}> */}
      <div
        className="row mt-1 "
        style={{
          marginTop: 1,
          paddingTop: 0,
          position: "relative",
          top: "-9px",
        }}
      >
        {store.user.isLogin &&
          user_allGamesWithMarketData &&
          user_allGamesWithMarketData
            .map((gameWithMarketData) => {
              return (
                <>
                  {console.log("location", location)}
                  {gameWithMarketData.gameName
                    .toLowerCase()
                    .replace(/[\s\-_]/g, "") ===
                  "Lottery".toLowerCase().replace(/[\s\-_]/g, "") ? (
                    <>
                      <div
                        className="col-12 p-1 fw-bold h6 text-black shadow-lg text-white mx-1"
                        style={{
                          backgroundColor: "#202020",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        <div className="mx-2">
                          {gameWithMarketData.gameName}
                        </div>
                      </div>
                      {gameWithMarketData &&
                        gameWithMarketData.markets.map((marketData, index) => (
                          <div
                            key={index}
                            className="row my-2 m-2"
                            style={{
                              borderRadius: "5px",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            {marketData.hotGame === true && (
                              <div
                                className="blink_me bg-danger rounded-pill text-center text-white d-flex align-items-center justify-content-center "
                                style={{
                                  width: "74px",
                                  height: "20px",
                                  marginLeft: "250px",
                                }}
                              >
                                <small
                                  className="fw-bold"
                                  style={{ fontSize: "10px" }}
                                >
                                  Hot Game
                                </small>
                              </div>
                            )}

                            <div className="row align-items-center">
                              <span
                                className="col-12 font-weight-bold text-uppercase text-primary text-wrap"
                                style={{
                                  fontSize: "16px",
                                  wordBreak: "break-word",
                                  whiteSpace: "normal",
                                }}
                              >
                                <Link
                                  to={`/lottoPurchase/${marketData.marketId}`}
                                  onClick={(e) => e.stopPropagation()} // Prevents dropdown collapse
                                  style={{
                                    textDecoration: "none",
                                    color: "#27a7e4",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {marketData?.marketName ?? "Unknown"} |{" "}
                                </Link>
                                <span className="" style={{ color: "#b2b2b2" }}>
                                  {formatDate(marketData.start_time)}
                                </span>
                              </span>
                            </div>
                          </div>
                        ))}

                      {gameWithMarketData.markets.length === 0 && (
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
                        className="col-12 p-1 fw-bold h6 text-black shadow-lg text-white mx-2"
                        style={{
                          backgroundColor: "#202020",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        {console.log("gamewith", gameWithMarketData.gameName)}
                        {gameWithMarketData.gameName}
                      </div>
                      {gameWithMarketData &&
                        gameWithMarketData.markets.map((marketData, index) => (
                          <div
                            key={index}
                            className="row my-2 m-2"
                            style={{
                              borderRadius: "5px",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            {marketData.hotGame === true && (
                              <div
                                className="blink_me bg-danger rounded-pill text-center text-white d-flex align-items-center justify-content-center "
                                style={{
                                  width: "74px",
                                  height: "20px",
                                  marginLeft: "250px",
                                }}
                              >
                                <small
                                  className="fw-bold"
                                  style={{ fontSize: "10px" }}
                                >
                                  Hot Game
                                </small>
                              </div>
                            )}

                            <div className="row align-items-center">
                              <span
                                className="col-12 font-weight-bold text-uppercase text-primary text-wrap"
                                style={{
                                  fontSize: "16px",
                                  wordBreak: "break-word",
                                  whiteSpace: "normal",
                                }}
                              >
                                <Link
                                  to={`/gameView/Colorgame/${marketData?.marketName}/${marketData?.marketId}`}
                                  onClick={(e) => e.stopPropagation()} // Prevents dropdown collapse
                                  style={{
                                    textDecoration: "none",
                                    color: "#27a7e4",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {marketData?.marketName ?? "Unknown"} |{" "}
                                </Link>
                                <span className="" style={{ color: "#b2b2b2" }}>
                                  {formatDate(marketData.startTime)}
                                </span>
                              </span>
                            </div>
                          </div>
                        ))}
                      {gameWithMarketData.markets.length === 0 && (
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
