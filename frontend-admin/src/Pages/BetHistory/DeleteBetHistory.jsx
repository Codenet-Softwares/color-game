import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { useAuth } from "../../Utils/Auth";
import { FaSearch, FaTimes, FaTrashAlt } from "react-icons/fa";
import GameService from "../../Services/GameService";
import GetBetTrash from "./GetBetTrash";
import Pagination from "../../Components/Pagination";

const DeleteBetHistory = () => {
  const auth = useAuth();
  const [selectedMarketName, setSelectedMarketName] = useState("");
  const [selectedMarketDetails, setSelectedMarketDetails] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalEntries: 10,
  });
  const [marketHistory, setMarketHistory] = useState({
    markets: [],
    search: "",
    currentPage: 1,
    totalEntries: 10,
  });

  const fetchMarketHistory = () => {
    auth.showLoader();
    GameService.trashLiveBetHistory(
      auth.user,
      marketHistory.currentPage,
      marketHistory.totalEntries,
      marketHistory.search
    )
      .then((res) => {
        setMarketHistory((prev) => ({
          ...prev,
          markets: res.data?.data || [],
        }));
      })
      .catch((err) => {
        toast.error("Failed to fetch market history");
      }).finally(() => {
        auth.hideLoader();
      });
  };

  const deleteMarketTrash = (trashMarketId) => {
    GameService.deleteTrashMarket(auth.user, trashMarketId)
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          fetchMarketHistory();
        } else {
          toast.error("Failed to delete market trash");
        }
      })
      .catch((error) => {
        toast.error("Error deleting market trash");
      });
  };

  const restoreMarketTrash = (trashMarketId) => {
    GameService.restoreTrashMarket(auth.user, trashMarketId)
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          fetchMarketHistory();
        } else {
          toast.error("Failed to restore market trash");
        }
      })
      .catch((error) => {
        toast.error("Error restoring market trash");
      });
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

  const handleAccordionChange = (marketId) => {
    const selectedMarket = marketHistory.markets.find(
      (market) => market.marketId === marketId
    );
    setSelectedMarketName(selectedMarket ? selectedMarket.marketName : "");
    if (marketId) {
      fetchMarketDetails(marketId);
    }
  };

  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({ ...prev, currentPage: pageNumber }));
  };

  const handleEntriesChange = (e) => {
    setPagination({
      currentPage: 1,
      totalEntries: parseInt(e.target.value, 10),
    });
  };

  const handleClearSearch = () => {
    setMarketHistory((prev) => ({ ...prev, search: "" }));
  };

  const startIndex = (pagination.currentPage - 1) * pagination.totalEntries;
  const endIndex = Math.min(
    startIndex + pagination.totalEntries,
    marketHistory.markets.length
  );
  const totalData = marketHistory.markets.length;
  const totalPages = Math.ceil(totalData / pagination.totalEntries);

  const paginatedMarkets = marketHistory.markets.slice(startIndex, endIndex);

  return (
    <div>
    <div className="container mt-5" style={{width:"94%"}}>
      <div className=" text1 rounded" style={{background:"#3E5879"}}>
        <h2 className="text-uppercase fw-bold text-center text-white p-2 ">Deleted Bets</h2>
      </div>
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
          placeholder="Search by market name..."
          value={marketHistory.search}
          onChange={(e) =>
            setMarketHistory((prev) => ({ ...prev, search: e.target.value }))
          }
          style={{
            paddingLeft: "40px",
            borderRadius: "30px",
            border: "2px solid #6c757d",
          }}
        />
        {marketHistory.search && (
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

      <div
        className="card shadow-lg rounded mt-4 p-4"
        style={{ background: "#E1D1C7" }}
      >
        <div className="accordion" id="marketAccordion">
          {paginatedMarkets.length > 0 ? (
            paginatedMarkets.map((market) => (
              <div
                className="accordion-item m-2 bg-light shadow-lg"
                key={market.marketId}
              >
                <h2
                  className="accordion-header"
                  id={`heading${market.marketId}`}
                >
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${market.marketId}`}
                    aria-expanded="true"
                    aria-controls={`collapse${market.marketId}`}
                    onClick={() => handleAccordionChange(market.marketId)}
                  >
                    <h6 className="fw-bolder">{market.marketName}</h6>
                  </button>
                </h2>
                <div
                  id={`collapse${market.marketId}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading${market.marketId}`}
                  data-bs-parent="#marketAccordion"
                >
                  <div className="accordion-body">
                    {selectedMarketName === market.marketName && (
                      <GetBetTrash
                        selectedMarketDetails={selectedMarketDetails}
                        marketName={selectedMarketName}
                        deleteMarketTrash={deleteMarketTrash}
                        restoreMarketTrash={restoreMarketTrash}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button" type="button" disabled>
                  No deleted markets found.
                </button>
              </h2>
            </div>
          )}
        </div>

        {paginatedMarkets.length > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            startIndex={startIndex + 1}
            endIndex={endIndex}
            totalData={totalData}
          />
        )}
      </div>
    </div>
    </div>
  );
};

export default DeleteBetHistory;