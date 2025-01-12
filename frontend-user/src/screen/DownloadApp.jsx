import React from "react";
import HandImg from "../asset/best_betting_image-removeBg-preview.png";
import LogoImg from "../asset/Logo.png";

const DownloadApp = () => {
  return (
    <>
      <br />
      <div
        className="app-download-section"
        style={{
          backgroundColor: "#080F1C",
          color: "white",
          paddingTop: "50px",
          paddingBottom: "50px",
        }}
      >
        <div className="container">
          <div className="row justify-content-center align-items-center">
          
            <div className="col-md-4 text-center mb-4 mb-md-0">
              <img
                src={HandImg}
                alt="Betting Logo"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  marginBottom: "20px",
                }}
              />
            </div>
          
            <div className="col-md-6 text-center">
              <img
                src={LogoImg}
                alt="App Logo"
                style={{
                  width: "100%",
                  maxWidth: "200px",
                  marginBottom: "30px",
                }}
              />
              <h2 style={{ color: "#FFD700", marginBottom: "20px" }}>
                Get in on the Action!
              </h2>
              <p style={{ marginBottom: "30px" }}>
                Download our app now and enjoy the excitement of betting
                anytime, anywhere!
              </p>
              <button className="btn btn-warning btn-lg">Download Now</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadApp;
