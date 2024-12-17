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
  const { dispatch } = useAppContext();

  useEffect(() => {
    user_getAllGames();
    fetchLotteryMarkets();
  }, []);

  // Function to fetch draw times from API
  async function fetchLotteryMarkets() {
    const response = await getLotteryMarketsApi();
    if (response?.success) {
      setLotteryDrawTimes(response.data); // Update state with draw times data
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
  const carouselImages = [
    "https://editorial.uefa.com/resources/0288-19b92e19420c-1a9cbc155530-1000/ucl_easportsuclglory_ingamerender_16x9.png",
    "https://www.hindustantimes.com/ht-img/img/2024/01/14/550x309/TOPSHOT-TENNIS-AUS-OPEN-33_1705249861778_1705249942860.jpg",
    "https://assets-webp.khelnow.com/d7293de2fa93b29528da214253f1d8d0/640x360/news/uploads/2024/02/football-lead-pic.jpg.webp",
    "https://deadline.com/wp-content/uploads/2023/08/US-Open-2023-2.jpg",
    "https://pbs.twimg.com/media/GFlDX7JWkAAseHX.jpg:large",
  ];

  function getLeftNavBar() {
    return (
      <div className="sidebar" style={{ overflowY: "auto", height: "100vh" }}>
        <span
          style={{
            background: "#2cb3d1",
            display: "block",
            textIndent: "5px",
            fontWeight: "500",
            fontSize: "14px",
          }}
          className="text-white"
        >
          Popular{" "}
          <button
            type="button"
            className="btn-close d-xl-none d-lg-none "
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            style={{ marginLeft: "70%" }}
          />
        </span>

        <ul>

          <li
            className="MenuHead lottery-section"
            onClick={handleLotteryToggle}
          >
            <div className="lottery-wrapper">
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
                  <Link to={`/lottery/${market.marketId}`}>
                    <span className="draw-date-icon">🎟️</span>
                    {market.marketName}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <li
            className={toggleStates["inPlay"] ? "subMenuHead" : "MenuHead"}
            onClick={() => handleToggle("inPlay")}
          >
            <a href="#">In-Play</a>
          </li>
          {user_allGames.map((gameObj, index) => (
            <React.Fragment key={index}>
              <li
                className={toggleStates[index] ? "subMenuHead" : "MenuHead"}
                onClick={() => handleToggle(index)}
              >
                <Link>{gameObj.gameName}</Link>
              </li>
              {/* Mapping over markets inside each gameName */}
              {toggleStates[index] && gameObj.markets.length > 0
                ? gameObj.markets.map((marketObj, marketIndex) => (
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
                        )}-${marketObj?.marketName?.replace(
                          /\s/g,
                          ""
                        )}/${marketObj?.marketId?.replace(/\s/g, "")}`}
                      >
                        {marketObj.marketName}
                      </Link>
                    </li>
                  ))
                : null}
            </React.Fragment>
          ))}
        </ul>
      </div>
    );
  }

  function getMidCarousel() {
    return (
      <>
        <div
          id="carouselExampleAutoPlaying"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner ">
            {carouselImages.map((image, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""} mt-3`}
              >
                <img
                  src={image}
                  className="d-block w-100"
                  alt={`carousel-image-${index}`}
                  style={{ height: "400px", objectFit: "fill" }}
                />
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleAutoPlaying"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleAutoPlaying"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </>
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
              border: "1px solid red",
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
              height: "100vh",
              // overflowY: 'auto',
            }}
          >
            <div
              className="col-md-12"
              style={{ background: "green", overflowX: "auto" }}
            >
              {showCarousel && getMidCarousel()}
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
