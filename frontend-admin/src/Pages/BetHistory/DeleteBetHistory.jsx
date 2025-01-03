import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {FaTrashAlt} from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../Utils/Auth";
import GameService from "../../Services/GameService";
import Pagination from "../../Components/Pagination";
const DeleteBetHistory = () => {
  const auth = useAuth();
  const [selectedOption, setSelectedOption] = useState("");
  const [marketHistory, setMarketHistory] = useState({
    markets: [],
    currentPage: 1,
    totalPages: 1,
    totalEntries: 10,
    search: "",
    totalData: 0,
  });

  const fetchMarketHistory = async () => {
    try {
      const response = await GameService.trashLiveBetHistory(
        auth.user,
        marketHistory.currentPage,
        marketHistory.totalEntries,
        marketHistory.search
      );

      setMarketHistory((prev) => ({
        ...prev,
        markets: response.data?.data || [],
        totalPages: response.data?.pagination?.totalPages || 1,
        totalData: response.data?.pagination?.totalItems || 0,
      }));
    } catch (error) {
      toast.error("Failed to fetch market history");
    }
  };


  useEffect(() => {
    fetchMarketHistory();
  }, [marketHistory.currentPage, marketHistory.totalEntries, marketHistory.search]);
  const handleDropdownChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleButtonClick = () => {
    fetchMarketHistory();
  };

  const handlePageChange = (pageNumber) => {
    setMarketHistory((prev) => ({ ...prev, currentPage: pageNumber }));
  };

  // const handleSearchChange = (e) => {
  //   setMarketHistory((prev) => ({ ...prev, search: e.target.value }));
  // };

  const startIndex = Math.min(
    (marketHistory.currentPage - 1) * marketHistory.totalEntries + 1,
    marketHistory.totalData
  );
  const endIndex = Math.min(
    marketHistory.currentPage * marketHistory.totalEntries,
    marketHistory.totalData
  );

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-3 mb-5 rounded" style={{ background: "#95D9E8" }}>
        <h1 className="text-center mb-4 fw-bold text-decoration-underline">Deleted Bets</h1>
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="bet-options" className="form-label">
                Select an Option:
              </label>
              <select
                id="bet-options"
                className="form-select"
                value={selectedOption}
                onChange={handleDropdownChange}
              >
                <option value="">Select Market</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>
          </div>
          <div className="col-md-2" style={{ marginTop: "31px" }}>
            <button className="btn btn-success w-100" onClick={handleButtonClick}>
              Get History
            </button>
          </div>
        </div>
      </div>
      <div className="card shadow-lg p-3 mb-5 rounded">
        <div className="rounded" style={{ background: "#95D9E8" }}>
          <h5 className="text-center fw-bold p-2 mt-1 text-decoration-underline">Bet History</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover text-center">
            <thead>
              <tr>
                <th>Serial Number</th>
                <th>Market Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {marketHistory.markets.length > 0 ? (
                marketHistory.markets.map((market, index) => (
                  <tr key={market.marketId}>
                    <td>{startIndex + index}</td>
                    <td>{market.marketName}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>                  
                    </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No deleted markets found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={marketHistory.currentPage}
          totalPages={marketHistory.totalPages}
          handlePageChange={handlePageChange}
          startIndex={startIndex}
          endIndex={endIndex}
          totalData={marketHistory.totalData}
        />
      </div>
    </div>
  );
};

export default DeleteBetHistory;
