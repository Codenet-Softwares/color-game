import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Utils/Auth";

const Navside = () => {
  const auth = useAuth();
  const [isUser, setIsUser] = useState(true);
  const [isGame, setIsGame] = useState(true);
  const [isAnnouncement, setIsAnnouncement] = useState(true); // announcement
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


  const handleAnnouncementToggle = () => {
    setIsAnnouncement(!isAnnouncement);
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

        {/* Announcement Management */}
        {/* <li className={isAnnouncement ? 'active' : ''}>
          <a className="has-arrow" onClick={handleAnnouncementToggle}>
            <div className="nav_icon_small">
              <img src="../../../../../../img/menu-icon/dashboard.svg" alt="" />
            </div>
            <div className="nav_title">
              <span>Announcement Management</span>
            </div>
          </a>
          {isAnnouncement && (
            <ul>
              <li>
                <Link to="/createAnnouncement">
                  <span>
                    <i class="fa-solid fa-circle"></i>Create Announcement
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/updateAnnouncement">
                  <span>
                    <i class="fa-solid fa-circle"></i>Update Announcement
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/latestAnnouncements">
                  <span>
                    <i class="fa-solid fa-circle"></i>Latest Announcements
                  </span>
                </Link>
              </li>
            </ul>
          )}
        </li> */}
        {/* Announcement Management Ends */}
      </ul>
      {/* List Of the Sidebar Ends */}
    </nav>
  );
};

export default Navside;
