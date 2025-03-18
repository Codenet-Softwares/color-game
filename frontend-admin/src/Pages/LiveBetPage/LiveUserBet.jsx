import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaTimes, FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import SingleCard from "../../Components/common/singleCard";
import GameService from "../../Services/GameService";
import { useAuth } from "../../Utils/Auth";
import { toast } from "react-toastify";
import Pagination from "../../Components/Pagination";
import { customErrorHandler } from "../../Utils/helper";
import ReusableTable from "../../Components/ReusableTable/ReusableTable";

const LiveUserBet = () => {
  const { marketId } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [marketName, setMarketName] = useState(""); // State for market name
  const [userBets, setUserBets] = useState({
    bets: [],
    currentPage: 1,
    totalPages: 1,
    totalEntries: 10,
    search: "",
    totalData: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedUserBets, setSelectedUserBets] = useState(null); // Store selected user's bets
  const [showReusableTable, setShowReusableTable] = useState(false); // State to toggle ReusableTable view
  const [selectedUsername, setSelectedUsername] = useState(""); // State to store selected username

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (marketId) fetchLiveUserBet();
  }, [
    marketId,
    userBets.currentPage,
    userBets.totalEntries,
    debouncedSearchTerm,
  ]);

  const fetchLiveUserBet = async () => {
    auth.showLoader();
    try {
      const response = await GameService.userLiveBetGame(
        auth.user,
        marketId,
        userBets.currentPage,
        userBets.totalEntries,
        debouncedSearchTerm
      );
      const bets = response.data?.data || [];

      setUserBets((prev) => ({
        ...prev,
        bets: response.data?.data || [],
        totalPages: response?.data.pagination?.totalPages || 1,
        totalData: response?.data.pagination?.totalItems || 0,
      }));
      if (bets.length > 0) {
        setMarketName(bets[0].marketName || "Unknown Market");
      } else {
        setMarketName("Unknown Market");
      }
    } catch (error) {
      toast.error(customErrorHandler(error));
    } finally {
      auth.hideLoader();
    }
  };

  const handleDelete = async (marketId, runnerId, userId, betId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this market and bet?"
    );

    if (!isConfirmed) {
      return;
    }
    auth.showLoader();

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
        fetchLiveUserBet();
      }
    } catch (error) {
      toast.error(customErrorHandler(error));
    } finally {
      auth.hideLoader();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setUserBets({ ...userBets, name: "" });
  };

  const handlePageChange = (pageNumber) => {
    setUserBets((prev) => ({ ...prev, currentPage: pageNumber }));
  };

  const handleNavigation = () => {
    navigate("/liveBet");
  };

  const startIndex = Math.min(
    (userBets.currentPage - 1) * userBets.totalEntries + 1,
    userBets.totalData
  );
  const endIndex = Math.min(
    userBets.currentPage * userBets.totalEntries,
    userBets.totalData
  );

  const handleShowAllBets = (username) => {
    const userSpecificBets = userBets.bets.filter(
      (bet) => bet.userName === username
    );
    setSelectedUserBets(userSpecificBets);
    setSelectedUsername(username); // Set the selected username
    setShowReusableTable(true); // Show ReusableTable
  };

  const handleBackToLiveBets = () => {
    setShowReusableTable(false); // Hide ReusableTable
    setSelectedUserBets(null); // Clear selected user bets
    setSelectedUsername(""); // Clear selected username
  };

  const columns = [
    {
      key: "serialNumber",
      label: "Serial Number",
      render: (row, index) => startIndex + index, // Dynamically calculate serial number
    },
    { key: "runnerName", label: "Runner Name" },
    { key: "rate", label: "Odds" },
    { key: "type", label: "Type" },
    { key: "value", label: "Stake" },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <button
          className="btn btn-danger"
          onClick={() =>
            handleDelete(row.marketId, row.runnerId, row.userId, row.betId)
          }
        >
          <FaTrashAlt />
        </button>
      ),
    },
  ];

  return (
    <div className="container my-5 p-5">
      <div className="card shadow-lg" style={{ background: "#E1D1C7" }}>
        <div
          className="card-header  text-white"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#3E5879",
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
            {showReusableTable
              ? `User Bets - ${selectedUsername}` // Dynamic heading with username
              : `Live Bets For - ${marketName}`}
          </h3>
        </div>

        <div className="card-body">
          {showReusableTable ? (
            <>
              {/* Back Button */}
              <button
                className="btn btn-secondary mb-3"
                onClick={handleBackToLiveBets}
              >
                <FaArrowLeft /> Back to Live Bets - {marketName}
              </button>

              {/* Reusable Table */}
              <ReusableTable
                data={selectedUserBets}
                columns={columns}
                itemsPerPage={userBets.totalEntries}
                showSearch={false}
                paginationVisible={false}
              />
            </>
          ) : (
            <>
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
                    placeholder="Search By User Name..."
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
                      className="position-absolute top-50 end-3 translate-middle-y text-muted cursor-pointer"
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
                    className="form-select d-inline-block w-auto"
                    value={userBets.totalEntries}
                    style={{
                      borderRadius: "50px",
                      border: "2px solid #3E5879",
                    }}
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
              <SingleCard
                className=" mb-5 text-center"
                style={{
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 1)",
                }}
              >
                <div className="table-responsive">
                  <table
                    className="table table-striped table-hover text-center"
                    style={{ border: "2px solid #3E5879" }}
                  >
                    <thead className="text-uppercase table-primary">
                      <tr>
                        <th>Serial Number</th>
                        <th>User Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userBets.bets.length > 0 ? (
                        userBets.bets.map((bet, index) => (
                          <tr key={index}>
                            <td>{startIndex + index}</td>
                            <td>{bet.userName}</td>
                            <td>
                              <button
                                className="btn btn-info text-uppercase fw-bold text-white"
                                onClick={() => handleShowAllBets(bet.userName)}
                              >
                                show all bets
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="text-danger text-center fw-bold"
                          >
                            No Bets Found For This Market.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </SingleCard>

              {/* Pagination */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveUserBet;
