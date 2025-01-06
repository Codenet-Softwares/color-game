import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Utils/Auth";

const Navside = () => {
  const auth = useAuth();
  const [isUser, setIsUser] = useState(true);
  const [isGame, setIsGame] = useState(true);
  const [isAnnouncement, setIsAnnouncement] = useState(true);
  const [inactive, setInactive] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleItemClick = (index) => {
    setActiveItem(index);
  };
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
  const handleAnnouncementToggle = () => {
    setIsAnnouncement(!isAnnouncement);
  };

  return (
    <nav className={`nav ${isSidebarOpen ? "open" : ""}`}>
     <div className="main-toggle" onClick={toggleSidebar}>
        <span className="toggle-icon">
          <i className={`fa-solid fa-${isSidebarOpen ? "xmark" : "bars"}`}></i>
        </span>
      </div>
      <ul id="sidebar_menu" class="metismenu">
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
            </ul>
          </li>
        )}
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
        <li className="" >
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
        <li className="" >
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
        <li className="" >
          <Link to="/get-bet-markets-afterWin" className="d-flex align-items-center">
            <div className="nav_icon_small">
              <img
                src="../../.../../../../img/menu-icon/dashboard.svg"
                alt=""
              />
            </div>
            <span className="ms-3">Bet History</span>
          </Link>
        </li>
        <li className="" >
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
      </ul>
    </nav>
  );
};

export default Navside;
