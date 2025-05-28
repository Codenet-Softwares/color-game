import React, { useEffect, useState } from "react";
import { getGameImg } from "../utils/apiService";
import Login from "./loginModal/loginModal";
import { dHitGames } from "../utils/dummyData";

const HitGames = () => {
  const [sliderData, setSliderData] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  const fetchSliderImgText = async () => {
    try {
      const response = await getGameImg();
      if (response.data.length > 0) {
        setSliderData(response.data);
      } else {
        setSliderData(dHitGames);
      }
    } catch (error) {
      console.error("Error fetching slider data", error);
      setSliderData([]);
    }
  };

  const handleImageClick = () => {
    setShowLogin(true);
  };

  useEffect(() => {
    fetchSliderImgText();
  }, []);

  return (
    <>
      <br />
      <div className="card-deck">
        {sliderData.map((item, index) => (
          <div
            className="card border-0"
            key={item.id || index}
            onClick={handleImageClick}
            style={{ cursor: "pointer" }}
          >
            <img
              src={item.image}
              className="card-img-top"
              style={{borderRadius:"15px", objectFit: "cover"}}
              alt={`Card ${index}`}
            />
          </div>
        ))}
      </div>

      {showLogin && <Login showLogin={showLogin} setShowLogin={setShowLogin} />}
    </>
  );
};

export default HitGames;
