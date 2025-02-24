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

function AppDrawer({
  children,
  showCarousel,
  isMobile,
  isHomePage,
  setShowResetModal,
  showResetModal,
  onMarketSelect, // New prop for market selection callback
}) {
  const [toggleStates, setToggleStates] = useState({});
  const [user_allGames, setUser_allGames] = useState(
    getAllGameDataInitialState()
  );
  const [lotteryDrawTimes, setLotteryDrawTimes] = useState([]);
  const [lotteryToggle, setLotteryToggle] = useState(false); // New state for toggling draw times
  const { dispatch, store } = useAppContext();
  const location = useLocation();
  console.log("location", location);
  useEffect(() => {
    user_getAllGames();
    fetchLotteryMarkets();
  }, [lotteryToggle]);

  // Function to fetch draw times from API
  async function fetchLotteryMarkets() {
    const response = await getLotteryMarketsApi(store);
    if (response?.success) {
      setLotteryDrawTimes(response.data);
      // window.location.reload();
    } else {
      console.warn("Failed to fetch lottery markets. Response:", response);
      setLotteryDrawTimes([]);
    }
  }

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

  const handleLotteryToggle = () => {
    setLotteryToggle(!lotteryToggle);
  };

  function getLeftNavBar() {
    return (
      <div
        className="sidebar border mt-4"
        style={{ overflowY: "auto", height: "82vh" }}
      >
        <span
          style={{
            // background: "#2cb3d1",
            display: "block",
            textIndent: "65px",
            fontWeight: "500",
            fontSize: "14px",
          }}
          className="text-white"
        >
          {/* Popular{" "} */}
          <button
            type="button"
            className="btn-close d-xl-none d-lg-none d-md-none"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            style={{ marginLeft: "70%" }}
          />
        </span>

        <ul className="overflow-auto">
          <li
            className="MenuHead lottery-section text-center"
            onClick={handleLotteryToggle}
          >
            <div className="lottery-wrapper mt-2">
              <span className="new-tag">New</span>
              Lottery
              <span
                className={`dropdown-icon ${lotteryToggle ? "active" : ""}`}
              >
                ▼
              </span>
            </div>
          </li>
          {/* Display lottery draw times */}
          {lotteryToggle && lotteryDrawTimes.length > 0 && (
            <ul className="subMenuItems">
              {lotteryDrawTimes.map((market) => (
                <li key={market.marketId} className="subMenuHead">
                  <Link
                    to={`/lottery/${market.marketId}`}
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default client-side navigation
                      window.location.href = `/lottery/${market.marketId}`; // Force page reload
                    }}
                  >
                    <span className="draw-date-icon">🎟️</span>
                    {market.marketName}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* <li
            className={toggleStates["inPlay"] ? "subMenuHead" : "MenuHead"}
            onClick={() => handleToggle("inPlay")}
          >
            <a href="#">In-Play</a>
          </li> */}
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
          <div
            className="col-md-2 position-fixed d-none d-md-block vertical-navbar p-0"
            style={{
              height: "100vh",
              marginTop: isHomePage ? "0px" : "93px",
            }}
          >
            {getLeftNavBar()}
          </div>

          <div
            className={`col-md-${
              ["/home", "/"].includes(location?.pathname) ? "7" : "10"
            } offset-md-2`}
            style={{
              overflowY: "auto",
              height: "100vh",
            }}
          >
            <div className="col-md-12">{showCarousel && <InnerCarousel />}</div>
            {children}
          </div>

          <div
            className={`col-md-${
              ["/home", "/"].includes(location?.pathname) ? "3" : ""
            } d-none d-md-block  p-0`}
            style={{
              position: ["/home", "/"].includes(location?.pathname) && "fixed",
              right: "0",
              top: isHomePage ? "125px" : "",
              height: "calc(100vh - 125px)",
              overflowY: "auto",
            }}
          >
            <OpenBets />
          </div>
        </div>
      </div>
    );
  }

  return <div>{getBody()}</div>;
}
export default AppDrawer;
