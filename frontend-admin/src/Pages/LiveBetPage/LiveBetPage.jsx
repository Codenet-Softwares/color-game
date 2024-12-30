import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaTimes } from "react-icons/fa";

const LiveBetPage = () => {
  return (
    <div className="container my-5 ">
      <div className="card shadow-sm">
        <div
          className="card-header"
          style={{
            backgroundColor: "#7D7D7D",
            color: "#FFFFFF",
          }}
        >
          <h3 className="mb-0 fw-bold fs-5">Live Bet</h3>
        </div>
        <div className="card-body">
          {/* Search and Entries Selection */}
          <div className="row mb-4">
            <div className="col-md-6 position-relative">
              <FaSearch
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "20px",
                  transform: "translateY(-50%)",
                  color: "#6c757d",
                  fontSize: "18px",
                }}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Search by game name or market name..."
                style={{
                  paddingLeft: "40px",
                  borderRadius: "30px",
                  border: "2px solid #6c757d",
                }}
              />

              <FaTimes
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "20px",
                  transform: "translateY(-50%)",
                  color: "#6c757d",
                  cursor: "pointer",
                }}
              />
            </div>

            <div className="col-md-6 text-end">
              <label className="me-2 fw-bold">Show</label>
              <select
                className="form-select rounded-pill d-inline-block w-auto"
                style={{
                  borderRadius: "50px",
                  border: "2px solid #6c757d",
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <label className="ms-2 fw-bold">Entries</label>
            </div>
          </div>

          {/* Table */}
          <div
            className=" mb-5 text-center"
            style={{
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 1)",
            }}
          >
            <div className="table-responsive">
              <table
                className="table table-striped table-hover rounded-table"
                style={{
                  border: "2px solid #6c757d",
                  borderRadius: "10px",
                }}
              >
                <thead
                  className="table-primary"
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <tr>
                    <th style={{ width: "25%" }}>Serial Number</th>
                    <th style={{ width: "20%" }}>Game Name</th>
                    <th style={{ width: "20%" }}>Market Name</th>
                    <th style={{ width: "35%" }}>Action</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveBetPage;
