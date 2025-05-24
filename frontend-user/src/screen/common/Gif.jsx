import React, { useState, useEffect } from "react";
import { getGifImg } from "../../utils/apiService";
import { sGif } from "../../utils/dummyData";

const Gif = () => {
  const [gifData, setGifData] = useState([]);

  const fetchGifData = async () => {
    try {
      const response = await getGifImg();
      if (response && response.data) {
        setGifData(response.data);
      } else {
        console.error("Invalid data format received:", response);
        setGifData(sGif);
      }
    } catch (error) {
      console.error("Error fetching GIF data:", error);
      setGifData([]);
    }
  };

  useEffect(() => {
    fetchGifData();
  }, []);

  return (
    <div className="row m-0">
      {gifData.map((item, index) => (
        <div
          className={`col-sm-6 p-1 ${index !== 0 ? "ps-md-3" : ""}`}
          key={index}
        >
          <div className="card rounded-0 border-0">
            <img
              src={item.image}
              className="card-img-top  rounded-0"
              alt={`Gif ${index}`}
              style={{ maxHeight: "200px" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gif;
