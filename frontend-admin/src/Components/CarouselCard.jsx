import React, { useEffect, useState } from "react";
import Upload from "./upload";

const CarouselCard = ({ CarouselImgData, key, updateCarouselData, index }) => {
  return (
    <div key={index}>
      <div className="row justify-content-center">
        <div className="col-lg-3"></div>
        <div className="col-lg-6">
          <div className="white_card card_height_100 mb_30">
            <div className="white_card_header">
              <div className="box_header m-0">
                <div className="main-title">
                  <h3 className="m-0">Custom file input</h3>
                </div>
              </div>
            </div>
            <Upload
              CarouselImgData={CarouselImgData}
              index={index}
              updateCarouselData={updateCarouselData}
            />
          </div>
        </div>
        <div className="col-lg-3"></div>
      </div>
    </div>
  );
};

export default CarouselCard;
