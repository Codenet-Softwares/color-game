import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaTimes, FaTrashAlt } from "react-icons/fa";
import SingleCard from "../../Components/common/singleCard";
import GameService from "../../Services/GameService";
import { useAuth } from "../../Utils/Auth";
import { toast } from "react-toastify";
import Pagination from "../../Components/Pagination";
import { customErrorHandler } from "../../Utils/helper";
import { useNavigate } from "react-router-dom";

const BetHistoryPage = () => {
  const auth = useAuth();
  const [betHistory, setBetHistory] = useState({
    betHistory: [],
    currentPage: 1,
    totalPages: 1,
    totalEntries: 10,
    name: "",
    totalData: 0,
  });

  useEffect(() => {
    fetchBetHistory();
  }, [betHistory.currentPage, betHistory.totalEntries, betHistory.name]);

  const fetchBetHistory = () => {
    GameService.betHistory(
      auth.user,
      betHistory.currentPage,
      betHistory.totalEntries,
      betHistory.name
    )
      .then((res) => {
        setBetHistory((prev) => ({
          ...prev,
          betHistory: res.data?.data || [],
          totalPages: res?.data.pagination?.totalPages,
          totalData: res?.data.pagination?.totalItems,
        }));
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
      });
  };
  const handleClearSearch = () => {
    setBetHistory((prev) => ({ ...prev, name: "" }));
  };
  const handlePageChange = (pageNumber) => {
    setBetHistory((prev) => ({ ...prev, currentPage: pageNumber }));
  };
  let startIndex = Math.min(
    (Number(betHistory.currentPage) - 1) * Number(betHistory.totalEntries) + 1
  );
  let endIndex = Math.min(
    Number(betHistory.currentPage) * Number(betHistory.totalEntries),
    Number(betHistory.totalData)
  );
  const navigate = useNavigate();

  const handleNavigate = (marketId) => {
    navigate(`/get-bets-afterWin/${marketId}`);
  };
  return (
    <div>
      <div className="container my-5 p-5">
        <div className="card shadow-sm">
          <div
            className="card-header"
            style={{
              backgroundColor: "#3E5879",
              color: "#FFFFFF",
            }}
          >
            <h3 className="mb-0 fw-bold text-center text-uppercase">Bet History</h3>
          </div>
          <div className="card-body" style={{background:"#E1D1C7",}}>
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
                  value={betHistory.name}
                  onChange={(e) =>
                    setBetHistory({ ...betHistory, name: e.target.value })
                  }
                  style={{
                    paddingLeft: "40px",
                    borderRadius: "30px",
                    border: "2px solid #6c757d",
                  }}
                />
                {betHistory.name && (
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
                  value={betHistory.totalEntries}
                  style={{
                    borderRadius: "50px",
                    border: "2px solid #6c757d",
                  }}
                  onChange={(e) =>
                    setBetHistory((prev) => ({
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
              className="mb-5 text-center"
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
                      <th>Serial Number</th>
                      <th>Game Name</th>
                      <th>Market Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {betHistory.betHistory.length > 0 ? (
                      <>
                        {betHistory.betHistory.map((bet, index) => (
                          <tr key={bet.gameId}>
                            <td>{index + 1}</td>
                            <td>{bet.gameName}</td>
                            <td>{bet.marketName}</td>
                            <td>
                              <button
                                className="btn btn-primary"
                                onClick={() => handleNavigate(bet.marketId)}
                              >
                                Bet History
                              </button>
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </SingleCard>

            {betHistory.betHistory.length > 0 && (
              <Pagination
                currentPage={betHistory.currentPage}
                totalPages={betHistory.totalPages}
                handlePageChange={handlePageChange}
                startIndex={startIndex}
                endIndex={endIndex}
                totalData={betHistory.totalData}
              />
            )}
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default BetHistoryPage;
