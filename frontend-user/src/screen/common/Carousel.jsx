import React, { useEffect, useState } from "react";
import { getSliderImgText } from "../../utils/apiService";
import { dSlider } from "../../utils/dummyData";


const Carousel = () => {
  const [sliderData, setSliderData] = useState([]);

  const fetchSliderImgText = async () => {
    try {
      const response = await getSliderImgText();
      if (response && response.data) {
        setSliderData(response.data);
      } else {
        console.error("error", response);
        setSliderData(dSlider);
      }
    } catch (error) {
      console.error("error", error);
      setSliderData(dSlider);
    }
  };

  useEffect(() => {
    fetchSliderImgText();
  }, []);

  return (
    <div
      id="carouselExampleCaptions"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-indicators">
        {sliderData.map((item, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
      <div className="carousel-inner">
        {sliderData.map((item, index) => (
          <div
            key={item.id}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <div className="carousel-img-container">
              <img
                src={item.image}
                className="d-block w-100 carousel-img"
                alt={`Slide ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
