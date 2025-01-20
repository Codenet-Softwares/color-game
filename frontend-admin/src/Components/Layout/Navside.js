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
  const [isInnerAnnouncement, setIsInnerAnnouncement] = useState(false);
  const [isOuterAnnouncement, setIsOuterAnnouncement] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [inactive, setInactive] = useState(true);

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
        <a className="large_logo text-decoration-none" href="welcome">
          <img src="https://static.vecteezy.com/system/resources/previews/019/194/935/non_2x/global-admin-icon-color-outline-vector.jpg" alt="" />
          {/* <h4 className="text-decoration-none fw-bolder" style={{color:"#3E5879"}}>Color Game Admin</h4> */}
        </a>
       
      </div>
      {/*  List Of the Sidebar Starts */}
      <ul id="sidebar_menu" class="metismenu p-2 ">
        {/* Game Management Starts */}
        {isGame ? (
          <li className="m-2" onClick={handleGameToggle}>
            <a className="has-arrow " href="#" aria-expanded="false">
              <div className="nav_icon_small">
              <i className="fa-solid fa-gamepad" style={{ color: "#3E5879", marginRight: "10px", fontSize:"20px" }}></i>

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
              <i className="fa-solid fa-gamepad" style={{ color: "#3E5879", marginRight: "10px", fontSize:"20px" }}></i>
              </div>
              <div className="nav_title">
                <span>Game Management</span>
              </div>
            </a>
            <ul>
              <li>
                <Link to="/gameMarket">
                  <span>
                  <i className="fa-solid fa-store" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px" }}></i>
                  Game Market
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/deleteMarket">
                  <span>
                  <i class="fa-solid fa-trash" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px" }}></i>
                  delete Market
                  </span>
                </Link>
              </li>
            </ul>
          </li>
        )}
        {/* Game Management Ends */}
        <li className="m-2" onClick={handleInactive}>
          <Link to="/announcedGame" className="d-flex align-items-center">
            <div className="nav_icon_small">
            <i class="fa-solid fa-ban" style={{ color: "#3E5879", marginRight: "1px", fontSize:"20px" }}></i>
            </div>
            <span className="ms-3">Inactive Games</span>
          </Link>
        </li>
        <li className="m-2">
          <Link to="/voidMarket" className="d-flex align-items-center">
            <div className="nav_icon_small" >
            <i class="fa-solid fa-eraser" style={{ color: "#3E5879", marginRight: "1px", fontSize:"20px" }}></i>

            </div>
            <span className="ms-3">Void Games</span>
          </Link>
        </li>
        <li className="m-2">
          <Link to="/liveBet" className="d-flex align-items-center">
            <div className="nav_icon_small">
            <i class="fa-solid fa-broadcast-tower" style={{ color: "#3E5879", marginRight: "1px", fontSize:"20px" }}></i>

            </div>
            <span className="ms-3">Live Bet</span>
          </Link>
        </li>
        <li className="m-2">
          <Link
            to="/get-bet-markets-afterWin"
            className="d-flex align-items-center"
          >
            <div className="nav_icon_small">
            <i class="fa-solid fa-history" style={{ color: "#3E5879", marginRight: "1px", fontSize:"20px" }}></i>

            </div>
            <span className="ms-3">Bet History</span>
          </Link>
        </li>
        <li className="m-2">
          <Link to="/trash" className="d-flex align-items-center">
            <div className="nav_icon_small">
            <i class="fa-solid fa-trash" style={{ color: "#3E5879", marginRight: "1px", fontSize:"20px"}}></i>

            </div>
            <span className="ms-3">Trash Bets</span>
          </Link>
        </li>

        {/* Image Management */}
        <li className="m-2">
          <a
            className={`has-arrow ${isImage ? "active" : ""}`}
            href="#"
            onClick={handleImageToggle}
          >
            <div className="nav_icon_small">
            <i class="fa-solid fa-image" style={{ color: "#3E5879", marginRight: "1px", fontSize:"20px"}}></i>
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
                  <i class="fa-solid fa-camera" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px"}}></i>

                  </div>
                  <div className="nav_title">
                    <span>Slider Image</span>
                  </div>
                </a>
                {isSliderImage && (
                  <ul>
                    <li>
                      <Link to="create-image">
                        <i className="fa-solid fa-circle" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px"}}></i> Create Slider
                      </Link>
                    </li>
                    <li>
                      <Link to="slider-image-delete">
                        <i className="fa-solid fa-circle" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px"}}></i> Update Slider
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
                  <i class="fa-solid fa-camera" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px"}}></i>

                  </div>
                  <div className="nav_title">
                    <span>Game Image</span>
                  </div>
                </a>
                {isGameSliderImage && (
                  <ul>
                    <li>
                      <Link to="GameImage-slider">
                        <i className="fa-solid fa-circle" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px"}}></i> Create Slider
                      </Link>
                    </li>
                    <li>
                      <Link to="UpdateGameImage-slider">
                        <i className="fa-solid fa-circle" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px"}}></i> Update Slider
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
                  <i class="fa-solid fa-camera" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px"}}></i>

                  </div>
                  <div className="nav_title">
                    <span>Game GIF</span>
                  </div>
                </a>
                {isGifSliderImage && (
                  <ul>
                    <li>
                      <Link to="create-game-GIF">
                        <i className="fa-solid fa-circle" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px"}}></i> Create GIF
                      </Link>
                    </li>
                    <li>
                      <Link to="update-game-GIF">
                        <i className="fa-solid fa-circle" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px"}}></i> Update GIF
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
                  <i class="fa-solid fa-camera" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px"}}></i>

                  </div>
                  <div className="nav_title">
                    <span>Inner Image</span>
                  </div>
                </a>
                {isInnerSliderImage && (
                  <ul>
                    <li>
                      <Link to="create-inner-image">
                        <i className="fa-solid fa-circle" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px"}}></i> Create Inner
                        Image
                      </Link>
                    </li>
                    <li>
                      <Link to="update-inner-image">
                        <i className="fa-solid fa-circle" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px"}}></i> Update Inner
                        Image
                      </Link>
                    </li>
                  </ul>
                )}
                
              </li>
            </ul>
          )}
        </li>

         {/* Game Announcement */}
         <li className="game-announcement m-2">
    <a
      className={`has-arrow ${isAnnouncement ? "active" : ""}`}
      href="#"
      onClick={() => toggleMenu(setIsAnnouncement)}
    >
      <div className="nav_icon_small">
      <i class="fa-solid fa-bullhorn" style={{ color: "#3E5879", marginRight: "1px", fontSize:"20px"}}></i>
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
            className={`has-arrow ${isOuterAnnouncement ? "active" : ""}`}
            href="#"
            onClick={() => toggleMenu(setIsOuterAnnouncement)}
          >
            <div className="nav_icon_small">
            <i class="fa-solid fa-bell" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px"}}></i>

            </div>
            <div className="nav_title">
              <span>Outer Announcement</span>
            </div>
          </a>
          {isOuterAnnouncement && (
            <ul>
              <li>
                <Link to="outer-announcement">
                  <i className="fa-solid fa-circle" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px"}}></i> Create Announcement
                </Link>
              </li>
              <li>
                <Link to="update-outer-announcement">
                  <i className="fa-solid fa-circle" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px"}}></i> Update Announcement
                </Link>
              </li>
            </ul>
          )}
        </li>
        {/* Inner Announcement */}
        <li className="inner-announcement">
          <a
            className={`has-arrow ${isInnerAnnouncement ? "active" : ""}`}
            href="#"
            onClick={() => toggleMenu(setIsInnerAnnouncement)}
          >
            <div className="nav_icon_small">
            <i class="fa-solid fa-bell" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px"}}></i>

            </div>
            <div className="nav_title">
              <span>Inner Announcement</span>
            </div>
          </a>
          {isInnerAnnouncement && (
            <ul>
              <li>
                <Link to="inner-announcement">
                  <i className="fa-solid fa-circle" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px"}}></i> Create Announcement
                </Link>
              </li>
              <li>
                <Link to="update-inner-announcement">
                  <i className="fa-solid fa-circle" style={{ color: "#3E5879", marginRight: "10px", fontSize:"15px"}}></i> Update Announcement
                </Link>
              </li>
            </ul>
          )}
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
