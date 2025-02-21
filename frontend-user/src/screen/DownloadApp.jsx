import React from "react";
import HandImg from "../asset/best_betting_image-removeBg-preview.png";
import LogoImg from "../asset/Logo.png";

const DownloadApp = () => {
  return (
    <>
      <br />
      <div
        className="app-download-section mx-2 mb-2"
        style={{
          backgroundImage: `linear-gradient(to bottom, #045662, #1FA5C3, #094359)`,
          backgroundRepeat: "no-repeat",
          color: "white",
          borderRadius: "20px",
        }}
      >
        <div className="container-fluid">
          <div className="row d-flex flex-column-reverse flex-md-row align-items-center">
            <div className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center text-center px-3 py-2">
              <h1
                className="fw-bolder text-uppercase"
                style={{
                  color: "#e0dfdc",
                  fontSize: "clamp(30px, 6vw, 55px)",
                  textShadow: "-3px -3px 3px #111111, 4px 4px 1px #363636",
                }}
              >
                Get In On  The Action!
              </h1>
              <h5 className="text-center mb-3">
                Download our app now and enjoy the excitement of betting
                anytime, anywhere!
              </h5>
              <button
                className="btn text-uppercase btn-lg"
                style={{
                  background:
                    "linear-gradient(45deg, rgb(220, 220, 220), rgb(150, 220, 240), rgba(180, 255, 255, 0.5))",
                  border: "3px solid #075E6C",
                  color: "#005870",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  padding: "12px 28px",
                  cursor: "pointer",
                  borderRadius: "40px",
                  boxShadow:
                    "0 8px 16px rgba(0, 128, 148, 0.4), 0 0 15px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6)",
                  textShadow:
                    "1px 1px 3px rgba(0, 128, 148, 0.8), 0 0 5px rgba(255, 255, 255, 0.6)",
                  transition: "background 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                Download Now
              </button>
            </div>

            <div className="col-12 col-md-6 text-center mb-3">
              <img src={LogoImg} alt="App Logo" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadApp;
