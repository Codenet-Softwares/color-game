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
              <span className="ms-3">Live Bet</span>
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
        {/* Image Management */}
        {auth.user.roles === "admin" && (
          <li className="m-2">
            <a
              className={`has-arrow ${isImage ? "active" : ""}`}
              href="#"
              onClick={handleImageToggle}
            >
              <div className="nav_icon_small">
                <i
                  class="fa-solid fa-image"
                  style={{
                    color: "#3E5879",
                    marginRight: "1px",
                    fontSize: "20px",
                  }}
                ></i>
              </div>
              <div className="nav_title">
                <span>Add Image</span>
              </div>
            </a>
            {isImage && (
              <ul>
                {/* Slider Image */}
                <li>
                  <a
                    className={`has-arrow ${isSliderImage ? "active" : ""}`}
                    href="#"
                    onClick={handleSliderImageToggle}
                  >
                    <div className="nav_icon_small">
                      <i
                        class="fa-solid fa-camera"
                        style={{
                          color: "#3E5879",
                          marginRight: "10px",
                          fontSize: "15px",
                        }}
                      ></i>
                    </div>
                    <div className="nav_title">
                      <span>Slider Image</span>
                    </div>
                  </a>
                  {isSliderImage && (
                    <ul>
                      <li>
                        <Link to="create-image">
                          <i
                            className="fa-solid fa-circle"
                            style={{
                              color: "#3E5879",
                              marginRight: "10px",
                              fontSize: "15px",
                            }}
                          ></i>{" "}
                          Create Slider
                        </Link>
                      </li>
                      <li>
                        <Link to="slider-image-delete">
                          <i
                            className="fa-solid fa-circle"
                            style={{
                              color: "#3E5879",
                              marginRight: "10px",
                              fontSize: "15px",
                            }}
                          ></i>{" "}
                          Update Slider
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <a
                    className={`has-arrow ${isGameSliderImage ? "active" : ""}`}
                    href="#"
                    onClick={handleGameImageSlider}
                  >
                    <div className="nav_icon_small">
                      <i
                        class="fa-solid fa-camera"
                        style={{
                          color: "#3E5879",
                          marginRight: "10px",
                          fontSize: "15px",
                        }}
                      ></i>
                    </div>
                    <div className="nav_title">
                      <span>Game Image</span>
                    </div>
                  </a>
                  {isGameSliderImage && (
                    <ul>
                      <li>
                        <Link to="GameImage-slider">
                          <i
                            className="fa-solid fa-circle"
                            style={{
                              color: "#3E5879",
                              marginRight: "10px",
                              fontSize: "15px",
                            }}
                          ></i>{" "}
                          Create Slider
                        </Link>
                      </li>
                      <li>
                        <Link to="UpdateGameImage-slider">
                          <i
                            className="fa-solid fa-circle"
                            style={{
                              color: "#3E5879",
                              marginRight: "10px",
                              fontSize: "15px",
                            }}
                          ></i>{" "}
                          Update Slider
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <a
                    className={`has-arrow ${isGifSliderImage ? "active" : ""}`}
                    href="#"
                    onClick={handleGifImageSlider}
                  >
                    <div className="nav_icon_small">
                      <i
                        class="fa-solid fa-camera"
                        style={{
                          color: "#3E5879",
                          marginRight: "10px",
                          fontSize: "15px",
                        }}
                      ></i>
                    </div>
                    <div className="nav_title">
                      <span>Game GIF</span>
                    </div>
                  </a>
                  {isGifSliderImage && (
                    <ul>
                      <li>
                        <Link to="create-game-GIF">
                          <i
                            className="fa-solid fa-circle"
                            style={{
                              color: "#3E5879",
                              marginRight: "10px",
                              fontSize: "15px",
                            }}
                          ></i>{" "}
                          Create GIF
                        </Link>
                      </li>
                      <li>
                        <Link to="update-game-GIF">
                          <i
                            className="fa-solid fa-circle"
                            style={{
                              color: "#3E5879",
                              marginRight: "10px",
                              fontSize: "15px",
                            }}
                          ></i>{" "}
                          Update GIF
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <a
                    className={`has-arrow ${
                      isInnerSliderImage ? "active" : ""
                    }`}
                    href="#"
                    onClick={handleInnerImageSlider}
                  >
                    <div className="nav_icon_small">
                      <i
                        class="fa-solid fa-camera"
                        style={{
                          color: "#3E5879",
                          marginRight: "10px",
                          fontSize: "15px",
                        }}
                      ></i>
                    </div>
                    <div className="nav_title">
                      <span>Inner Image</span>
                    </div>
                  </a>
                  {isInnerSliderImage && (
                    <ul>
                      <li>
                        <Link to="create-inner-image">
                          <i
                            className="fa-solid fa-circle"
                            style={{
                              color: "#3E5879",
                              marginRight: "10px",
                              fontSize: "15px",
                            }}
                          ></i>{" "}
                          Create Inner Image
                        </Link>
                      </li>
                      <li>
                        <Link to="update-inner-image">
                          <i
                            className="fa-solid fa-circle"
                            style={{
                              color: "#3E5879",
                              marginRight: "10px",
                              fontSize: "15px",
                            }}
                          ></i>{" "}
                          Update Inner Image
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>
        )}
        {/* Game Announcement */}
        {auth.user.roles === "admin" && (
          <li className="game-announcement m-2">
            <a
              className={`has-arrow ${isAnnouncement ? "active" : ""}`}
              href="#"
              onClick={() => toggleMenu(setIsAnnouncement)}
            >
              <div className="nav_icon_small">
                <i
                  class="fa-solid fa-bullhorn"
                  style={{
                    color: "#3E5879",
                    marginRight: "1px",
                    fontSize: "20px",
                  }}
                ></i>
              </div>
              <div className="nav_title">
                <span>Game Announcement</span>
              </div>
            </a>
            {isAnnouncement && (
              <ul>
                {/* Outer Announcement */}
                <li className="outer-announcement">
                  <a
                    className={`has-arrow ${
                      isOuterAnnouncement ? "active" : ""
                    }`}
                    href="#"
                    onClick={() => toggleMenu(setIsOuterAnnouncement)}
                  >
                    <div className="nav_icon_small">
                      <i
                        class="fa-solid fa-bell"
                        style={{
                          color: "#3E5879",
                          marginRight: "10px",
                          fontSize: "15px",
                        }}
                      ></i>
                    </div>
                    <div className="nav_title">
                      <span>Outer Announcement</span>
                    </div>
                  </a>
                  {isOuterAnnouncement && (
                    <ul>
                      <li>
                        <Link to="outer-announcement">
                          <i
                            className="fa-solid fa-circle"
                            style={{
                              color: "#3E5879",
                              marginRight: "10px",
                              fontSize: "15px",
                            }}
                          ></i>{" "}
                          Create Announcement
                        </Link>
                      </li>
                      <li>
                        <Link to="update-outer-announcement">
                          <i
                            className="fa-solid fa-circle"
                            style={{
                              color: "#3E5879",
                              marginRight: "10px",
                              fontSize: "15px",
                            }}
                          ></i>{" "}
                          Update Announcement
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                {/* Inner Announcement */}
                <li className="inner-announcement">
                  <a
                    className={`has-arrow ${
                      isInnerAnnouncement ? "active" : ""
                    }`}
                    href="#"
                    onClick={() => toggleMenu(setIsInnerAnnouncement)}
                  >
                    <div className="nav_icon_small">
                      <i
                        class="fa-solid fa-bell"
                        style={{
                          color: "#3E5879",
                          marginRight: "10px",
                          fontSize: "15px",
                        }}
                      ></i>
                    </div>
                    <div className="nav_title">
                      <span>Inner Announcement</span>
                    </div>
                  </a>
                  {isInnerAnnouncement && (
                    <ul>
                      <li>
                        <Link to="inner-announcement">
                          <i
                            className="fa-solid fa-circle"
                            style={{
                              color: "#3E5879",
                              marginRight: "10px",
                              fontSize: "15px",
                            }}
                          ></i>{" "}
                          Create Announcement
                        </Link>
                      </li>
                      <li>
                        <Link to="update-inner-announcement">
                          <i
                            className="fa-solid fa-circle"
                            style={{
                              color: "#3E5879",
                              marginRight: "10px",
                              fontSize: "15px",
                            }}
                          ></i>{" "}
                          Update Announcement
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>
        )}
        {/* Announcement Management Ends */}
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
