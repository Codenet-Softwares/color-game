import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { useAuth } from "../../Utils/Auth";
import { FaSearch, FaTimes, FaTrashAlt } from "react-icons/fa";
import GameService from "../../Services/GameService";
import GetBetTrash from "./GetBetTrash";
import Pagination from "../../Components/Pagination";
import { customErrorHandler } from "../../Utils/helper";

const DeleteBetHistory = () => {
  const auth = useAuth();
  const [selectedMarketDetails, setSelectedMarketDetails] = useState({
    markets: [],
    currentPage: 1,
    totalPages: 1,
    totalEntries: 10,
    totalData: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [marketId, setMarketId] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalEntries: 10,
  });
  const [marketHistory, setMarketHistory] = useState({
    markets: [],
    currentPage: 1,
    totalPages: 1,
    totalEntries: 10,
    search: "",
    totalData: 0,
  });
  const [refresh, setRefresh] = useState({});


  const fetchMarketHistory = useCallback(
    (term, page = 1, entries = 10) => {
      GameService.trashLiveBetHistory(auth.user, page, entries, term)
        .then((res) => {
          setMarketHistory((prev) => ({
            ...prev,
            markets: res.data?.data || [],
            totalPages: res?.data.pagination?.totalPages,
            totalData: res?.data.pagination?.totalItems,
          }));
        })
        .catch((err) => {
          toast.error(customErrorHandler(err));
        });
    },
    [auth.user]
  );

  const fetchMarketDetails = async () => {
    try {
      const response = await GameService.getBetTrash(
        auth.user,
        marketId,
        selectedMarketDetails.currentPage,
        selectedMarketDetails.totalEntries,
        ""
      );
      if (response.data.success) {
        setSelectedMarketDetails((prev) => ({
          ...prev,
          markets: response.data?.data || [],
          totalPages: response?.data.pagination?.totalPages,
          totalData: response?.data.pagination?.totalItems,
        }));
      }
    } catch (error) {
      const errorMessage = customErrorHandler(error);
      if (errorMessage) {
        toast.error(errorMessage);
      }
    }
  };

  useEffect(() => {
    if (marketId) {
      fetchMarketDetails();
    }
  }, [
    marketId,
    refresh,
    selectedMarketDetails.currentPage,
    selectedMarketDetails.totalEntries,
  ]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMarketHistory(searchTerm, 1, marketHistory.totalEntries);
      setMarketHistory((prev) => ({ ...prev, currentPage: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDeleteMarketTrash = (data) => {
    GameService.deleteTrashMarket(auth.user, data)
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          setRefresh(response);
        } else {
          toast.error("Failed to delete market trash");
        }
      })
      .catch((error) => {
        customErrorHandler(error);
      });
  };

  const handleRestoreMarketTrash = (data) => {
    GameService.restoreTrashMarket(auth.user, data)
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          setRefresh(response);
        } else {
          toast.error("Failed to restore market trash");
        }
      })
      .catch((error) => {
        customErrorHandler(error);
      });
  };

  const handleAccordionChange = (marketId) => {
    setMarketId(marketId);
  };

  const handlePageChange = (pageNumber) => {
    setMarketHistory((prev) => ({ ...prev, currentPage: pageNumber }));
    fetchMarketHistory(searchTerm, pageNumber, marketHistory.totalEntries);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const startIndex =
    (marketHistory.currentPage - 1) * marketHistory.totalEntries;
  const endIndex = Math.min(
    startIndex + marketHistory.totalEntries,
    marketHistory.markets.length
  );

  return (
    <div>
      <div className="container mt-5" style={{ width: "94%" }}>
        <div className=" text1 rounded" style={{ background: "#3E5879" }}>
          <h2 className="text-uppercase fw-bold text-center text-white p-2">
            Deleted Bets
          </h2>
        </div>
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
            placeholder="Search By market Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              paddingLeft: "40px",
              borderRadius: "30px",
              border: "2px solid  #3E5879",
            }}
          />
        </div>

        <div
          className="card shadow-lg rounded mt-4 p-4"
          style={{ background: "#E1D1C7" }}
        >
          <div className="accordion" id="marketAccordion">
            {marketHistory.markets.length > 0 ? (
              marketHistory.markets.map((market) => (
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
                      <div className="d-flex justify-content-between w-100">
                        <h6 className="fw-bolder">
                          Game Name:{" "}
                          <h6 className="fw-bold text-danger">
                            {market.gameName}
                          </h6>
                        </h6>
                        <h6 className="fw-bolder px-3">
                          Market Name:
                          <h6 className="fw-bold text-danger">
                            {market.marketName}
                          </h6>
                        </h6>
                      </div>
                    </button>
                  </h2>
                  <div
                    id={`collapse${market.marketId}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading${market.marketId}`}
                    data-bs-parent="#marketAccordion"
                  >
                    <div className="accordion-body">
                      <GetBetTrash
                        selectedMarketDetails={selectedMarketDetails}
                        handleDeleteMarketTrash={handleDeleteMarketTrash}
                        handleRestoreMarketTrash={handleRestoreMarketTrash}
                        setSelectedMarketDetails={setSelectedMarketDetails}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-warning text-center fw-bold shadow rounded-pill px-4 py-3">
                🚫 No Deleted Markets Found.
              </div>
            )}
          </div>

          {marketHistory.markets.length > 0 && (
            <Pagination
              currentPage={marketHistory.currentPage}
              totalPages={marketHistory.totalPages}
              handlePageChange={handlePageChange}
              startIndex={
                (marketHistory.currentPage - 1) * marketHistory.totalEntries + 1
              }
              endIndex={Math.min(
                marketHistory.currentPage * marketHistory.totalEntries,
                marketHistory.totalData
              )}
              totalData={marketHistory.totalData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteBetHistory;
