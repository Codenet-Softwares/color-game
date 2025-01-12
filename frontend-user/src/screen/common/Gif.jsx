import React, { useState, useEffect } from "react";
import { getGifImg } from "../../utils/apiService";

const Gif = () => {
  const [gifData, setGifData] = useState([]);

  const fetchGifData = async () => {
    try {
      const response = await getGifImg();
      if (response && response.data) {
        setGifData(response.data);
      } else {
        console.error("Invalid data format received:", response);
        setGifData([]);
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
          className={`col-sm-6 p-0 ${index !== 0 ? "ps-md-3" : ""}`}
          key={index}
        >
          <div className="card">
            <img
              src={item.image}
              className="card-img-top"
              alt={`Gif ${index}`}
              style={{ maxHeight: "200px", objectFit: "cover" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gif;
