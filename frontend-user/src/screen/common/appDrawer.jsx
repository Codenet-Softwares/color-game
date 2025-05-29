import React, { useState, useEffect } from "react";
import "./appDrawer.css";
import {
  getLotteryMarketsApi,
  user_getAllGamesWithMarketData_api,
} from "../../utils/apiService";
import { Link, useLocation } from "react-router-dom";
import { getAllGameDataInitialState } from "../../utils/getInitiateState";
import HamburgerNavBar from "./hamburgerNavBar";
import { useAppContext } from "../../contextApi/context";
import strings from "../../utils/constant/stringConstant";
import InnerCarousel from "./InnerCarousel";
import Footer from "./Footer";
import OpenBets from "../../betHistory/components/openBets/OpenBets";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Lottery/firebaseStore/lotteryFirebase";

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
}) {
  const [user_allGames, setUser_allGames] = useState(
    getAllGameDataInitialState()
  );
  const [isColorgameUpdate, setIsColorgameUpdate] = useState(null);
  const [toggleMap, setToggleMap] = useState({});

  const { dispatch, store } = useAppContext();

  const location = useLocation();
  useEffect(() => {
    user_getAllGames();
  }, [isColorgameUpdate]);
  console.log("isColorgameUpdate", isColorgameUpdate);

  const handleAllId = (gameId, marketId) => {
    dispatch({
      type: strings.placeBidding,
      payload: { gameId: gameId, marketId: marketId },
    });
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

      console.log("Messages Data:", messagesData);
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

        console.log("Messages Data:", messagesData);
        setIsColorgameUpdate(messagesData);
      }
    );

    return () => unsubscribe();
  }, []);

  function getLeftNavBar() {
    return (
      <div
        className={`sidebar border-top-0 border-end ${
          store.user.isLogin ? "mt-4" : "mt-1"
        }`}
        style={{ overflowY: "auto" }}
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

        <ul className="overflow-auto">
          {user_allGames?.map((gameObj, index) => {
            const isToggled = toggleMap[gameObj.gameId];
            console.log("gameObj", gameObj);

            return (
              <React.Fragment key={index}>
                <li
                  className={isToggled ? "" : "MenuHead"}
                  onClick={() => handleToggle(gameObj.gameId)}
                >
                  <div className="game-wrapper text-dark fw-bold mt-2 text-uppercase px-2 py-2">
                    {gameObj?.gameName}
                    <span
                      className={`dropdown-icon ${isToggled ? "active" : ""}`}
                    >
                      ▼
                    </span>
                  </div>
                </li>

                {isToggled &&
                  gameObj.markets?.map((marketObj, marketIndex) =>
                    gameObj.gameName.toLowerCase() === "colorgame" ? (
                      <li
                        className="subMenuItems text-wrap"
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
                          to={`/gameView/${gameObj?.gameName?.replace(
                            /\s/g,
                            ""
                          )}/${marketObj?.marketName?.replace(
                            /\s/g,
                            ""
                          )}/${marketObj?.marketId?.replace(/\s/g, "")}`}
                        >
                          {marketObj.marketName}
                        </Link>
                      </li>
                    ) : gameObj.gameName.toLowerCase() === "lottery" ? (
                      <li
                        key={marketObj.marketId}
                        className="subMenuItems  text-wrap"
                        style={{
                          wordBreak: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        <Link
                          to={`/lottoPurchase/${marketObj.marketId}`}
                          onClick={(e) => e.stopPropagation()} // Prevents dropdown collapse
                        >
                          {marketObj.marketName}
                        </Link>
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
      <div className="container-fluid">
        <div className="row" style={{ height: "100vh", display: "flex" }}>
          {/* LEFT NAVBAR - md: 4, lg: 2 */}
          <div
            className="position-fixed d-none d-md-block col-md-4 col-lg-2 vertical-navbar p-0"
            style={{
              height: "100vh",
              marginTop: isHomePage ? "0px" : "93px",
            }}
          >
            {getLeftNavBar()}
          </div>

          {/* MAIN CONTENT - md: 8 offset-4, lg: 7 offset-2 */}
          <div
            className={`custom-scrollbar offset-md-4 col-md-8 offset-lg-2 ${
              ["/home", "/"].includes(location?.pathname)
                ? "col-lg-7"
                : "col-lg-10"
            } `}
            style={{
              overflowY: "auto",
              height:
                location?.pathname === "/lottery-home"
                  ? "calc(100vh - 5px)"
                  : "calc(100vh - 40px)",
            }}
          >
            <div className="col-12">{showCarousel && <InnerCarousel />}</div>
            {children}
          </div>

          {/* RIGHT SIDEBAR - only for desktop (lg: col-3) */}
          {["/home", "/"].includes(location?.pathname) && (
            <div
              className="d-none d-lg-block col-lg-3 p-0"
              style={{
                position: "fixed",
                right: "0",
                top: isHomePage ? "125px" : "",
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
