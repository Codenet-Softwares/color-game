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
  const [toggleStates, setToggleStates] = useState({});
  const [user_allGames, setUser_allGames] = useState(
    getAllGameDataInitialState()
  );

  const [lotteryNewDrawTimes, setLotteryNewDrawTimes] = useState([]);
  const [lotteryNewToggle, setLotteryNewToggle] = useState(false); // New state for toggling draw times
  const [isLotteryUpdate, setIsLotteryUpdate] = useState(null); // New state for toggling draw times
  const [isColorgameUpdate, setIsColorgameUpdate] = useState(null);
  const { dispatch, store } = useAppContext();
  const location = useLocation();
  useEffect(() => {
    user_getAllGames();

    fetchLotteryNewMarkets();
  }, [lotteryNewToggle, isLotteryUpdate, isColorgameUpdate]);

  // function for new page fetch
  async function fetchLotteryNewMarkets() {
    const response = await getLotteryMarketsApi(store);
    if (response?.success) {
      setLotteryNewDrawTimes(response.data);
      // window.location.reload();
    } else {
      console.warn("Failed to fetch lottery markets. Response:", response);
      setLotteryNewDrawTimes([]);
    }
  }
  const handleLotteryNewToggle = () => {
    setLotteryNewToggle(!lotteryNewToggle);
  };
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

  const handleToggle = (index) => {
    setToggleStates((prevState) => ({
      [index]: !prevState[index],
    }));

    if (isMobile) {
      // close app drawer logic should call here
    }
  };

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

  function getLeftNavBar() {
    return (
      <div
        className={`sidebar border ${store.user.isLogin ? "mt-4" : "mt-1"}`}
        style={{ overflowY: "auto", height: "85.5vh" }}
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
            style={{ marginLeft: "70%" }}
          />
        </span>

        {lotteryNewDrawTimes && (
          <li
            className="MenuHead lottery-section text-center"
            onClick={handleLotteryNewToggle}
          >
            <div className="lottery-wrapper text-dark mt-2 text-uppercase">
              {/* <span className="new-tag">New</span> */}
              Lottery
              <span
                className={`dropdown-icon ${lotteryNewToggle ? "active" : ""}`}
              >
                ▼
              </span>
            </div>

            {/* Display lottery draw times only when toggled */}
            {lotteryNewToggle && lotteryNewDrawTimes.length > 0 && (
              <ul className="subMenuItems text-info mt-4 ">
                {lotteryNewDrawTimes.map((market) => (
                  <li
                    key={market.marketId}
                    className="subMenuHead mt-2 text-info text-uppercase"
                  >
                    <Link
                      to={`/lottoPurchase/${market.marketId}`}
                      onClick={(e) => e.stopPropagation()} // Prevents closing when submenu is clicked
                    >
                      {market.marketName}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )}

        <ul className="overflow-auto">
          {user_allGames?.map((gameObj, index) => (
            <React.Fragment key={index}>
              {gameObj?.gameName === "Lottery" ? (
                <> </>
              ) : (
                <>
                  <li
                    className={toggleStates[index] ? "subMenuHead" : "MenuHead"}
                    onClick={() => handleToggle(index)}
                  >
                    <Link>{gameObj?.gameName}</Link>
                  </li>
                  {/* Mapping over markets inside each gameName */}
                  {toggleStates[index] && gameObj.markets.length > 0
                    ? gameObj?.markets?.map((marketObj, marketIndex) => {
                        return (
                          <li
                            className="subMenuItems"
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
                        );
                      })
                    : null}
                </>
              )}
            </React.Fragment>
          ))}
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
              height: "calc(100vh - 40px)",
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
