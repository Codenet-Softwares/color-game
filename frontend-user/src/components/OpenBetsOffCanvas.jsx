import React from "react";
import OpenBets from "../betHistory/components/openBets/OpenBets";

const OpenBetsOffCanvas = ({ openBetData, handleOpenBetsSelectionMenu }) => {
  return (
    <div
      className="offcanvas offcanvas-top d-md-none"
      tabIndex="-1"
      id="offcanvasTop"
      aria-labelledby="offcanvasTopLabel"
      style={{ height: "80vh" }}
    >
      <div
        className="offcanvas-header text-light text-uppercase"
        style={{ background: "#176577" }}
      >
        <h5 id="offcanvasTopLabel">Open Bets</h5>
        <button
          type="button"
          className="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        <OpenBets
          betHistoryData={openBetData}
          handleBetHistorySelectionMenu={handleOpenBetsSelectionMenu}
        />
      </div>
    </div>
  );
};

export default OpenBetsOffCanvas;
