import React, { useState, useEffect } from "react";
import CarouselCard from "../Components/CarouselCard";
import { toast } from "react-toastify";
import AccountServices from "../Services/AccountServices";
import { useAuth } from "../Utils/Auth";

const HomePageCarousel = () => {
  const auth = useAuth();
  const [noOfCarousel, setNoOfCarousel] = useState(0);
  const [CarouselImg, setCarouselImg] = useState(
    Array.from({ length: noOfCarousel }, () => ({
      image: "",
      name: "",
      docBase: "",
      doctype: "",
      headingText: "",
      text: "",
    }))
  );

  useEffect(() => {
    setCarouselImg(
      Array.from({ length: noOfCarousel }, () => ({
        image: "",
        name: "",
        docBase: "",
        doctype: "",
        headingText: "",
        text: "",
      }))
    );
  }, [noOfCarousel]);

  console.log(CarouselImg);
  const updateState = (e) => {
    setNoOfCarousel(e.target.value);
  };

  const updateCarouselData = (index, carouselData) => {
    console.log(carouselData);
    setCarouselImg((prevCarouselImg) => {
      const updatedCarouselImg = [...prevCarouselImg];
      // Update the object at the given index
      updatedCarouselImg[index] = carouselData;
      return updatedCarouselImg;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(CarouselImg);
    if (
      CarouselImg.name === "" ||
      CarouselImg.docBase === "" ||
      CarouselImg.doctype === "" ||
      CarouselImg.headingText === "" ||
      CarouselImg.text === ""
    ) {
      toast.error("fields are required.");
      return;
    }

    AccountServices.uploadSliderImg({ data: CarouselImg }, auth.user)
      .then((res) => {
        console.log(res);
        toast.success(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  };

  console.log(noOfCarousel);
  return (
    <div>
      <div className="main_content_iner ">
        <div className="container-fluid p-0 sm_padding_15px">
          <div className="row justify-content-center">
            <div className="col-lg-4"></div>
            <div className="col-lg-4">
              <div className="white_card card_height_100 mb_30">
                <div className="white_card_header">
                  <div className="box_header m-0">
                    <div className="main-title">
                      <h3 className="m-0">
                        Enter Number Of Carousel Image & Text You Want:
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="white_card_body">
                  <div className=" mb-0">
                    <input
                      type="number"
                      className="form-control"
                      value={noOfCarousel}
                      placeholder="Enter No. of Carousel"
                      onChange={updateState}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4"></div>
          </div>
        </div>
        {CarouselImg.map((carousel, i) => {
          console.log(carousel);
          return (
            <CarouselCard
              CarouselImgData={carousel}
              key={i}
              updateCarouselData={updateCarouselData}
              index={i}
            />
          );
        })}
      </div>
      {noOfCarousel > 0 && (
        <div>
          <div className=" d-flex  justify-content-center">
            <button className="btn btn-primary" onClick={handleSubmit}>
              <span></span>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePageCarousel;
