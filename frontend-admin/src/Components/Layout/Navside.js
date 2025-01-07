import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Utils/Auth";

const Navside = () => {
  const [isExpended,setIsExpended] = useState(false)
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
    <div className={isExpended ?"side-nav-container": "side-nav-container side-nav-container-NX"}>
      <div className="nav-upper">
        <div className="nav-heading">
          {isExpended && (<div className="nav-brand">
            <img />
            <h2>Showkat</h2>
          </div>
        )}
          <button className={isExpended?"hamburger hamburger-in":"hamburger hamburger-out"}
          onClick={()=>setIsExpended(!isExpended)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      <div className="nav-menu"></div>
      </div>
    </div>
  );
};

export default Navside;
