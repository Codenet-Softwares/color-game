import React, { useState, useEffect } from "react";
import { getGifImg } from "../../utils/apiService";
// import { sGif } from "../../utils/dummyData";

const Gif = () => {
  const [gifData, setGifData] = useState([]);

  const fetchGifData = async () => {
    try {
      const response = await getGifImg();
      if (response.data.length > 0) {
        setGifData(response.data);
      } else {
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
    <div className="card-deck px-1 ">
      {gifData.map((item, index) => (
        <div className="card border-0  mt-3 " key={index} style={{ margin: 4 }}>
          <div className="card rounded-0 border-0 mt-0">
            <img
              src={item.image}
              className="card-img-top  rounded-0 "
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
