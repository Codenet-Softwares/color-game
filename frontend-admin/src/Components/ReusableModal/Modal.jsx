import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Modal = ({ show, handleClose, title, body, footerButtons = [] }) => {
  return (
    <div
      className={`modal-overlay ${show ? "d-block" : "d-none"}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "transparent",
        zIndex: 1040,
      }}
    >
      <div className={`modal ${show ? "d-block" : "d-none"}`} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header border-0" style={{ position: "relative" }}>
              <h5 className="modal-title w-100 text-center text-primary fw-bold" style={{ fontSize: "1.5rem" }}>
                {title}
              </h5>
              <button type="button" className="btn-close" style={{ position: "absolute", top: "10px", right: "10px" }} onClick={handleClose} aria-label="Close"></button>
            </div>
            <div className="modal-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px", padding: "20px" }}>
              {body}
            </div>
            {footerButtons.length > 0 && (
              <div className="modal-footer d-flex justify-content-center">
                {footerButtons.map((btn, index) => (
                  <button key={index} className={btn.className || "btn btn-secondary"} disabled={btn.disabled} onClick={btn.onClick}>
                    {btn.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
