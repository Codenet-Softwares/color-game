import React from "react";
import HandImg from "../asset/best_betting_image-removeBg-preview.png";
import LogoImg from "../asset/Logo.png";
import "./DownloadApp.css";
const DownloadApp = () => {
  return (
    <>
      <br />
      <div className="app-download-section mb-5 mb-lg-1 mt-lg-0 text-white mb-md-1 p-0">
        <div className="container-fluid">
          <div className="row d-flex flex-column-reverse flex-md-row align-items-center">
            <div className="col-12 col-md-7 d-flex flex-column align-items-center justify-content-center text-center px-3 py-5 mt-md-3 mb-md-3">
              <h1 className="fw-bolder text-uppercase get_text">
                Get In On The Action!
              </h1>
              <h5 className="text-center mb-3">
                Download our app now and enjoy the excitement of betting
                anytime, anywhere!
              </h5>
              <button className="text-uppercase btn-lg download_btn">
                Download Now
              </button>
            </div>

            <div className="col-12 col-md-5 text-center mb-3 mt-3">
              <img src={LogoImg} alt="App Logo" className="img-fluid"
               style={{ width: "300px", height: "300px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadApp;
