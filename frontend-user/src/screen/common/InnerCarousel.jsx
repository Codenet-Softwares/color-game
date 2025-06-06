import React, { useEffect, useState } from "react";
import { getInnerImg } from "../../utils/apiService";
import { useAppContext } from "../../contextApi/context";
import { aAdvertisement } from "../../utils/dummyData";

const InnerCarousel = () => {
  const { store } = useAppContext();
  const [sliderData, setSliderData] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth);

  const fetchSliderImgText = async () => {
    try {
      const response = await getInnerImg();
      if (response.data.length > 0) {
        setSliderData(response.data);
      } else {
        console.error("error", response);
        setSliderData(aAdvertisement);
      }
    } catch (error) {
      console.error("error", error);
      setSliderData([]);
    }
  };

  useEffect(() => {
    fetchSliderImgText();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <div className="row px-0 ">
        <div className="col-md-12">
          <div
            id="carouselExampleCaptions"
            className={`carousel slide mt-1`}
            data-bs-ride="carousel"
            style={{
              height: isMobile <= 435 ? "220px" : "350px",
              overflow: "hidden",
              // backgroundSize: "contain",
              backgroundPosition: "center",
              objectFit: "cover",
            }}
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
                  <div style={{ position: "relative" }}>
                    <img
                      src={item.image}
                      className="d-block w-100"
                      alt={`Slide ${index + 1}`}
                      style={{ height: isMobile <= 435 ? "220px" : "350px" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              className="carousel-control-prev visually-hidden"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next visually-hidden"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnerCarousel;
