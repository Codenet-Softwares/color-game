import { useEffect, useState } from "react";
// import "./common/common.css";
import "./Inplay.css";
import { Link, useLocation } from "react-router-dom";
import {
  inPlayMarket_api,
  user_getGameWithMarketData_api,
} from "../utils/apiService";
import Layout from "./layout/layout";
import strings from "../utils/constant/stringConstant";
import { useAppContext } from "../contextApi/context";
import AppDrawer from "./common/appDrawer";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./Lottery/firebaseStore/lotteryFirebase";
import { capitalizeEachWord, convertFormatDate } from "../utils/helper";

const Inplay = () => {
  const [inPlayMarket, setIsplayMarket] = useState([]);
  const [isPlayUpdate, setIsPlayUpdate] = useState(null);
  const { store, dispatch } = useAppContext();

  useEffect(() => {
    user_getInPlayMarketData();
  }, [isPlayUpdate]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "lottery-db"), (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setIsPlayUpdate(messagesData);
    });

    return () => unsubscribe();
  }, []);

  const handleAllId = (gameId, marketId) => {
    dispatch({
      type: strings.placeBidding,
      payload: { gameId: gameId, marketId: marketId },
    });
  };

  async function user_getInPlayMarketData() {
    const response = await inPlayMarket_api();
    if (response) {
      setIsplayMarket(response.data);
    }
  }
  return (
    <>
      {/* <div style={{ marginTop: "75px" }}> */}
      <Layout />
      {/* </div> */}
      <div className="global-margin-top-logged-inplay">
        <AppDrawer showCarousel={true} isMobile={false} isHomePage={true}>
          <div
            className="row mt-1 cg_inplay "
            style={{
              marginTop: 1,
              paddingTop: 0,
              position: "relative",
              top: "-9px",
            }}
          >
            {inPlayMarket &&
              inPlayMarket.map((gameWithMarketData) => {
                return (
                  <>
                    {console.log("location", location)}
                    {gameWithMarketData.gameName
                      .toLowerCase()
                      .replace(/[\s\-_]/g, "") ===
                    "Lottery".toLowerCase().replace(/[\s\-_]/g, "") ? (
                      <>
                        <div
                          className="col-12 p-1 fw-bold h6 text-black shadow-lg text-white m-1"
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
                          gameWithMarketData.markets.map(
                            (marketData, index) => (
                              <div
                                key={index}
                                className="row px-3 py-1"
                                style={{
                                  borderRadius: "5px",
                                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                <div className="row align-items-center">
                                  <span
                                    className="col-12 font-weight-bold text-primary text-wrap d-flex align-items-center flex-wrap"
                                    style={{
                                      fontSize: "16px",
                                      wordBreak: "break-word",
                                      whiteSpace: "normal",
                                      gap: "6px",
                                    }}
                                  >
                                    <Link
                                      to={`/lottoPurchase/${marketData.marketId}`}
                                      onClick={(e) => e.stopPropagation()}
                                      style={{
                                        textDecoration: "none",
                                        color: "#4682B4",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {capitalizeEachWord(
                                        marketData?.marketName
                                      ) ?? "Unknown"}{" "}
                                      |
                                    </Link>
 {marketData.hotGame === true && (
                                      <span
                                        className="blink_me bg-danger rounded-pill text-white d-flex align-items-center justify-content-center px-2"
                                        style={{
                                          height: "20px",
                                          fontSize: "10px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Hot Game
                                      </span>
                                    )}
                                    <span style={{ color: "#b2b2b2" }}>
                                      {convertFormatDate(marketData.start_Time)}
                                    </span>

                                    {/* Hot Game badge appears right after date */}
                                   
                                  </span>
                                </div>
                              </div>
                            )
                          )}

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
                          className="col-12 p-1 fw-bold h6 text-black shadow-lg text-white mx-2 px-2"
                          style={{
                            backgroundColor: "#202020",
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                        >
                          {console.log("gamewith", gameWithMarketData)}
                          {gameWithMarketData.gameName}
                        </div>
                        {gameWithMarketData &&
                          gameWithMarketData.markets.map(
                            (marketData, index) => (
                              <div
                                key={index}
                                className="row px-3 py-1"
                                style={{
                                  borderRadius: "5px",
                                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                <div className="row align-items-center">
                                  <span
                                    className="col-12 font-weight-bold text-primary text-wrap d-flex align-items-center flex-wrap"
                                    style={{
                                      fontSize: "16px",
                                      wordBreak: "break-word",
                                      whiteSpace: "normal",
                                      gap: "6px",
                                    }}
                                  >
                                    <Link
                                      to={`/gameView/Colorgame/${marketData?.marketName}/${marketData?.marketId}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        {
                                          console.log(
                                            "gameWithMarketData",
                                            gameWithMarketData
                                          );
                                        }
                                        handleAllId(
                                          gameWithMarketData?.gameId,
                                          marketData?.marketId
                                        );
                                      }} 
                                      style={{
                                        textDecoration: "none",
                                        color: "#4682B4",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {capitalizeEachWord(
                                        marketData?.marketName
                                      ) ?? "Unknown"}{" "}
                                      |
                                    </Link>

                                    {/*  Hot Game */}
                                    {marketData.hotGame === true && (
                                      <span
                                        className="blink_me bg-danger rounded-pill text-white d-flex align-items-center justify-content-center px-2"
                                        style={{
                                          height: "20px",
                                          fontSize: "10px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Hot Game
                                      </span>
                                    )}
                                    <span style={{ color: "#b2b2b2" }}>
                                      {convertFormatDate(marketData.endTime)}
                                    </span>

                                  </span>
                                </div>
                              </div>
                            )
                          )}

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
        </AppDrawer>
      </div>
    </>
  );
};

export default Inplay;
