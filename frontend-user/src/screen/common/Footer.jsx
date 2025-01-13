import React, { useState } from "react";
import spribe from "../../asset/spribe-large.webp";
import evolution from "../../asset/evolution-gaming_2-removebg-preview.png";
import betgames from "../../asset/betgames-tv-removebg-preview.png";
import betsoft from "../../asset/bet_soft-removebg-preview.png";
import eighteen from "../../asset/+18-removebg-preview.png";
import evoplay from "../../asset/evoplay-removebg-preview.png";
import pragmaticpplay from "../../asset/pragmatic-live-casino-removebg-preview.png";
import zugi from "../../asset/zugi-removebg-preview.png";
import superspade from "../../asset/SuperSpade-Games-logo-png-removebg-preview.png";
import Login from "../loginModal/loginModal";

const Footer = () => {
  const [showLogin, setShowLogin] = useState(false);

  const footerImageData = [
    { image: spribe },
    { image: evolution },
    { image: betgames },
    { image: betsoft },
    { image: evoplay },
    { image: pragmaticpplay },
    { image: zugi },
    { image: superspade },
    { image: eighteen },
  ];

  const handleFooterImageClick = () => {
    setShowLogin(true);
  };

  return (
    <div className="footerBox">
      <div className="container">
        <footer className="py-2 my-2">
          <ul className="nav justify-content-center pb-3 mb-2">
            {footerImageData.map((item, index) => (
              <li className="nav-item row" key={index}>
                <img
                  src={item.image}
                  alt={`footer-image-${index}`}
                  className="icontainer"
                  onClick={handleFooterImageClick}
                  style={{
                    maxWidth: "100px",
                    margin: "10px",
                    cursor: "pointer",
                  }}
                />
              </li>
            ))}
          </ul>
        </footer>
      </div>
      <div className="text-center">
        <p className="text-white fs-6">
          You must be over 18 years old, or the legal age at which gambling or
          gaming activities are allowed under the law or jurisdiction that
          applies to you.
        </p>
      </div>

      {showLogin && <Login showLogin={showLogin} setShowLogin={setShowLogin} />}
    </div>
  );
};

export default Footer;
