import React from "react";
import HandImg from "../asset/best_betting_image-removeBg-preview.png";
import LogoImg from "../asset/Logo.png";

const DownloadApp = () => {
  return (
    <>
      <br />
      <div
        className="app-download-section m-2"
        style={{
          backgroundImage: `linear-gradient(to bottom, #045662, #1FA5C3, #094359)`,
          backgroundRepeat: "no-repeat",
          color: "white",
          borderRadius:"20px"
          // paddingTop: "50px",
          // paddingBottom: "50px",
        }}
      >
        <div className="container-fluid">
          <div className="row ">
            {/* Hand Logo Column */}
            

            {/* App Logo Column */}
            <div className="col-md-6">
              <img
                src={LogoImg}
                alt="App Logo"
                style={{
                }}
              />
            </div>

            {/* Text Content Column */}
            <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
              <h1
                className="fw-bolder"
                style={{
                  color: "#e0dfdc",
                  fontSize: "65px",
                  textShadow: "-3px -3px 3px #111111, 4px 4px 1px #363636",
                }}
              >
                Get In On The Action!
              </h1>
              <h5 className="text-center" style={{ marginBottom: "30px" }}>
                Download our app now and enjoy the excitement of betting
                anytime, anywhere!
              </h5>
              <button
                className="btn text-uppercase"
                style={{
                  background: "linear-gradient(45deg, rgb(220, 220, 220), rgb(150, 220, 240), rgba(180, 255, 255, 0.5))",
                  border: "3px solid #075E6C",
                  color: "#005870",
                  fontSize: "1.4rem",
                  fontWeight: "600",
                  padding: "12px 28px",
                  cursor: "pointer",
                  borderRadius: "40px",
                  boxShadow: "0 8px 16px rgba(0, 128, 148, 0.4), 0 0 15px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6)",
                  textShadow: "1px 1px 3px rgba(0, 128, 148, 0.8), 0 0 5px rgba(255, 255, 255, 0.6)",
                  transition: "background 0.3s ease, box-shadow 0.3s ease",
                }}
                
                
                
              >
                Download Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadApp;
