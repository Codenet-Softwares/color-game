import React, { useEffect, useState } from "react";
import { FaSearch, FaArrowLeft, FaTrashAlt, FaTimes } from "react-icons/fa";
import SingleCard from "../common/singleCard";
import Pagination from "../Pagination";
const SubAdminView = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
              Sub-Admin History
            </h3>
          </div>

          <div className="card-body">
            {/* Search and Entries Selection */}
            <div className="row mb-4">
              <div className="col-md-6 position-relative">
                <div className="d-flex align-items-center">
                  <FaSearch
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "20px",
                      transform: "translateY(-50%)",
                      color: "#3E5879",
                      fontSize: "18px",
                    }}
                  />
                  <input
                    type="text"
                    className="form-control fw-bold"
                    placeholder="Search By User Or Market Name..."
                    // value={searchTerm}
                    // onChange={handleSearchChange}
                    style={{
                      paddingLeft: "40px",
                      borderRadius: "30px",
                      border: "2px solid #3E5879",
                    }}
                  />
                  {searchTerm && (
                    <FaTimes
                      // onClick={handleClearSearch}
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "80px",
                        transform: "translateY(-50%)",
                        color: "#6c757d",
                        cursor: "pointer",
                      }}
                    />
                  )}
                  {/* Dropdown beside search bar */}
                  <select
                    className="form-select ms-2"
                    style={{
                      width: "150px",
                      borderRadius: "30px",
                      border: "2px solid #3E5879",
                    }}
                    // value={filterOption}
                    // onChange={handleFilterChange}
                  >
                    <option value="">Select Status</option>
                    <option value="user">Approve</option>
                    <option value="market">Reject</option>
                    <option value="market">Pending</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6 text-end">
                <label className="me-2 fw-bold">Show</label>
                <select
                  className="form-select d-inline-block w-auto"
                  style={{
                    borderRadius: "50px",
                    border: "2px solid #3E5879",
                  }}
                  // value={winBetTrackerDetails.totalEntries}
                  // onChange={handleEntriesChange}
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
            <SingleCard
              className="mb-5 text-center"
              style={{
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 1)",
              }}
            >
              <div className="table-responsive">
                <table
                  className="table table-striped table-hover text-center"
                  style={{
                    borderRadius: "50px",
                    border: "2px solid #3E5879",
                  }}
                >
                  <thead className="table-primary text-uppercase">
                    <tr>
                      <th>Market Name</th>
                      <th>Status</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </SingleCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubAdminView;
