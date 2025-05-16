import React, { useEffect, useState, useCallback } from "react";
import { Table, Spinner } from "react-bootstrap";
import Pagination from "../common/Pagination";
import {
  GetPurchaseHistoryMarketTimings,
  lotteryPurchaseHIstoryUserNew,
} from "../../utils/apiService";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import ViewTicketsModal from "../../betHistory/components/history/components/ViewTicketsModal";

// Initial state function
export function initialLotteryPurchaseState() {
  return {
    purchasedTickets: [],
    pagination: {
      page: 1,
      limit: 10,
      totalPages: 0,
      totalItems: 0,
    },
    markets: [],
    selectedMarketId: null,
    selectedDate: format(new Date(), "yyyy-MM-dd"),
    searchTerm: "",
    visibleStartIndex: 0,
    loading: true,
    dropdownOpen: null,
    modalOpen: false,
    selectedTickets: [],
  };
}

const LotteryPurchaseHistory = ({ MarketId }) => {
  const [state, setState] = useState(initialLotteryPurchaseState());
  const today = format(new Date(), "yyyy-MM-dd");
  const visibleCount = 5;

  // Initialize with prop if provided
  useEffect(() => {
    if (MarketId) {
      setState((prev) => ({ ...prev, selectedMarketId: MarketId }));
    }
  }, [MarketId]);

  // Fetch market data based on selected date
  const fetchMarketData = useCallback(async () => {
    try {
      const response = await GetPurchaseHistoryMarketTimings({
        date: selectedDate,
      });

      if (response?.success) {
        const markets = response.data || [];
        setState((prev) => ({
          ...prev,
          markets,
          selectedMarketId: markets.length > 0 ? markets[0].marketId : null,
          loading: false,
        }));
      } else {
        console.error("Failed to fetch markets");
        setState((prev) => ({ ...prev, markets: [], loading: false }));
      }
    } catch (error) {
      console.error("Error fetching markets:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [state.selectedDate]);

  // Fetch purchase history
  useEffect(() => {
    fetchMarketData();
  }, [selectedDate]);
  const fetchPurchaseHistory = async () => {
    if (!selectedMarketId) return;

      try {
        const response = await lotteryPurchaseHIstoryUserNew({
          marketId: state.selectedMarketId,
          page: state.pagination.page,
          limit: state.pagination.limit,
          searchBySem: searchTerm,
        });

        if (response?.success) {
          setState((prev) => ({
            ...prev,
            purchasedTickets: response.data || [],
            pagination: {
              ...prev.pagination,
              page: response.pagination?.page || 1,
              limit: response.pagination?.limit || 10,
              totalPages: response.pagination?.totalPages || 0,
              totalItems: response.pagination?.totalItems || 0,
            },
            loading: false,
          }));
        } else {
          console.error("Failed to fetch purchase history");
          setState((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setState((prev) => ({ ...prev, loading: false }));
      }
    }, 500),
    [state.selectedMarketId, state.pagination.page, state.pagination.limit]
  );

  // Effect for fetching market data
  useEffect(() => {
    setState((prev) => ({ ...prev, loading: true }));
    fetchMarketData();
  }, [fetchMarketData]);

  // Effect for fetching purchase history
  useEffect(() => {
    if (state.selectedMarketId) {
      setState((prev) => ({ ...prev, loading: true }));
      fetchPurchaseHistory(state.searchTerm);
    }
    return () => fetchPurchaseHistory.cancel();
  }, [
    state.selectedMarketId,
    state.pagination.page,
    state.pagination.limit,
    state.searchTerm,
    fetchPurchaseHistory,
  ]);

  // Handler functions
  const handleDateChange = (event) => {
    const newDate = event.target.value;
    const formattedDate = format(new Date(newDate), "yyyy-MM-dd");
    setState((prev) => ({
      ...prev,
      selectedDate: formattedDate,
      pagination: { ...prev.pagination, page: 1 },
    }));
  };

  const handleSearchChange = (event) => {
    setState((prev) => ({
      ...prev,
      searchTerm: event.target.value,
      pagination: { ...prev.pagination, page: 1 },
    }));
  };

  const handleMarketClick = (marketId) => {
    setState((prev) => ({
      ...prev,
      selectedMarketId: marketId,
      pagination: { ...prev.pagination, page: 1 },
    }));
  };

  const handlePageChange = (newPage) => {
    setState((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, page: newPage },
    }));
  };

  const handleLeftClick = () => {
    setState((prev) => ({
      ...prev,
      visibleStartIndex: Math.max(0, prev.visibleStartIndex - 1),
    }));
  };

  const handleRightClick = () => {
    setState((prev) => ({
      ...prev,
      visibleStartIndex: Math.min(
        prev.visibleStartIndex + 1,
        Math.max(0, state.markets.length - visibleCount)
      ),
    }));
  };

  const toggleDropdown = (id) => {
    setState((prev) => ({
      ...prev,
      dropdownOpen: prev.dropdownOpen === id ? null : id,
    }));
  };

  const openModalWithTickets = (ticketNumbers) => {
    setState((prev) => ({
      ...prev,
      selectedTickets: ticketNumbers,
      modalOpen: true,
    }));
  };

  // Derived values
  const visibleMarkets = state.markets.slice(
    state.visibleStartIndex,
    state.visibleStartIndex + visibleCount
  );

  const startIndex = (state.pagination.page - 1) * state.pagination.limit + 1;
  const endIndex = Math.min(
    state.pagination.page * state.pagination.limit,
    state.pagination.totalItems
  );

  return (
    <div
      className="container mt-5 p-3"
      style={{
        background: "linear-gradient(135deg, #f0f9ff, #cce7f6)",
        borderRadius: "10px",
        boxShadow: "0 0 15px rgba(0,0,0,0.1)",
      }}
    >
      {/* Date Filter UI */}
      <div className="date-filter-container">
        <div>
          <label htmlFor="date-filter" className="date-filter-label">
            <i
              className="fas fa-calendar-alt me-2"
              style={{ color: "#4682B4" }}
            ></i>
            Select Lottery Market Date:
          </label>
          <p className="date-filter-description">
            Please Choose a Date To View Past Available Lottery Markets.
          </p>
        </div>
        <input
          type="date"
          id="date-filter"
          className="date-filter-input"
          value={state.selectedDate}
          onChange={handleDateChange}
          max={today}
          onKeyDown={(e) => e.preventDefault()}
        />
      </div>

      {/* Market Navigation */}
      <div
        className="d-flex justify-content-between align-items-center mb-3 p-2 rounded shadow"
        style={{
          backgroundColor: "#f9f9f9",
          border: "1px solid #ddd",
        }}
      >
        {visibleMarkets.length > 0 ? (
          <>
            <h4 className="fw-bold" style={{ color: "#284B63" }}>
              LOTTERY MARKETS
            </h4>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-sm btn-outline-primary me-3"
                onClick={handleLeftClick}
                disabled={state.visibleStartIndex === 0}
                style={{
                  borderRadius: "50%",
                  width: "35px",
                  height: "35px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 0,
                }}
              >
                <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                  &lt;
                </span>
              </button>

              <div className="d-flex flex-wrap justify-content-center">
                {visibleMarkets.map((market) => (
                  <span
                    key={market.marketId}
                    className={`badge text-white me-2 mb-2 ${
                      state.selectedMarketId === market.marketId
                        ? "bg-success"
                        : "bg-primary"
                    }`}
                    style={{
                      cursor: "pointer",
                      padding: "10px 15px",
                      fontSize: "14px",
                      borderRadius: "20px",
                      transition: "all 0.3s ease-in-out",
                    }}
                    onClick={() => handleMarketClick(market.marketId)}
                  >
                    {market.marketName}
                  </span>
                ))}
              </div>

              <button
                className="btn btn-sm btn-outline-primary ms-3"
                onClick={handleRightClick}
                disabled={
                  state.visibleStartIndex + visibleCount >= state.markets.length
                }
                style={{
                  borderRadius: "50%",
                  width: "35px",
                  height: "35px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 0,
                }}
              >
                <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                  &gt;
                </span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center w-100">
            <h4 style={{ color: "#FF6347", fontWeight: "bold" }}>
              No Markets Available
            </h4>
            <p style={{ color: "#6c757d" }}>
              Please Try Again Later or Check Your Purchases.
            </p>
          </div>
        )}
      </div>



      {markets.length === 0 ? (
        <div className="text-center my-4">
          <h5 className="text-danger fw-bold">
            🛈 No market available for the selected date
          </h5>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
            <h4 className="mb-0 fw-bold">MARKETS</h4>

            <div className="d-flex w-50 justify-content-end">
              <input
                type="text"
                className="form-control"
                placeholder="Search purchased tickets by SEM.."
                aria-label="Search tickets"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ maxWidth: "300px" }}
              />
            </div>
          </div>
          <div className="d-flex justify-content-start align-items-center mb-3 position-relative">
            <button
              className="btn btn-sm btn-outline-secondary me-2"
              onClick={handleLeftClick}
              disabled={visibleStartIndex === 0}
            >
              &lt;
            </button>

            <div className="d-flex flex-wrap" style={{ gap: "8px" }}>
              {visibleMarkets.length > 0 &&
                visibleMarkets.map((market) => (
                  <span
                    key={market.marketId}
                    className={`badge ${selectedMarketId === market.marketId
                      ? "bg-success"
                      : "bg-primary"
                      } me-2`}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleMarketClick(market.marketId)}
                  >
                    {market.marketName}
                  </span>
                ))}
            </div>

            <button
              className="btn btn-sm btn-outline-secondary ms-2"
              onClick={handleRightClick}
              disabled={visibleStartIndex + visibleCount >= markets.length}
            >
              &gt;
            </button>
          </div>

          <h2 className="text-center mb-4" style={{ color: "#4682B4" }}>
            MY LOTTERY PURCHASES
          </h2>

          {purchaseHistory.length > 0 ? (
            <Table striped hover responsive bordered className="table-sm">
              <thead
                style={{
                  backgroundColor: "#4682B4",
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                <tr>
                  <th>Serial Number</th>
                  <th>Market Name</th>
                  <th>Price</th>
                  <th>SEM</th>
                  <th>Ticket Numbers</th>
                  <th>User Name</th>
                </tr>
              </thead>
              <tbody style={{ textAlign: "center" }}>
                {purchaseHistory.map((purchase, index) => (
                  <tr key={index}>
                    <td>{startIndex + index}</td>
                    <td>{purchase.marketName || "N/A"}</td>
                    <td>
                      {purchase.price !== undefined ? purchase.price : "N/A"}
                    </td>
                    <td>{purchase.sem || "N/A"}</td>
                    <td>
                      <div className="dropdown" style={{ position: "relative" }}>
                        <button
                          className="btn btn-link dropdown-toggle"
                          type="button"
                          onClick={() => toggleDropdown(index)}
                        >
                          View Tickets
                        </button>
                        {dropdownOpen === index && (
                          <div className="custom-dropdown-menu">
                            <span className="dropdown-item-text">
                              Ticket Numbers:
                            </span>
                            <div className="dropdown-divider" />
                            <div
                              className="ticket-list"
                              style={{
                                maxHeight: "150px",
                                overflowY:
                                  purchase.tickets.length > 8 ? "auto" : "visible",
                              }}
                            >
                              {Array.isArray(purchase.tickets) &&
                                purchase.tickets.length > 0 ? (
                                purchase.tickets.map((number, i) => (
                                  <span key={i} className="dropdown-item">
                                    {number}
                                  </span>
                                ))
                              ) : (
                                <span className="dropdown-item text-muted">
                                  No ticket numbers available
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{purchase.userName || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center">
              <h4>No purchase history available</h4>
            </div>
          )}
        </>
      )}

      {purchaseHistory.length > 0 && markets.length > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          handlePageChange={handlePageChange}
          startIndex={startIndex}
          endIndex={endIndex}
          totalData={pagination.totalItems}
        />
      )}
    </div>
  );
};

export default LotteryPurchaseHistory;