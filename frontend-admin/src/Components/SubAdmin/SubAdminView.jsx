import React, { useEffect, useState } from "react";
import { FaSearch, FaArrowLeft, FaTrashAlt, FaTimes } from "react-icons/fa";
import SingleCard from "../common/singleCard";
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
                    //   value={searchTerm}
                    //   onChange={handleSearchChange}
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
                        right: "20px",
                        transform: "translateY(-50%)",
                        color: "#6c757d",
                        cursor: "pointer",
                      }}
                    />
                  )}
                </div>
                <div className="col-md-6 text-end">
                  <label className="me-2 fw-bold">Show</label>
                  <select
                    className="form-select d-inline-block w-auto"
                    style={{
                      borderRadius: "50px",
                      border: "2px solid #3E5879",
                    }}
                    //   value={winBetTrackerDetails.totalEntries}
                    //   onChange={handleEntriesChange}
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
                <div className="table-responsive ">
                  <table
                    className="table table-striped table-hover text-center"
                    style={{
                      borderRadius: "50px",
                      border: "2px solid #3E5879",
                    }}
                  >
                    <thead className="table-primary text-uppercase">
                      <tr>
                        <th>Serial Number</th>
                        <th>User Name</th>
                        <th>Runner Name</th>
                        <th>Odds</th>
                        <th>Type</th>
                        <th>Stake</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {/* <tbody>
                    {winBetTrackerDetails.winBetTrackerDetails?.length > 0 ? (
                      winBetTrackerDetails.winBetTrackerDetails.map(
                        (winBetTracker, index) => {
                          return (
                            <tr key={index}>
                              <td>{startIndex + index}</td>
                              <td>{winBetTracker.userName}</td>
                              <td>{winBetTracker.runnerName}</td>
                              <td>{winBetTracker.rate}</td>
                              <td
                                className={`text-uppercase fw-bold ${
                                  winBetTracker.type === "back"
                                    ? "text-success"
                                    : "text-danger"
                                }`}
                              >
                                {winBetTracker.type}
                              </td>
                              <td>{winBetTracker.value}</td>
                              <td>
                                <button
                                  className="btn btn-danger"
                                  onClick={() =>
                                    handleBetDelete(winBetTracker.userId)
                                  }
                                >
                                  <FaTrashAlt />
                                </button>
                              </td>
                            </tr>
                          );
                        }
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-danger text-center fw-bold"
                        >
                          No Bets Found For This Market.
                        </td>
                      </tr>
                    )}
                  </tbody> */}
                  </table>
                </div>
              </SingleCard>
              {/* Pagination */}
              {/* <Pagination
              currentPage={winBetTrackerDetails.currentPage}
              totalPages={winBetTrackerDetails.totalPages}
              handlePageChange={handlePageChange}
              startIndex={startIndex}
              endIndex={endIndex}
              totalData={winBetTrackerDetails.totalData}
            /> */}
            </div>
          </div>
        </div>
      </div>
  );
};

export default SubAdminView;
