import React, { useEffect, useState } from "react";
import Pagination from "../Pagination";

const SubAdminWinResult = () => {
  return (
    <div>
      <div className="container my-5 p-5 ">
        <div className="card shadow-lg" style={{ background: "#E1D1C7" }}>
          <div
            className="card-header text-white"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#3E5879",
            }}
          >
            <h3
              className="mb-0 fw-bold text-uppercase"
              style={{ flexGrow: 1, textAlign: "center" }}
            >
              Sub-Admin Win Result
            </h3>
          </div>
          <div className="card-body"></div>
        </div>
      </div>
    </div>
  );
};

export default SubAdminWinResult;
