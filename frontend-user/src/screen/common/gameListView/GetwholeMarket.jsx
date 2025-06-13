import { useEffect, useState } from "react";
import "../common.css";
import { user_getAllGamesWithMarketData_api } from "../../../utils/apiService";
import { useAppContext } from "../../../contextApi/context";
import strings from "../../../utils/constant/stringConstant";
import { Link } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../.././Lottery/firebaseStore/lotteryFirebase";
import { capitalizeEachWord, convertFormatDate } from "../../../utils/helper";

const GetwholeMarket = ({ currentGameTab }) => {
  const [user_allGamesWithMarketData, setUser_allGamesWithMarketData] =
    useState([]);
  const [isLotteryUpdate, setIsLotteryUpdate] = useState(null);
  const [isColorgameUpdate, setIsColorgameUpdate] = useState(null);

  const { store, dispatch } = useAppContext();

  useEffect(() => {
    user_getAllGamesWithMarketData();
  }, [isLotteryUpdate, isColorgameUpdate, currentGameTab]);

  const handleAllId = (gameId, marketId) => {
    dispatch({
      type: strings.placeBidding,
      payload: { gameId: gameId, marketId: marketId },
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
        className="row mt-1 cg_games "
        style={{
          marginTop: 1,
          paddingTop: 0,
          position: "relative",
          top: "-9px",
        }}
      >
        {store.user.isLogin &&
          user_allGamesWithMarketData &&
          user_allGamesWithMarketData.map((gameWithMarketData) => {
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
                        {capitalizeEachWord(gameWithMarketData.gameName)}
                      </div>
                    </div>
                    {gameWithMarketData &&
  gameWithMarketData.markets.map((marketData, index) => (
    <div
      key={index}
      className="row py-1 px-3"
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
            onClick={(e) => e.stopPropagation()} // Prevents dropdown collapse
            style={{
              textDecoration: "none",
              color: "#4682B4",
              fontWeight: "bold",
            }}
          >
            {capitalizeEachWord(marketData?.marketName)} |
          </Link>

          {/* Hot Game badge directly after date */}
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
            {convertFormatDate(marketData.end_time)}
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
                      {console.log("gamewith", gameWithMarketData)}
                    <div className="px-1">{gameWithMarketData.gameName}</div>  
                    </div>
                    {gameWithMarketData &&
                      gameWithMarketData.markets.map((marketData, index) => (
                        <div
                          key={index}
                          className="row py-1 px-3"
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
                              className=""
                                to={`/gameView/Colorgame/${marketData?.marketName}/${marketData?.marketId}`}
                                onClick={(e) => {
                                  e.stopPropagation();
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
                                {capitalizeEachWord(marketData?.marketName) ??
                                  "Unknown"}{" "}
                                |
                              </Link>
    {marketData.hotGame === true && (
                                <span
                                  className="blink_me bg-danger rounded-pill text-white d-flex align-items-center justify-content-center px-2"
                                  style={{
                                    height: "20px",
                                    fontSize: "8px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Hot Game
                                </span>
                              )}
                              <span style={{ color: "#b2b2b2" }}>
                                {convertFormatDate(marketData.endTime)}
                              </span>

                              {/* Show Hot Game badge after the date */}
                          
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
