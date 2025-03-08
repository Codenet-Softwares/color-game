import React, { useEffect, useState } from "react";
import { FaSearch, FaTimes, FaTrashAlt } from "react-icons/fa";
import SingleCard from "./common/singleCard";
import { useAuth } from "../Utils/Auth";
import { toast } from "react-toastify";
import { customErrorHandler } from "../Utils/helper";
import GameService from "../Services/GameService";
import { useNavigate } from "react-router-dom";
// import BetWinTracker from "./BetWinTracker";
import Pagination from "./Pagination";

const WinTracker = () => {
  const auth = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [winBetTracker, setWinBetTracker] = useState({
    winBetTracker: [],
    currentPage: 1,
    totalPages: 1,
    totalEntries: 10,
    name: "",
    totalData: 0,
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchBetTracker();
  }, [winBetTracker.currentPage, winBetTracker.totalEntries, debouncedSearchTerm]);
  const fetchBetTracker = () => {
    GameService.winBetTracker(
      auth.user,
      winBetTracker.currentPage,
      winBetTracker.totalEntries,
      debouncedSearchTerm

    )
      .then((res) => {
        setWinBetTracker((prev) => ({
          ...prev,
          winBetTracker: res.data?.data || [],
          totalPages: res?.data.pagination?.totalPages,
          totalData: res?.data.pagination?.totalItems,
        }));
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
      })
      .finally(() => {
        auth.hideLoader();
      });
  };
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handlePageChange = (pageNumber) => {
    setWinBetTracker((prev) => ({ ...prev, currentPage: pageNumber }));
  };
  let startIndex = Math.min(
    (Number(winBetTracker.currentPage) - 1) *
      Number(winBetTracker.totalEntries) +
      1,
    Number(winBetTracker.totalData)
  );
  let endIndex = Math.min(
    Number(winBetTracker.currentPage) * Number(winBetTracker.totalEntries),
    Number(winBetTracker.totalData)
  );

  const navigate = useNavigate();
  const handleNavigate = (marketId) => {
    navigate(`/getDetails-winning-data/${marketId}`);
  };

  return (
    <div className="container my-5 p-5">
      <div className="card shadow-lg">
        <div
          className="card-header"
          style={{
            backgroundColor: "#3E5879",
            color: "#FFFFFF",
          }}
        >
          <h3 className="mb-0 fw-bold text-center text-uppercase">
            Win Bet Tracker
          </h3>
        </div>
        <div className="card-body" style={{ background: "#E1D1C7" }}>
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
                          className="form-control fw-bold"
                          placeholder="Search By Market Name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
          
                          style={{
                            paddingLeft: "40px",
                            borderRadius: "30px",
                            border: "2px solid #3E5879",
                          }}
                        />
                        {searchTerm && (
                          <FaTimes
                            onClick={handleClearSearch}
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
                className="form-select rounded-pill d-inline-block w-auto"
                value={winBetTracker.totalEntries}
                style={{
                  borderRadius: "50px",
                  border: "2px solid #3E5879",
                }}
                onChange={(e) =>
                  setWinBetTracker((prev) => ({
                    ...prev,
                    totalEntries: parseInt(e.target.value),
                  }))
                }
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
            className=" mb-5 text-center"
            style={{
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 1)",
            }}
          >
            <div className="table-responsive">
              <table
                className="table table-striped table-hover rounded-table"
                style={{
                  border: "2px solid #3E5879",
                  borderRadius: "10px",
                }}
              >
                <thead
                  className="table-primary text-uppercase"
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <tr>
                    <th>Serial Number</th>
                    <th>Game Name</th>
                    <th>Market Name</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {winBetTracker.winBetTracker.length > 0 ? (
                    <>
                      {winBetTracker.winBetTracker.map((betTracker, index) => (
                        <tr key={index}>
                          <td>{startIndex + index}</td>
                          <td>{betTracker.gameName}</td>
                          <td>{betTracker.marketName}</td>
                          <td>
                            <button
                              className="btn btn-primary text-center"
                              onClick={() =>
                                handleNavigate(betTracker.marketId)
                              }
                            >
                              Bet History
                            </button>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center text-danger fw-bold"
                      >
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SingleCard>
          {winBetTracker.winBetTracker.length > 0 && (
            <Pagination
              currentPage={winBetTracker.currentPage}
              totalPages={winBetTracker.totalPages}
              handlePageChange={handlePageChange}
              startIndex={startIndex}
              endIndex={endIndex}
              totalData={winBetTracker.totalData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WinTracker;
