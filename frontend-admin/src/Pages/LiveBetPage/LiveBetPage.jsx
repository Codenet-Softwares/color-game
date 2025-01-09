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

const LiveBetPage = () => {
  const auth = useAuth();
  const [liveBets, setLiveBets] = useState({
    liveBets: [],
    currentPage: 1,
    totalPages: 1,
    totalEntries: 10,
    name: "",
    totalData: 0,
  });
  useEffect(() => {
    fetchLiveBets();
  }, [liveBets.currentPage, liveBets.totalEntries, liveBets.name]);

  const fetchLiveBets = () => {
    GameService.liveBetGame(
      auth.user,
      liveBets.currentPage,
      liveBets.totalEntries,
      liveBets.name
    )
      .then((res) => {
        setLiveBets((prev) => ({
          ...prev,
          liveBets: res.data?.data || [],
          totalPages: res?.data.pagination?.totalPages,
          totalData: res?.data.pagination?.totalItems,
        }));
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
      });
  };
  const handleClearSearch = () => {
    setLiveBets({ ...liveBets, name: "" });
  };
  const handlePageChange = (pageNumber) => {
    setLiveBets({ ...liveBets, currentPage: pageNumber });
  };
  let startIndex = Math.min(
    (Number(liveBets.currentPage) - 1) * Number(liveBets.totalEntries) + 1
  );
  let endIndex = Math.min(
    Number(liveBets.currentPage) * Number(liveBets.totalEntries),
    Number(liveBets.totalData)
  );
  const navigate = useNavigate();

  const handleNavigate = (marketId) => {
    navigate(`/live_UserBet/${marketId}`);
  };

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
          <h3 className="mb-0 fw-bold text-center">Live Bet</h3>
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
                value={liveBets.name}
                onChange={(e) =>
                  setLiveBets({ ...liveBets, name: e.target.value })
                }
                style={{
                  paddingLeft: "40px",
                  borderRadius: "30px",
                  border: "2px solid #6c757d",
                }}
              />
              {liveBets.name && (
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
                value={liveBets.totalEntries}
                style={{
                  borderRadius: "50px",
                  border: "2px solid #6c757d",
                }}
                onChange={(e) =>
                  setLiveBets((prev) => ({
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
                    <th>User Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {liveBets.liveBets.map((bet, index) => (
                    <tr key={bet.gameId}>
                      <td>{index + 1}</td>
                      <td>{bet.gameName}</td>
                      <td>{bet.marketName}</td>
                      <td>{bet.userName}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleNavigate(bet.marketId)}
                        >
                          Live Game
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SingleCard>
          <Pagination
            currentPage={liveBets.currentPage}
            totalPages={liveBets.totalPages}
            handlePageChange={handlePageChange}
            startIndex={startIndex}
            endIndex={endIndex}
            totalData={liveBets.totalData}
          />
        </div>
      </div>
    </div>
  );
};

export default LiveBetPage;
