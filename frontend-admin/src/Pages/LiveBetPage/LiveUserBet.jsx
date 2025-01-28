import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaTimes, FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import GameService from "../../Services/GameService";
import { useAuth } from "../../Utils/Auth";
import { toast } from "react-toastify";
import Pagination from "../../Components/Pagination";
import { customErrorHandler } from "../../Utils/helper";

const LiveUserBet = () => {
  const { marketId } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [userBets, setUserBets] = useState({
    bets: [],
    currentPage: 1,
    totalPages: 1,
    totalEntries: 10,
    search: "",
    totalData: 0,
    marketName: "",
  });

  console.log("userBets", userBets);
  useEffect(() => {
    if (marketId) fetchLiveUserBet();
  }, [marketId, userBets.currentPage, userBets.totalEntries, userBets.search]);

  const fetchLiveUserBet = async () => {
    try {
      const response = await GameService.userLiveBetGame(
        auth.user,
        marketId,
        userBets.currentPage,
        userBets.totalEntries,
        userBets.search
      );
      const bets = response.data?.data || [];
      const marketName = bets.length > 0 ? bets[0].marketName : "Unknown Market";
      setUserBets((prev) => ({
        ...prev,
        bets: response.data?.data || [],
        totalPages: response?.data.pagination?.totalPages || 1,
        totalData: response?.data.pagination?.totalItems || 0,
        marketName,
      }));
    } catch (error) {
      toast.error(customErrorHandler(error));
    }
  };

  const handleDelete = async (marketId, runnerId, userId, betId) => {
    auth.showLoader();
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this market and bet?"
    );
  
    if (!isConfirmed) {
      return;
    }
  
    try {
      const response = await GameService.DeleteMarket(
        auth.user,
        userId,
        marketId,
        runnerId,
        betId
      );
  
      if (response.status === 200) {
        toast.success("Market and bet deleted successfully!");
        setUserBets((prev) => ({
          ...prev,
          bets: prev.bets.filter((bet) => bet.betId !== betId),
          totalData: prev.totalData - 1,
        }));
      }
    } catch (error) {
      toast.error(customErrorHandler(error));
    } finally {
      auth.hideLoader();
    }
  };
  

  const handleClearSearch = () => {
    setUserBets((prev) => ({ ...prev, search: "" }));
  };

  const handlePageChange = (pageNumber) => {
    setUserBets((prev) => ({ ...prev, currentPage: pageNumber }));
  };

  // const handleNavigate = (betId) => {
  //   navigate(`/bet_details/${betId}`);
  // };

  const startIndex = Math.min(
    (userBets.currentPage - 1) * userBets.totalEntries + 1,
    userBets.totalData
  );
  const endIndex = Math.min(
    userBets.currentPage * userBets.totalEntries,
    userBets.totalData
  );

  const handleNavigation = () => {
    navigate("/liveBet");
  };

  return (
    <div className="container my-5 p-5">
      <div className="card shadow-lg" style={{ background: "#E1D1C7" }}>
        <div
          className="card-header  text-white"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background:"#3E5879"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
              color: "#333",
              fontSize: "20px",
              cursor: "pointer",
            }}
            onClick={handleNavigation}
          >
            <FaArrowLeft />
          </div>
          <h3
            className="mb-0 fw-bold text-uppercase"
            style={{ flexGrow: 1, textAlign: "center" }}
          >
           Live Bets - {userBets.marketName}
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
                  color: "#6c757d",
                  fontSize: "18px",
                }}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Search by user or market name..."
                value={userBets.search}
                onChange={(e) =>
                  setUserBets((prev) => ({ ...prev, search: e.target.value }))
                }
                style={{
                  paddingLeft: "40px",
                  borderRadius: "30px",
                  border: "2px solid #6c757d",
                }}
              />
              {userBets.search && (
                <FaTimes
                  className="position-absolute top-50 end-3 translate-middle-y text-muted cursor-pointer"
                  onClick={handleClearSearch}
                />
              )}
            </div>
            <div className="col-md-6 text-end">
              <label className="me-2 fw-bold">Show</label>
              <select
                className="form-select d-inline-block w-auto"
                value={userBets.totalEntries}
                onChange={(e) =>
                  setUserBets((prev) => ({
                    ...prev,
                    totalEntries: parseInt(e.target.value, 10),
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
          <div className="table-responsive">
            <table className="table table-striped table-hover text-center">
              <thead>
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
              <tbody>
                {userBets.bets.length > 0 ? (
                  userBets.bets.map((bet, index) => (
                    <tr key={bet.id}>
                      <td>{startIndex + index}</td>
                      <td>{bet.userName}</td>
                      <td>{bet.runnerName}</td>
                      <td>{bet.rate}</td>
                      <td
                        className={`text-uppercase fw-bold ${
                          bet.type === "back" ? "text-success" : "text-danger"
                        }`}
                      >
                        {bet.type}
                      </td>
                      <td>
                        {Math.round(bet.value)}({Math.round(bet.bidAmount)})
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleDelete(
                              bet.marketId,
                              bet.runnerId,
                              bet.userId,
                              bet.betId
                            )
                          }
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No bets found for this market.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {userBets.bets.length > 0 && (
            <Pagination
              currentPage={userBets.currentPage}
              totalPages={userBets.totalPages}
              handlePageChange={handlePageChange}
              startIndex={startIndex}
              endIndex={endIndex}
              totalData={userBets.totalData}
            />
          )}
         
        </div>
      </div>
    </div>
  );
};

export default LiveUserBet;
