import React, { useState, useEffect } from "react";
import "./appDrawer.css";
import {
  getLotteryMarketsApi,
  user_getAllGamesWithMarketData_api,
} from "../../utils/apiService";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAllGameDataInitialState } from "../../utils/getInitiateState";
import HamburgerNavBar from "./hamburgerNavBar";
import { useAppContext } from "../../contextApi/context";
import strings from "../../utils/constant/stringConstant";
import InnerCarousel from "./InnerCarousel";
import Footer from "./Footer";
import OpenBets from "../../betHistory/components/openBets/OpenBets";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Lottery/firebaseStore/lotteryFirebase";
import Login from "../loginModal/loginModal";

function AppDrawer({
  children,
  showCarousel,
  isMobile,
  isHomePage,
  setShowResetModal,
  showResetModal,
  onMarketSelect, // New prop for market selection callback
  openBetData,
  handleOpenBetsSelectionMenu,
  setCurrentGameTab,
  currentGameTab,
}) {
  const [user_allGames, setUser_allGames] = useState(
    getAllGameDataInitialState()
  );
  const [isColorgameUpdate, setIsColorgameUpdate] = useState(null);
  const [toggleMap, setToggleMap] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth);
  0;
  const { dispatch, store } = useAppContext();
  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    user_getAllGames();
  }, [isColorgameUpdate]);

  useEffect(() => {
    const handleResize = () => setIsMobileSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function getNavBarOption() {
    return (
      <ul
        className="mb-0 d-flex py-1 bg-hover"
        style={{
          listStyleType: "none",
          overflowX: "auto",
          padding: 0,
          backgroundImage: "linear-gradient(-180deg, #F6A21E 0%, #F6A21E 100%)",
          fontSize: "15px",
        }}
      >
        {user_allGames.map((gameObj) => {
          const gamePath = `/gameView/${gameObj.gameName.replace(/\s/g, "")}/${
            gameObj.gameId
          }`;
          return (
            <li
              key={gameObj.gameId}
              className={`${
                gameObj.gameName.toLowerCase().replace(/[\s\-_]/g, "") ==
                currentGameTab.toLowerCase().replace(/[\s\-_]/g, "")
                  ? "text-black bg-white"
                  : "text-white bg-black"
              } `}
              style={{
                whiteSpace: "nowrap",
                padding: "2px 10px",
                fontWeight: 0,
                marginLeft: "20px",
                borderRadius: "50px",
                backgroundColor:
                  location.pathname === gamePath ? "#e9f4a6" : "#284050",
                cursor: "pointer",
              }}
            >
              <span
                className={`${
                  gameObj.gameName.toLowerCase().replace(/[\s\-_]/g, "") ==
                  currentGameTab.toLowerCase().replace(/[\s\-_]/g, "")
                    ? "text-black bg-white"
                    : "text-white bg-black"
                } text-decoration-none text-nowrap btn-sm  ${
                  gameObj.isBlink ? "blink_me" : ""
                }`}
                onClick={() => setCurrentGameTab(gameObj.gameName)}
              >
                {gameObj.gameName}
              </span>
            </li>
          );
        })}
      </ul>
    );
  }

  const handleAllId = (gameId, marketId) => {
    dispatch({
      type: strings.placeBidding,
      payload: { gameId: gameId, marketId: marketId },
    });
  };

  const handleNavigateToInPlay = () => {
    navigate("/inplay");
  };

  async function user_getAllGames() {
    const response = await user_getAllGamesWithMarketData_api();
    if (response) {
      setUser_allGames(response.data);
    }
  }

  const handleToggle = (gameId) => {
    setToggleMap((prevState) => {
      const newState = {};
      Object.keys(prevState).forEach((id) => {
        newState[id] = false; // Close all first
      });
      newState[gameId] = !prevState[gameId]; // Toggle only the clicked one
      return newState;
    });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "lottery-db"), (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setIsColorgameUpdate(messagesData);
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

  function getLeftNavBar() {
    return (
      <div
        className={`border-top-0 border-end ${
          store.user.isLogin ? "mt-3" : "mt-3"
        }`}
      >
        <span
          style={{
            display: "block",
            textIndent: "65px",
            fontWeight: "500",
            fontSize: "14px",
          }}
          className="text-white"
        >
          <button
            type="button"
            className="btn-close d-xl-none d-lg-none d-md-none"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            style={{ marginLeft: "70%", position: "absolute", top: "0" }}
          />
        </span>

        <ul className="overflow-auto list-group list-group-flush">
          <li onClick={() => handleNavigateToInPlay()}>
            <div className="game-wrapper text-dark fw-bold mt-2 text-uppercase px-2">
              ⚽ Inplay
            </div>
          </li>
          {user_allGames?.map((gameObj, index) => {
            const isToggled = toggleMap[gameObj.gameId];

            return (
              <React.Fragment key={index}>
                <li
                  className={isToggled ? "" : "MenuHead"}
                  onClick={() => handleToggle(gameObj.gameId)}
                >
                  <div className="game-wrapper text-dark fw-bold mt-2 text-uppercase px-2 py-2 ">
                    ⚽ {gameObj?.gameName}
                    <span
                      className={`dropdown-icon rounded px-1${isToggled ? "active" : ""}`}
                      style={{ cursor: "pointer",color:"#89b621",border:"1px solid #89b621"}}
                    >
                      ▼
                    </span>
                  </div>
                </li>

                {isToggled &&
                  gameObj.markets?.map((marketObj, marketIndex) =>
                    gameObj.gameName.toLowerCase().replace(/[\s\-_]/g, "") ===
                    "colorgame" ? (
                      <li
                        className="list-group-item text-wrap games_box px-0 py-1"
                        style={{
                          wordBreak: "break-word",
                          whiteSpace: "normal",
                        }}
                        key={marketIndex}
                        onClick={() =>
                          handleAllId(gameObj?.gameId, marketObj?.marketId)
                        }
                      >
                        <Link
                          className=""
                          to={`/gameView/${gameObj?.gameName?.replace(
                            /\s/g,
                            ""
                          )}/${marketObj?.marketName?.replace(
                            /\s/g,
                            ""
                          )}/${marketObj?.marketId?.replace(/\s/g, "")}`}
                          style={{
                            color: "#333",
                            textDecoration: "none",
                            display: "block",
                          }}
                        >
                        <div className="px-4 game_text">➔ {marketObj.marketName}</div> 
                        </Link>
                      </li>
                    ) : gameObj.gameName
                        .toLowerCase()
                        .replace(/[\s\-_]/g, "") === "lottery" ? (
                      <li
                        key={marketObj.marketId}
                        className="list-group-item  text-wrap games_box  px-0 py-1"
                        style={{
                          wordBreak: "break-word",
                          whiteSpace: "normal",
                        
                        }}
                      >
                        {store.user.isLogin ? (
                          <Link
                            className=" "
                            to={`/lottoPurchase/${marketObj.marketId}`}
                            onClick={(e) => e.stopPropagation()} // Prevents dropdown collapse
                            style={{
                              color: "#333",
                              textDecoration: "none",
                              display: "block",
                            }}
                          >
                          <div className="px-4 game_text"> ➔ {marketObj.marketName}</div> 
                          </Link>
                        ) : (
                          <Link
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowLogin(true);
                            }} // Prevents dropdown collapse
                            style={{
                              color: "#333",
                              textDecoration: "none",
                              display: "block",
                            }}
                          >
                            {marketObj.marketName}
                          </Link>
                        )}
                        {showLogin && (
                          <Login
                            showLogin={showLogin}
                            setShowLogin={setShowLogin}
                          />
                        )}
                      </li>
                    ) : null
                  )}
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    );
  }

  function getBody() {
    return isMobile ? (
      getLeftNavBar()
    ) : (
      <div
        className="container-fluid custom-scrollbar"
        style={{
          height: ["/home", "/"].includes(location?.pathname)
            ? "85vh"
            : "100vh",
          overflowY: "none",
          overflowX: "hidden",
        }}
      >
        <div className="row">
          {/* LEFT NAVBAR - md: 4, lg: 2 */}
          <div
            className="position-fixed d-none d-md-block col-md-4 col-lg-2 vertical-navbar px-1 scrollbar-aurora-blade   "
            style={{
              height: "90vh",
              overflowY: "auto",
              zIndex: 1020,
              marginTop: isHomePage
                ? store.user.isLogin && location.pathname === "/lottery-home"
                  ? "72px"
                  : ""
                : "93px",
              backgroundColor: "#f8f9fa",
            }}
          >
            {getLeftNavBar()}
          </div>

          {/* MAIN CONTENT - md: 8 offset-4, lg: 7 offset-2 */}
          <div
            className={` offset-md-4 col-md-8 offset-lg-2 px-0  ${
              ["/home", "/"].includes(location?.pathname)
                ? "col-lg-7"
                : "col-lg-10"
            } `}
            style={{
              overflowY: "none",
              height:
                location?.pathname === "/lottery-home"
                  ? "calc(100vh - 5px)"
                  : "calc(100vh - 40px)",
            }}
          >
            <div
              className="container-fluid px-0 "
              style={{
                marginTop:
                  location?.pathname === "/lottery-home" ? "85px" : "-6px",
              }}
            >
              <div className="row ">
                <div
                  className="px-0 "
                  style={{
                    marginBottom: "-10px",
                  }}
                >
                  {showCarousel && <InnerCarousel />}
                </div>
                {["/home", "/"].includes(location?.pathname?.toLowerCase()) && (
                  <div className="px-0 mb-1">{getNavBarOption()}</div>
                )}
              </div>
            </div>

            <div
              className="px-1"
              style={{
                overflowY: "none",
                height: "calc(100vh - 100px)",
                backgroundColor: "white",
                // width: ["/home", "/"].includes(
                //   location?.pathname?.toLowerCase()
                // )
                //   ? isMobileSize <= 435
                //     ? "100vw"
                //     : "59vw"
                //   : "",
              }}
            >
              {children}
            </div>
          </div>

          {/* RIGHT SIDEBAR - only for desktop (lg: col-3) */}
          {["/home", "/"].includes(location?.pathname) && (
            <div
              className="d-none d-lg-block col-lg-3 p-0"
              style={{
                position: "fixed",
                right: "0",
                top: isHomePage ? "100px" : "",
                height: "calc(100vh - 125px)",
                overflowY: "auto",
              }}
            >
              <OpenBets
                betHistoryData={openBetData}
                handleBetHistorySelectionMenu={handleOpenBetsSelectionMenu}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return <div>{getBody()}</div>;
}
export default AppDrawer;
