import React from "react";

const OpenBetsOffCanvas = () => {
  return (
    <div
      className="offcanvas offcanvas-top"
      tabIndex="-1"
      id="offcanvasTop"
      aria-labelledby="offcanvasTopLabel"
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
      <div className="offcanvas-body">...</div>
    </div>
  );
};

export default OpenBetsOffCanvas;
