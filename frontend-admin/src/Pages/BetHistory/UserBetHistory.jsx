import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import SingleCard from "../../Components/common/singleCard";
import GameService from "../../Services/GameService";
import { useAuth } from "../../Utils/Auth";
import { toast } from "react-toastify";
import Pagination from "../../Components/Pagination";
import { customErrorHandler } from "../../Utils/helper";
import ReusableTable from "../../Components/ReusableTable/ReusableTable";

const UserBetHistory = () => {
  const { marketId } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [marketName, setMarketName] = useState(""); // State for market name
  const [betAfterWin, setBetAfterWin] = useState({
    winBetHistory: [],
    currentPage: 1,
    totalPages: 1,
    totalEntries: 10,
    search: "",
    totalData: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
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

  useEffect(() => {
    auth.showLoader();
    if (marketId) fetchWinBetHistory();
  }, [
    marketId,
    betAfterWin.currentPage,
    betAfterWin.totalEntries,
    debouncedSearchTerm,
  ]);

  const fetchWinBetHistory = async () => {
    try {
      const response = await GameService.winBetHistory(
        auth.user,
        marketId,
        betAfterWin.currentPage,
        betAfterWin.totalEntries,
        debouncedSearchTerm
      );

      setBetAfterWin((prev) => ({
        ...prev,
        winBetHistory: response?.data?.data || [],
        totalPages: response?.data?.pagination?.totalPages || 1,
        totalData: response?.data?.pagination?.totalItems || 0,
      }));
      
      setMarketName(response?.data?.data?.marketName || "Unknown Market");
    } catch (error) {
      toast.error(customErrorHandler(error));
    } finally {
      auth.hideLoader();
    }
  };

   // Function to fetch user-specific bets for ReusableTable
    const fetchUserSpecificBets = async (page, pageSize) => {
      try {
        const response = await GameService.userLiveBetGameListhistory(
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

  const handleShowAllBets = (userId, username) => {
    setSelectedUserId(userId); // Set the selected user ID
    setSelectedUsername(username); // Set the selected username
    setShowReusableTable(true); // Show ReusableTable
  };

  const handleBackToLiveBets = () => {
    setShowReusableTable(false); // Hide ReusableTable
    setSelectedUserId(""); // Clear selected user ID
    setSelectedUsername(""); // Clear selected username
  };
  const handlePageChange = (pageNumber) => {
    setBetAfterWin((prev) => ({ ...prev, currentPage: pageNumber }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update the search term
    setBetAfterWin((prev) => ({ ...prev, currentPage: 1 })); // Reset pagination
  };

  const handleEntriesChange = (e) => {
    setBetAfterWin((prev) => ({
      ...prev,
      totalEntries: parseInt(e.target.value, 10),
      currentPage: 1,
    }));
  };

  const startIndex = Math.min(
    (betAfterWin.currentPage - 1) * betAfterWin.totalEntries + 1,
    betAfterWin.totalData
  );

  const endIndex = Math.min(
    betAfterWin.currentPage * betAfterWin.totalEntries,
    betAfterWin.totalData
  );
  const handleNavigation = () => {
    navigate("/get-bet-markets-afterWin");
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
                : ` Bets History For - ${marketName}`}
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
                  <FaArrowLeft /> Back to Bets History - {marketName}
                </button>

                {/* Reusable Table */}
                <ReusableTable
                  columns={columns}
                  itemsPerPage={10}
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
                      value={searchTerm} // Bind to searchTerm
                      onChange={handleSearchChange}
                      style={{
                        paddingLeft: "40px",
                        borderRadius: "30px",
                        border: "2px solid #3E5879",
                      }}
                    />
                  </div>
                  <div className="col-md-6 text-end">
                    <label className="me-2 fw-bold">Show</label>
                    <select
                      className="form-select d-inline-block w-auto"
                      style={{
                        borderRadius: "50px",
                        border: "2px solid #3E5879",
                      }}
                      value={betAfterWin.totalEntries}
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
                          <th>Total Bets</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {betAfterWin.winBetHistory.data?.length > 0 ? (
                          betAfterWin.winBetHistory.data?.map(
                            (winBet, index) => {
                              return (
                                <tr key={index}>
                                  <td>{startIndex + index}</td>
                                  <td>{winBet.userName}</td>
                                  <td>{winBet.totalBets}</td>
                                  <td>
                                    <button
                                      className="btn btn-primary text-uppercase fw-bold text-white"
                                      onClick={() =>
                                        handleShowAllBets(
                                          winBet.userId,
                                          winBet.userName
                                        
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
                <Pagination
                  currentPage={betAfterWin.currentPage}
                  totalPages={betAfterWin.totalPages}
                  handlePageChange={handlePageChange}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalData={betAfterWin.totalData}
                />
                
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBetHistory;
