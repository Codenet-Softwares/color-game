
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { useAuth } from "../../Utils/Auth";
import GameService from "../../Services/GameService";
import GetBetTrash from "./GetBetTrash";

const DeleteBetHistory = () => {
  const auth = useAuth();
  const [selectedMarketName, setSelectedMarketName] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedMarketDetails, setSelectedMarketDetails] = useState([]);
  const [marketHistory, setMarketHistory] = useState({
    markets: [],
    search: "",
  });


  const fetchMarketHistory = async () => {
    try {
      const response = await GameService.trashLiveBetHistory(
        auth.user,
        1,
        1000,
        marketHistory.search
      );

      setMarketHistory((prev) => ({
        ...prev,
        markets: response.data?.data || [],
      }));
    } catch (error) {
      toast.error("Failed to fetch market history");
    }
  };
  const deleteMarketTrash = async (trashMarketId) => {
    try {
      const response = await GameService.deleteTrashMarket(
        auth.user,
        trashMarketId
      );
      if (response.data.success) {
        toast.success(response.data.message);
        const updatedDetails = selectedMarketDetails.filter(
          (detail) => detail.trashMarketId !== trashMarketId
        );
        setSelectedMarketDetails(updatedDetails);
        fetchMarketHistory();
      } else {
        toast.error("Failed to delete market trash");
      }
    } catch (error) {
      toast.error("Error deleting market trash");
    }
  };
  
  
  useEffect(() => {
    fetchMarketHistory();
  }, [marketHistory.search]);

  const fetchMarketDetails = async (marketId) => {
    try {
      const response = await GameService.getBetTrash(
        auth.user,
        marketId,
        1,
        1000,
        ""
      );
      if (response.data.success) {
        setSelectedMarketDetails(response.data.data || []);

      } else {
        toast.error("Failed to fetch market details");
      }
    } catch (error) {
      toast.error("Error fetching market details");
    }
  };

  const handleDropdownChange = (e) => {
    const marketId = e.target.value;
    setSelectedOption(marketId);

    const selectedMarket = marketHistory.markets.find(
      (market) => market.marketId === marketId
    );
    setSelectedMarketName(selectedMarket ? selectedMarket.marketName : "");

    if (marketId) {
      fetchMarketDetails(marketId);
    }
  };


  return (
    <div className="container mt-5">
      <div
        className="card shadow-lg p-2 mb-5 rounded "
        style={{ background: "#95D9E8" }}
      >
        <h1 className="text-center mb-4 fw-bold text-decoration-underline">
          Deleted Bets
        </h1>
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="bet-options" className="form-label fw-bold">
                Select Market:
              </label>
              <select
                id="bet-options"
                className="form-select text-center rounded"
                value={selectedOption}
                onChange={handleDropdownChange}
                style={{
                  overflowY: "auto",
                  display: "block",
                }}
              >
                <option value="">Select Market</option>
                {marketHistory.markets.length > 0 ? (
                  marketHistory.markets.map((market) => (
                    <option key={market.marketId} value={market.marketId}>
                      {market.marketName}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No deleted markets found.
                  </option>
                )}
              </select>
            </div>
          </div>
        </div>
      </div>
      <GetBetTrash selectedMarketDetails={selectedMarketDetails}
        marketName={selectedMarketName}
        deleteMarketTrash={deleteMarketTrash}
        />

    </div>
  );
};

export default DeleteBetHistory;
