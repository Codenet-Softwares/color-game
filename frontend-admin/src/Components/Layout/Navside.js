import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Utils/Auth";
import { use } from "react";

const Navside = () => {
  const auth = useAuth();
  console.log("line 09 for roles", auth.user.roles === "subAdmin");
  const [isUser, setIsUser] = useState(true);
  const [isGame, setIsGame] = useState(true);
  const [isSubAdmin, setIsSubAdmin] = useState(true);
  const [isAccouncedMarket, setIsAccouncedMarket] = useState(true);
  const [isImage, setisImage] = useState(false);
  const [isSliderImage, setisSliderImage] = useState(false);
  const [isGameSliderImage, setisGameSliderImage] = useState(false);
  const [isGifSliderImage, setisGifSliderImage] = useState(false);
  const [isInnerSliderImage, setIsInnerSliderImage] = useState(false);
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [isInnerAnnouncement, setIsInnerAnnouncement] = useState(false);
  const [isOuterAnnouncement, setIsOuterAnnouncement] = useState(false);
  const [isWinningRequest, setIsWinningRequest] = useState(true);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [inactive, setInactive] = useState(true);
  const [isBetTracker, setIsBetTracker] = useState(false);

  const navigate = useNavigate();
  const toggleMenu = (menuSetter) => {
    menuSetter((prev) => !prev);
  };
  const handleUserToggle = () => {
    setIsUser(!isUser);
  };

  const handleInactive = () => {
    setInactive(!inactive);
  };

  const handleGameToggle = () => {
    setIsGame(!isGame);
  };
  const handleImageToggle = () => {
    setisImage(!isImage);
  };
  const handleSliderImageToggle = () => {
    setisSliderImage(!isSliderImage);
  };
  const handleGameImageSlider = () => {
    setisGameSliderImage(!isGameSliderImage);
  };
  const handleGifImageSlider = () => {
    setisGifSliderImage(!isGifSliderImage);
  };
  const handleInnerImageSlider = () => {
    setIsInnerSliderImage(!isInnerSliderImage);
  };

  const handleWinningrequestToggle = () => {
    setIsWinningRequest(!isWinningRequest);
  };

  const handleSubAdminToggle = () => {
    setIsSubAdmin(!isSubAdmin);
  };

  const handleAccouncedMarketToggle = () => {
    setIsAccouncedMarket(!isAccouncedMarket);
  };

  return (
    <nav className="sidebar">
      <div className="logo d-flex justify-content-between">
        <Link className="large_logo text-decoration-none" to="/welcome">
          <img
            src="https://static.vecteezy.com/system/resources/previews/019/194/935/non_2x/global-admin-icon-color-outline-vector.jpg"
            alt=""
          />
          {/* <h4 className="text-decoration-none fw-bolder" style={{color:"#3E5879"}}>Color Game Admin</h4> */}
        </Link>
      </div>
      {/*  List Of the Sidebar Starts */}
      <ul id="sidebar_menu" class="metismenu p-2 ">
        {/* Game Management Starts */}
        {isGame ? (
          <li className="m-2" onClick={handleGameToggle}>
            <a className="has-arrow " href="#" aria-expanded="false">
              <div className="nav_icon_small">
                <i
                  className="fa-solid fa-gamepad"
                  style={{
                    color: "#3E5879",
                    marginRight: "10px",
                    fontSize: "20px",
                  }}
                ></i>
              </div>
              <div className="nav_title">
                <span>Game Management</span>
              </div>
            </a>
          </li>
        ) : (
          <li className="" onClick={handleGameToggle}>
            <a className="has-arrow" href="#" aria-expanded="false">
              <div className="nav_icon_small">
                <i
                  className="fa-solid fa-gamepad"
                  style={{
                    color: "#3E5879",
                    marginRight: "10px",
                    fontSize: "20px",
                  }}
                ></i>
              </div>
              <div className="nav_title">
                <span>Game Management</span>
              </div>
            </a>
            <ul>
              <li>
                <Link to="/gameMarket">
                  <span>
                    <i
                      className="fa-solid fa-store"
                      style={{
                        color: "#3E5879",
                        marginRight: "10px",
                        fontSize: "15px",
                      }}
                    ></i>
                    Game Market
                  </span>
                </Link>
              </li>
              {auth.user.roles === "admin" && (
                <li>
                  <Link to="/deleteMarket">
                    <span>
                      <i
                        class="fa-solid fa-trash"
                        style={{
                          color: "#3E5879",
                          marginRight: "10px",
                          fontSize: "15px",
                        }}
                      ></i>
                      delete Market
                    </span>
                  </Link>
                </li>
              )}
            </ul>
          </li>
        )}
        {/* Game Management Ends */}
        {/* create subadmin start */}
        {isSubAdmin
          ? auth.user.roles === "admin" && (
              <li className="m-2" onClick={handleSubAdminToggle}>
                <a className="has-arrow " href="#" aria-expanded="false">
                  <div className="nav_icon_small">
                    <i
                      className="fa-solid fa-gamepad"
                      style={{
                        color: "#3E5879",
                        marginRight: "10px",
                        fontSize: "20px",
                      }}
                    ></i>
                  </div>
                  <div className="nav_title">
                    <span>Sub Admin Management</span>
                  </div>
                </a>
              </li>
            )
          : auth.user.roles === "admin" && (
              <li className="" onClick={handleSubAdminToggle}>
                <a className="has-arrow" href="#" aria-expanded="false">
                  <div className="nav_icon_small">
                    <i
                      className="fa-solid fa-gamepad"
                      style={{
                        color: "#3E5879",
                        marginRight: "10px",
                        fontSize: "20px",
                      }}
                    ></i>
                  </div>
                  <div className="nav_title">
                    <span>Sub Admin Management</span>
                  </div>
                </a>
                <ul>
                  <li>
                    <Link to="/create-subadmin">
                      <span>
                        <i
                          className="fa-solid fa-user-plus"
                          style={{
                            color: "#3E5879",
                            marginRight: "10px",
                            fontSize: "15px",
                          }}
                        ></i>
                        Create
                      </span>
                    </Link>
                  </li>
                  {auth.user.roles === "admin" && (
                    <li>
                      <Link to="/viewsubadmin">
                        <span>
                          <i
                            class="fa-solid fa-list"
                            style={{
                              color: "#3E5879",
                              marginRight: "10px",
                              fontSize: "15px",
                            }}
                          ></i>
                          view
                        </span>
                      </Link>
                    </li>
                  )}
                </ul>
              </li>
            )}
        {/* create subadmin end */}
        {auth.user.roles === "admin" && (
          <li className="m-2">
            <Link to="/voidMarket" className="d-flex align-items-center">
              <div className="nav_icon_small">
                <i
                  class="fa-solid fa-eraser"
                  style={{
                    color: "#3E5879",
                    marginRight: "1px",
                    fontSize: "20px",
                  }}
                ></i>
              </div>
              <span className="ms-3">Void Market</span>
            </Link>
          </li>
        )}
        {auth.user.roles === "admin" && (
          <li className="m-2">
            <Link to="/liveBet" className="d-flex align-items-center">
              <div className="nav_icon_small">
                <i
                  class="fa-solid fa-broadcast-tower"
                  style={{
                    color: "#3E5879",
                    marginRight: "1px",
                    fontSize: "20px",
                  }}
                ></i>
              </div>
              <span className="ms-3">Live Bets</span>
            </Link>
          </li>
        )}

        {auth.user.roles === "admin" && (
          <li className="m-2">
            <Link to="/trash" className="d-flex align-items-center">
              <div className="nav_icon_small">
                <i
                  class="fa-solid fa-trash"
                  style={{
                    color: "#3E5879",
                    marginRight: "1px",
                    fontSize: "20px",
                  }}
                ></i>
              </div>
              <span className="ms-3">Trash Bets</span>
            </Link>
          </li>
        )}
  
       
        {/* Winning Request Starts */}
        {auth?.user?.roles === "admin" && (
          <>
            {isWinningRequest ? (
              <li className="m-2" onClick={handleWinningrequestToggle}>
                <a className="has-arrow " href="#" aria-expanded="false">
                  <div className="nav_icon_small">
                    <i
                      className="fa-solid fa-gamepad"
                      style={{
                        color: "#3E5879",
                        marginRight: "10px",
                        fontSize: "20px",
                      }}
                    ></i>
                  </div>
                  <div className="nav_title">
                    <span>Winning Request</span>
                  </div>
                </a>
              </li>
            ) : (
              <li className="" onClick={handleWinningrequestToggle}>
                <a className="has-arrow" href="#" aria-expanded="false">
                  <div className="nav_icon_small">
                    <i
                      className="fa-solid fa-gamepad"
                      style={{
                        color: "#3E5879",
                        marginRight: "10px",
                        fontSize: "20px",
                      }}
                    ></i>
                  </div>
                  <div className="nav_title">
                    <span>Winning Request</span>
                  </div>
                </a>
                <ul>
                  <li>
                    <Link to="/viewWinningRequest">
                      <span>
                        <i
                          className="fa-solid fa-store"
                          style={{
                            color: "#3E5879",
                            marginRight: "10px",
                            fontSize: "15px",
                          }}
                        ></i>
                        View Request
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/viewWinningHistory">
                      <span>
                        <i
                          class="fa-solid fa-trash"
                          style={{
                            color: "#3E5879",
                            marginRight: "10px",
                            fontSize: "15px",
                          }}
                        ></i>
                        View History
                      </span>
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </>
        )}
        {/* Winning Request Ends */}

        {/* SubAdmin History Start*/}
        {auth.user.roles === "subAdmin" && (
          <li className="m-2">
            <Link to="/all-subAdmin-data" className="d-flex align-items-center">
              <div className="nav_icon_small">
                <i
                  class="fa-solid fa-clock"
                  style={{
                    color: "#3E5879",
                    marginRight: "1px",
                    fontSize: "20px",
                  }}
                ></i>
              </div>
              <span className="ms-3">Sub-Admin History</span>
            </Link>
          </li>
        )}
        {/* SubAdmin History End*/}
        {/* SubAdmin Win Result Start */}
        {auth.user.roles === "subAdmin" && (
          <li className="m-2">
            <Link
              to="/subAdmin-win-result"
              className="d-flex align-items-center"
            >
              <div className="nav_icon_small">
                <i
                  class="fa-solid fa-trophy"
                  style={{
                    color: "#3E5879",
                    marginRight: "1px",
                    fontSize: "20px",
                  }}
                ></i>
              </div>
              <span className="ms-3">Sub-Admin Win Result</span>
            </Link>
          </li>
        )}
        {/* SubAdmin Win Result End */}
        {/* Announced Market end */}
        {isAccouncedMarket
          ? auth.user.roles === "admin" && (
              <li className="m-2" onClick={handleAccouncedMarketToggle}>
                <a className="has-arrow " href="#" aria-expanded="false">
                  <div className="nav_icon_small">
                    <i
                      className="fa-solid fa-gamepad"
                      style={{
                        color: "#3E5879",
                        marginRight: "10px",
                        fontSize: "20px",
                      }}
                    ></i>
                  </div>
                  <div className="nav_title">
                    <span>Announced Market</span>
                  </div>
                </a>
              </li>
            )
          : auth.user.roles === "admin" && (
              <li className="" onClick={handleAccouncedMarketToggle}>
                <a className="has-arrow" href="#" aria-expanded="false">
                  <div className="nav_icon_small">
                    <i
                      className="fa-solid fa-gamepad"
                      style={{
                        color: "#3E5879",
                        marginRight: "10px",
                        fontSize: "20px",
                      }}
                    ></i>
                  </div>
                  <div className="nav_title">
                    <span>Announced Market</span>
                  </div>
                </a>
                <ul>
                  <li>
                    <Link to="/winTracker">
                      <span>
                        <i
                          className="fa-solid fa-satellite-dish"
                          style={{
                            color: "#3E5879",
                            marginRight: "10px",
                            fontSize: "15px",
                          }}
                        ></i>
                        Winning Bets
                      </span>
                    </Link>
                  </li>
                  {auth.user.roles === "admin" && (
                    <li>
                      <Link to="/get-bet-markets-afterWin">
                        <span>
                          <i
                            class="fa-solid fa-history"
                            style={{
                              color: "#3E5879",
                              marginRight: "10px",
                              fontSize: "15px",
                            }}
                          ></i>
                          Bet History
                        </span>
                      </Link>
                    </li>
                  )}
                </ul>
              </li>
            )}
        {/* Announced Market end */}
      </ul>

      {/* List Of the Sidebar Ends */}
    </nav>
  );
};

export default Navside;
