import React, { useEffect, useState } from "react";
import { FaSearch, FaArrowLeft, FaTrashAlt, FaTimes } from "react-icons/fa";
import { useAuth } from "../Utils/Auth";
import { useNavigate, useParams } from "react-router-dom";
import SingleCard from "./common/singleCard";
import { toast } from "react-toastify";
import { customErrorHandler } from "../Utils/helper";
import GameService from "../Services/GameService";
import Pagination from "./Pagination";
import ReusableTable from "./ReusableTable/ReusableTable";
const BetWinTracker = () => {
  const { marketId } = useParams();

  const auth = useAuth();
  const navigate = useNavigate();
  const [marketName, setMarketName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [winBetTrackerDetails, setWinBetTrackerDetails] = useState({
    winBetTrackerDetails: [],
    currentPage: 1,
    totalPages: 1,
    totalEntries: 10,
    name: "",
    totalData: 0,
  });
  const [selectedUserId, setSelectedUserId] = useState(""); // State to store selected user ID
  const [selectedUserBets, setSelectedUserBets] = useState(null); // Store selected user's bets
  const [showReusableTable, setShowReusableTable] = useState(false); // State to toggle ReusableTable view
  const [selectedUsername, setSelectedUsername] = useState(""); // State to store selected username
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchWinBetTracker = () => {
    GameService.getWinBetTracker(
      auth.user,
      marketId,
      winBetTrackerDetails.currentPage,
      winBetTrackerDetails.totalEntries,
      debouncedSearchTerm
    )
      .then((res) => {
        if (res.data?.data?.length > 0) {
          setMarketName(res.data.data[0].marketName);
        }
        setWinBetTrackerDetails((prev) => ({
          ...prev,
          winBetTrackerDetails: res.data?.data || [],
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

  useEffect(() => {
    fetchWinBetTracker();
  }, [
    marketId,
    winBetTrackerDetails.currentPage,
    winBetTrackerDetails.totalEntries,
    debouncedSearchTerm,
  ]);

  const handleBetDelete = async (marketId, userId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this market and bet?"
    );
    if (!isConfirmed) return;

    auth.showLoader();

    try {
      const response = await GameService.AfterWinDeleteBet(auth.user, {
        userId: userId,
        marketId: marketId,
      });


      if (response.status === 200) {
        toast.success("Market and bet deleted successfully!");
        fetchWinBetTracker();
      } else {
        toast.error("Failed to delete the bet. Please try again.");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(customErrorHandler(error));
    } finally {
      auth.hideLoader();
    }
  };

  let startIndex = Math.min(
    (Number(winBetTrackerDetails.currentPage) - 1) *
      Number(winBetTrackerDetails.totalEntries) +
      1,
    Number(winBetTrackerDetails.totalData)
  );
  let endIndex = Math.min(
    Number(winBetTrackerDetails.currentPage) *
      Number(winBetTrackerDetails.totalEntries),
    Number(winBetTrackerDetails.totalData)
  );
  const handlePageChange = (pageNumber) => {
    setWinBetTrackerDetails((prev) => ({ ...prev, currentPage: pageNumber }));
  };
  const handlePageNavigation = () => {
    navigate("/winTracker");
  };
  const handleEntriesChange = (e) => {
    setWinBetTrackerDetails((prev) => ({
      ...prev,
      totalEntries: parseInt(e.target.value, 10),
      currentPage: 1,
    }));
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setWinBetTrackerDetails((prev) => ({
      ...prev,
      search: value,
      currentPage: 1,
    }));
  };
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleShowAllBets = (username, userId) => {
    // Set the selected user ID (to be implemented once the api is provided)
    setSelectedUserId(userId);
    setSelectedUsername(username); // Set the selected username
    setShowReusableTable(true); // Show ReusableTable
  };

  const handleBackToLiveBets = () => {
    setShowReusableTable(false); // Hide ReusableTable
    setSelectedUserBets(null); // Clear selected user bets
    setSelectedUsername(""); // Clear selected username
  };

  // Function to fetch user-specific bets for ReusableTable
  const fetchUserSpecificBets = async (page, pageSize) => {
    try {
      const response = await GameService.getWinBetTrackerList(
        auth.user,
        marketId,
        selectedUserId, // Use selectedUserId instead of selectedUsername
        page,
        pageSize
      );
      return response.data; // Return the API response
    } catch (error) {
      toast.error(customErrorHandler(error));
      return { data: [], pagination: { totalPages: 1, totalItems: 0 } }; // Return empty data on error
    }
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
          onClick={() => handleBetDelete(row.marketId, row.userId)}
        >
          <FaTrashAlt />
        </button>
      ),
    },
  ];
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
              onClick={handlePageNavigation}
            >
              <FaArrowLeft />
            </div>
            <h3
              className="mb-0 fw-bold text-uppercase"
              style={{ flexGrow: 1, textAlign: "center" }}
            >
              {showReusableTable
                ? `User Bets - ${selectedUsername}` // Dynamic heading with username
                : ` Win Bet History For  - ${marketName}`}
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
                  columns={columns}
                  itemsPerPage={winBetTrackerDetails.totalEntries}
                  showSearch={false}
                  paginationVisible={true}
                  fetchData={fetchUserSpecificBets} // Pass the fetch function
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
                      placeholder="Search By Username..."
                      value={searchTerm}
                      onChange={handleSearchChange}
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
                      className="form-select d-inline-block w-auto"
                      style={{
                        borderRadius: "50px",
                        border: "2px solid #3E5879",
                      }}
                      value={winBetTrackerDetails.totalEntries}
                      onChange={handleEntriesChange}
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
                          {/* <th>Total Bets</th> */}
                          {/* <th>Total Amount</th> */}
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {winBetTrackerDetails.winBetTrackerDetails?.length >
                        0 ? (
                          winBetTrackerDetails.winBetTrackerDetails.map(
                            (winBetTracker, index) => {
                              return (
                                <tr key={index}>
                                  <td>{startIndex + index}</td>
                                  <td>{winBetTracker.userName}</td>

                                  <td>
                                    <button
                                      className="btn btn-primary text-uppercase fw-bold text-white"
                                      onClick={() =>
                                        handleShowAllBets(
                                          winBetTracker.userName,
                                          winBetTracker.userId
                                        )
                                      }
                                    >
                                      show all bets
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
                      </tbody>
                    </table>
                  </div>
                </SingleCard>
                {/* Pagination */}
                {winBetTrackerDetails.winBetTrackerDetails?.length > 0 && (
                  <Pagination
                    currentPage={winBetTrackerDetails.currentPage}
                    totalPages={winBetTrackerDetails.totalPages}
                    handlePageChange={handlePageChange}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    totalData={winBetTrackerDetails.totalData}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetWinTracker;
