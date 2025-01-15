import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Utils/Auth";
import { use } from "react";

const Navside = () => {
  const auth = useAuth();
  const [isUser, setIsUser] = useState(true);
  const [isGame, setIsGame] = useState(true);
  const [isImage, setisImage] = useState(false);
  const [isSliderImage, setisSliderImage] = useState(false);
  const [isGameSliderImage, setisGameSliderImage] = useState(false);
  const [isGifSliderImage, setisGifSliderImage] = useState(false);
  const [isInnerSliderImage, setIsInnerSliderImage] = useState(false);
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [isInnerAnnouncement, setIsInnerAnnouncement] = useState(true);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [inactive, setInactive] = useState(true);

  const navigate = useNavigate();

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
  const handleAnnouncementToggle = () => {
    setIsAnnouncement(!isAnnouncement);
  };
  const handleInnerAnnouncementToggle = () => {
    setIsInnerAnnouncement(!isInnerAnnouncement);
  };

  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };
  return (
    <nav className="sidebar">
      <div className="logo d-flex justify-content-between">
        <a className="large_logo" href="#">
          <img src="../../../../../../img/logo.png" alt="" />
        </a>
        <a className="small_logo" href="#">
          <img src="../../../../../../img/mini_logo.png" alt="" />
        </a>
        <div className="sidebar_close_icon d-lg-none">
          <i className="ti-close"></i>
        </div>
      </div>

      {/*  List Of the Sidebar Starts */}
      <ul id="sidebar_menu" class="metismenu">
        {/* User Management Starts */}
        {/* {isUser ? (
          <li className="" onClick={handleUserToggle}>
            <a className="has-arrow">
              <div className="nav_icon_small">
                <img
                  src="../../../../../../../img/menu-icon/dashboard.svg"
                  alt=""
                />
              </div>
              <div className="nav_title">
                <span>User Management</span>
              </div>
            </a>
          </li>
        ) : (
          <li className="" onClick={handleUserToggle}>
            <a className="has-arrow">
              <div className="nav_icon_small">
                <img
                  src="../../../../../../img/menu-icon/dashboard.svg"
                  alt=""
                />
              </div>
              <div className="nav_title">
                <span>User Management</span>
              </div>
            </a>
            <ul>
              <li>
                <Link to="/userCreate">
                  <span>
                    <i class="fa-solid fa-circle"></i>Create User
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/viewUserList">
                  <span>
                    <i class="fa-solid fa-circle"></i>View User
                  </span>
                </Link>
                <Link to="/homePageCarousel">
                  <span>
                    <i class="fa-solid fa-circle"></i>Set Carousel
                  </span>
                </Link>
              </li>
            </ul>
          </li>
        )} */}
        {/* User Management Ends */}

        {/* Game Management Starts */}
        {isGame ? (
          <li className="" onClick={handleGameToggle}>
            <a className="has-arrow " href="#" aria-expanded="false">
              <div className="nav_icon_small">
                <img
                  src="../../.../../../../img/menu-icon/dashboard.svg"
                  alt=""
                />
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
                <img
                  src="../../../../../../img/menu-icon/dashboard.svg"
                  alt=""
                />
              </div>
              <div className="nav_title">
                <span>Game Management</span>
              </div>
            </a>
            <ul>
              <li>
                <Link to="/gameMarket">
                  <span>
                    <i class="fa-solid fa-circle"></i>Game Market
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/deleteMarket">
                  <span>
                    <i class="fa-solid fa-circle"></i>delete Market
                  </span>
                </Link>
              </li>
            </ul>
          </li>
        )}
        {/* Game Management Ends */}
        <li className="" onClick={handleInactive}>
          <Link to="/announcedGame" className="d-flex align-items-center">
            <div className="nav_icon_small">
              <img
                src="../../.../../../../img/menu-icon/dashboard.svg"
                alt=""
              />
            </div>
            <span className="ms-3">Inactive Games</span>
          </Link>
        </li>
        <li className="">
          <Link to="/voidMarket" className="d-flex align-items-center">
            <div className="nav_icon_small">
              <img
                src="../../.../../../../img/menu-icon/dashboard.svg"
                alt=""
              />
            </div>
            <span className="ms-3">Void Games</span>
          </Link>
        </li>
        <li className="">
          <Link to="/liveBet" className="d-flex align-items-center">
            <div className="nav_icon_small">
              <img
                src="../../.../../../../img/menu-icon/dashboard.svg"
                alt=""
              />
            </div>
            <span className="ms-3">Live Bet</span>
          </Link>
        </li>
        <li className="">
          <Link
            to="/get-bet-markets-afterWin"
            className="d-flex align-items-center"
          >
            <div className="nav_icon_small">
              <img
                src="../../.../../../../img/menu-icon/dashboard.svg"
                alt=""
              />
            </div>
            <span className="ms-3">Bet History</span>
          </Link>
        </li>
        <li className="">
          <Link to="/trash" className="d-flex align-items-center">
            <div className="nav_icon_small">
              <img
                src="../../.../../../../img/menu-icon/dashboard.svg"
                alt=""
              />
            </div>
            <span className="ms-3">Trash Bets</span>
          </Link>
        </li>

        {/* Image Management */}
        <li>
          <a
            className={`has-arrow ${isImage ? "active" : ""}`}
            href="#"
            onClick={handleImageToggle}
          >
            <div className="nav_icon_small">
              <img src="../../../../../../img/menu-icon/dashboard.svg" alt="" />
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
                    <img
                      src="../../../../../../img/menu-icon/dashboard.svg"
                      alt=""
                    />
                  </div>
                  <div className="nav_title">
                    <span>Slider Image</span>
                  </div>
                </a>
                {isSliderImage && (
                  <ul>
                    <li>
                      <Link to="create-image">
                        <i className="fa-solid fa-circle"></i> Create Slider
                      </Link>
                    </li>
                    <li>
                      <Link to="slider-image-delete">
                        <i className="fa-solid fa-circle"></i> Update Slider
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
                    <img
                      src="../../../../../../img/menu-icon/dashboard.svg"
                      alt=""
                    />
                  </div>
                  <div className="nav_title">
                    <span>Game Image</span>
                  </div>
                </a>
                {isGameSliderImage && (
                  <ul>
                    <li>
                      <Link to="GameImage-slider">
                        <i className="fa-solid fa-circle"></i> Create Slider
                      </Link>
                    </li>
                    <li>
                      <Link to="UpdateGameImage-slider">
                        <i className="fa-solid fa-circle"></i> Update Slider
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
                    <img
                      src="../../../../../../img/menu-icon/dashboard.svg"
                      alt=""
                    />
                  </div>
                  <div className="nav_title">
                    <span>Game GIF</span>
                  </div>
                </a>
                {isGifSliderImage && (
                  <ul>
                    <li>
                      <Link to="create-game-GIF">
                        <i className="fa-solid fa-circle"></i> Create GIF
                      </Link>
                    </li>
                    <li>
                      <Link to="update-game-GIF">
                        <i className="fa-solid fa-circle"></i> Update GIF
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <a
                  className={`has-arrow ${isInnerSliderImage ? "active" : ""}`}
                  href="#"
                  onClick={handleInnerImageSlider}
                >
                  <div className="nav_icon_small">
                    <img
                      src="../../../../../../img/menu-icon/dashboard.svg"
                      alt=""
                    />
                  </div>
                  <div className="nav_title">
                    <span>Inner Image</span>
                  </div>
                </a>
                {isInnerSliderImage && (
                  <ul>
                    <li>
                      <Link to="create-inner-image">
                        <i className="fa-solid fa-circle"></i> Create Inner
                        Image
                      </Link>
                    </li>
                    <li>
                      <Link to="update-inner-image">
                        <i className="fa-solid fa-circle"></i> Update Inner
                        Image
                      </Link>
                    </li>
                  </ul>
                )}
                
              </li>
            </ul>
          )}
        </li>

        {/* Announcement Management */}
        <li className="" onClick={handleAnnouncementToggle}>
          <a
            className="has-arrow"
            href="#"
            aria-expanded={isAnnouncement ? "true" : "false"}
          >
            <div className="nav_icon_small">
              <img src="../../../../../../img/menu-icon/dashboard.svg" alt="" />
            </div>
            <div className="nav_title">
              <span>Game Announcement</span>
            </div>
          </a>
          {/* Submenu */}
          {isAnnouncement && (
            <ul>
              <li>
                <a
                  className={`has-arrow ${isSliderImage ? "active" : ""}`}
                  href="#"
                  onClick={handleSliderImageToggle}
                >
                  <div className="nav_icon_small">
                    <img
                      src="../../../../../../img/menu-icon/dashboard.svg"
                      alt=""
                    />
                  </div>
                  <div className="nav_title">
                    <span>Outer Announcement</span>
                  </div>
                </a>
                {isInnerAnnouncement && (
                  <ul>
                    <li>
                      <Link to="outer-announcement">
                        <i className="fa-solid fa-circle"></i> Create
                        Announcement
                      </Link>
                    </li>
                    <li>
                      <Link to="update-outer-announcement">
                        <i className="fa-solid fa-circle"></i> Update Slider
                      </Link>
                    </li>
                  </ul>
                )}
                 <a
                  className={`has-arrow ${isSliderImage ? "active" : ""}`}
                  href="#"
                  onClick={handleInnerAnnouncementToggle}
                >
                  <div className="nav_icon_small">
                    <img
                      src="../../../../../../img/menu-icon/dashboard.svg"
                      alt=""
                    />
                  </div>
                  <div className="nav_title">
                    <span>Inner Announcement</span>
                  </div>
                  {isInnerAnnouncement && (
                  <ul>
                    <li>
                      <Link to="inner-announcement">
                        <i className="fa-solid fa-circle"></i> Create
                        Announcement
                      </Link>
                    </li>
                    <li>
                      <Link to="update-inner-announcement">
                        <i className="fa-solid fa-circle"></i> Update Slider
                      </Link>
                    </li>
                  </ul>
                )}
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Announcement Management Ends */}
      </ul>

      {/* List Of the Sidebar Ends */}
    </nav>
  );
};

export default Navside;
