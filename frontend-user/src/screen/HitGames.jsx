import React, { useEffect, useState } from "react";
import { getGameImg } from "../utils/apiService";
import Login from "./loginModal/loginModal";
import { dHitGames } from '../utils/dummyData';

const HitGames = () => {
  const [HitGames, setHitGames] = useState(dHitGames);
  const [showLogin, setShowLogin] = useState(false);

  const fetchSliderImgText = async () => {
    try {
      const response = await getGameImg();
      console.log("response=======",response.data.length >0)
      if (response.data.length > 0) {
        setHitGames(response.data);
      } else {
        setHitGames(dHitGames);
      }
    } catch (error) {
      console.error("Error fetching slider data", error);
      setHitGames([]);
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
      <div className="container mt-3">
        <div className="row g-3">
          {HitGames.map((item, index) => (
            <div
              className="col-12 col-sm-6 col-md-4"
              key={item.id || index}
              onClick={handleImageClick}
              style={{ cursor: "pointer" }}
            >
              <div className="card border-0">
                <img
                  src={item.image}
                  className="card-img-top rounded"
                  alt={`Card ${index}`}
                  style={{ height: "100%", objectFit: "cover", borderRadius: "18px",  aspectRatio: "4 / 3",  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {showLogin && <Login showLogin={showLogin} setShowLogin={setShowLogin} />}
    </>
  );
};

export default HitGames;
