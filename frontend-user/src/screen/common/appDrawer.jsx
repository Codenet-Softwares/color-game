import React, { useState, useEffect } from "react";
import "./appDrawer.css";
import {
  getLotteryMarketsApi,
  user_getAllGamesWithMarketData_api,
} from "../../utils/apiService";
import { Link } from "react-router-dom";
import { getAllGameDataInitialState } from "../../utils/getInitiateState";
import HamburgerNavBar from "./hamburgerNavBar";
import { useAppContext } from "../../contextApi/context";
import strings from "../../utils/constant/stringConstant";
import InnerCarousel from "./InnerCarousel";
import Footer from "./Footer";

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

  const [lotteryNewDrawTimes, setLotteryNewDrawTimes] = useState([]);
  const [lotteryNewToggle, setLotteryNewToggle] = useState(false); // New state for toggling draw times
  const { dispatch, store } = useAppContext();

  useEffect(() => {
    user_getAllGames();

    fetchLotteryNewMarkets();
  }, [lotteryNewToggle]);

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

  function getLeftNavBar() {
    return (
      <div
        className="sidebar border mt-5"
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

        
        {lotteryNewDrawTimes && lotteryNewDrawTimes.length > 0 && (
            <li
              className="MenuHead lottery-section text-center"
              onClick={handleLotteryNewToggle}
            >
              <div className="lottery-wrapper mt-2">
                <span className="new-tag">New</span>
                Lottery New
                <span
                  className={`dropdown-icon ${
                    lotteryNewToggle ? "active" : ""
                  }`}
                >
                  ▼
                </span>
              </div>

              {/* Display lottery draw times only when toggled */}
              {lotteryNewToggle && (
                <ul className="subMenuItems mt-4">
                  {lotteryNewDrawTimes.map((market) => (
                    <li key={market.marketId} className="subMenuHead mt-2">
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
        <div className="row">
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
            className="col-md-10 offset-md-2"
            style={{
              // border: '1px solid red',
              height: "84vh",
              overflowY: "auto",
            }}
          >
            <div
              className="col-md-12"
              // style={{ background: "green", overflowX: "auto" }}
            >
              {showCarousel && <InnerCarousel />}
            </div>
            {children}
          </div>
        </div>
      </div>
    );
  }

  return <div>{getBody()}</div>;
}
export default AppDrawer;
