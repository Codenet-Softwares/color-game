import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Pagination from "../common/Pagination";
import {
  GetPurchaseHistoryMarketTimings,
  lotteryPurchaseHIstoryUserNew,
} from "../../utils/apiService";
import { format } from "date-fns";

// Debounce function
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const LotteryPurchaseHistory = ({ MarketId }) => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalItems: 0,
  });
  const today = format(new Date(), "yyyy-MM-dd");
  const [markets, setMarkets] = useState([]);
  const [selectedMarketId, setSelectedMarketId] = useState(MarketId);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(today);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const visibleCount = 5;

  const handleLeftClick = () => {
    setVisibleStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleRightClick = () => {
    setVisibleStartIndex((prev) =>
      Math.min(prev + 1, Math.max(0, markets.length - visibleCount))
    );
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset pagination on search
  };

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Adjust the delay time (500ms)

  const visibleMarkets = markets.slice(
    visibleStartIndex,
    visibleStartIndex + visibleCount
  );

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  // Fetch market data based on selected date
  const fetchMarketData = async () => {
    try {
      const response = await GetPurchaseHistoryMarketTimings({
        date:selectedDate,
      });
      if (response?.success) {
        setMarkets(response.data || []);
        if (!selectedMarketId && response.data.length > 0) {
          setSelectedMarketId(response.data[0].marketId);
        }
      } else {
        console.error("Failed to fetch markets");
      }
    } catch (error) {
      console.error("Error fetching markets:", error);
    }
  };

  // Fetch purchase history
  useEffect(() => {
    fetchMarketData();
  }, [ selectedDate]);
  const fetchPurchaseHistory = async () => {
    if (!selectedMarketId) return;

    try {
      const response = await lotteryPurchaseHIstoryUserNew({
        marketId: selectedMarketId,
        page: pagination.page,
        limit: pagination.limit,
        searchBySem: debouncedSearchTerm, // Use debounced search term
      });

      if (response?.success) {
        const filteredData = response.data.map((item) => ({
          marketName: item.marketName,
          tickets: item.tickets,
          price: item.price,
          userName: item.userName,
          sem: item.sem,
        }));

        setPurchaseHistory(filteredData);
        setPagination({
          page: response.pagination?.page || 1,
          limit: response.pagination?.limit || 10,
          totalPages: response.pagination?.totalPages || 0,
          totalItems: response.pagination?.totalItems || 0,
        });
      } else {
        console.error("Failed to fetch purchase history");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseHistory();
  }, [
    selectedMarketId,
    pagination.page,
    pagination.limit,
    debouncedSearchTerm,
  ]); // Add debouncedSearchTerm as a dependency

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    const formattedDate = format(new Date(newDate), "yyyy-MM-dd");
    setSelectedDate(formattedDate);
    fetchMarketData();
  };

  const handleMarketClick = (marketId) => {
    setSelectedMarketId(marketId);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset pagination on market change
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const startIndex = (pagination.page - 1) * pagination.limit + 1;
  const endIndex = Math.min(
    pagination.page * pagination.limit,
    pagination.totalItems
  );

  // Conditional rendering based on the availability of markets for the selected date
  // if (loading) {
  //   return (
  //     <div className="d-flex justify-content-center align-items-center ">
  //       <h1
  //         className="fw-bold text-white p-5 rounded-5"
  //         style={{ marginTop: "300px", background: "#1a89a2" }}
  //       >
  //         Purchase Lottery is
  //         <br />
  //         Not Available
  //       </h1>
  //     </div>
  //   );
  // }

  return (
    <div
      className="container mt-5 p-3"
      style={{
        background: "#e6f7ff",
        borderRadius: "10px",
        boxShadow: "0 0 15px rgba(0,0,0,0.1)",
      }}
    >
      {/* Date Filter UI */}
      <div className="container py-4">
        <div className="card shadow border-0 rounded-4 bg-light">
          <div className="card-body text-center">
            <h5 className="card-title text-primary mb-3">
              SELECT DATE FOR PAST PURCHASES:
            </h5>
            <div className="d-flex justify-content-center align-items-center">
              <label
                htmlFor="date-filter"
                className="form-label fw-bold me-3 text-secondary"
              >
                Date:
              </label>
              <input
                type="date"
                id="date-filter"
                className="form-control form-control-lg border-primary rounded-pill shadow-sm"
                value={selectedDate}
                onChange={handleDateChange}
                max={today} // Prevent selecting future dates
                style={{
                  maxWidth: "300px",
                  background: "linear-gradient(135deg, #e6f7ff, #ffffff)",
                }}
                readonly // Prevent manual typing
                onKeyDown={(e) => e.preventDefault()} // Block manual input from keyboard
              />
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
        <h4 className="mb-0 fw-bold">MARKETS</h4>

        {/* Search Input Section */}
        <div className="d-flex w-50 justify-content-end">
          <input
            type="text"
            className="form-control"
            placeholder="Search purchased tickets by SEM.."
            aria-label="Search tickets"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              maxWidth: "300px",
            }}
          />
        </div>
      </div>

      {/* Market Badge Section */}
      <div className="d-flex justify-content-start align-items-center mb-3 position-relative">
        <button
          className="btn btn-sm btn-outline-secondary me-2"
          onClick={handleLeftClick}
          disabled={visibleStartIndex === 0}
        >
          &lt;
        </button>

        <div className="d-flex flex-wrap">
          {visibleMarkets.length > 0 ? (
            visibleMarkets.map((market) => (
              <span
                key={market.marketId}
                className={`badge ${
                  selectedMarketId === market.marketId
                    ? "bg-success"
                    : "bg-primary"
                } me-2`}
                style={{ cursor: "pointer" }}
                onClick={() => handleMarketClick(market.marketId)}
              >
                {market.marketName}
              </span>
            ))
          ) : (
            <span>No markets available</span>
          )}
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

      {/* Conditional Table Rendering */}
      {markets.length > 0 ? (
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
            {purchaseHistory.length > 0 ? (
              purchaseHistory.map((purchase, index) => (
                <tr key={index}>
                  <td>{startIndex + index}</td>
                  <td>{purchase.marketName || "N/A"}</td>
                  <td>
                    {purchase.price !== undefined ? purchase.price : "N/A"}
                  </td>
                  <td>{purchase.sem || "N/A"}</td>
                  <td>
                    {/* Dropdown for ticket numbers */}
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
                                purchase.tickets.length > 8
                                  ? "auto"
                                  : "visible",
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
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No purchase history available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      ) : (
        <div className="text-center">
          <h4>No purchases found on this date selection</h4>
        </div>
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
