import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../../../contextApi/context";
import { GetPurchaseHistoryMarketTimings, PurchasedTicketsHistory } from "../../../Utils/apiService";
import { Table, Spinner } from "react-bootstrap";
import debounce from "lodash.debounce";
import { useParams, useNavigate } from "react-router-dom";

const PurchasedTickets = () => {
  const { dispatch, showLoader, hideLoader } = useAppContext();
  const { marketId: paramMarketId } = useParams(); // Get marketId from route params
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(true);
  const [purchasedTickets, setPurchasedTickets] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalItems: 0,
  });

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [markets, setMarkets] = useState([]);
  const [selectedMarketId, setSelectedMarketId] = useState(paramMarketId || null); // Track selected market ID
  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await GetPurchaseHistoryMarketTimings();
        if (response?.success) {
          setMarkets(response.data || []);
          if (!paramMarketId && response.data.length > 0) {
            // If no marketId from route, select the first market in the list
            setSelectedMarketId(response.data[0].marketId);
          }
        } else {
          console.error("Failed to fetch markets");
        }
      } catch (error) {
        console.error("Error fetching markets:", error);
      }
    };

    fetchMarketData();
  }, [paramMarketId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      showLoader();
      try {
        await fetchPurchasedLotteryTickets(searchTerm);
      } catch (error) {
        console.error("Error fetching lottery markets:", error);
      } finally {
        hideLoader();
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      fetchPurchasedLotteryTickets.cancel();
    };
  }, [selectedMarketId, pagination.page, pagination.limit, searchTerm]);

  const fetchPurchasedLotteryTickets = useCallback(
    debounce(async (searchTerm) => {
      setLoader(true);
      try {
        const response = await PurchasedTicketsHistory({
          marketId: selectedMarketId, // Use the selected market ID
          page: pagination.page,
          limit: pagination.limit,
          searchBySem: searchTerm,
        });

        if (response && response.success) {
          setPurchasedTickets(response.data || []);
          setPagination({
            page: response?.pagination?.page || pagination.page,
            limit: response?.pagination?.limit || pagination.limit,
            totalPages: response?.pagination?.totalPages || 0,
            totalItems: response?.pagination?.totalItems || 0,
          });
          dispatch({
            type: "PURCHASED_LOTTERY_TICKETS",
            payload: response.data,
          });
        } else {
          console.error("Failed to fetch purchased tickets");
        }
      } catch (error) {
        console.error("Error fetching purchased tickets:", error);
      }
      setLoader(false);
    }, 500),
    [selectedMarketId, pagination.page, pagination.limit, dispatch]
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleMarketClick = (marketId) => {
    setSelectedMarketId(marketId); // Update selected market ID
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to the first page
    navigate(`/purchase-history/${marketId}`); // Navigate to the route with marketId
  };

  const startIndex = (pagination.page - 1) * pagination.limit + 1;
  const endIndex = Math.min(pagination.page * pagination.limit, pagination.totalItems);

  if (loading) {
    return null;
  }

  return (
    <div className="container mt-4 p-3">
      {/* Top Navigation for Markets */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Markets</h4>
        <div className="d-flex flex-wrap">
          {markets.length > 0 ? (
            markets.map((market) => (
              <span
                key={market.marketId}
                className="badge bg-primary me-2"
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
      </div>

      {/* Purchased Tickets Table */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 style={{ color: "#4682B4" }}>Purchased Lottery Tickets</h2>
        <div className="w-50">
          <input
            type="text"
            className="form-control"
            placeholder="Search purchased tickets by SEM.."
            aria-label="Search tickets"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

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
            <th>SEM</th>
            <th>Tickets</th>
            <th>User Name</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {loader ? (
            <tr>
              <td colSpan="6">
                <div className="d-flex justify-content-center align-items-center">
                  <Spinner animation="border" variant="primary" />
                  <span className="ms-2">Loading tickets...</span>
                </div>
              </td>
            </tr>
          ) : purchasedTickets.length > 0 ? (
            purchasedTickets.map((ticket, index) => (
              <tr key={index}>
                <td>{startIndex + index}</td>
                <td>{ticket.marketName || "N/A"}</td>
                <td>{ticket.sem}</td>
                <td>
                  <div className="dropdown" style={{ position: "relative" }}>
                    <button
                      className="btn btn-link dropdown-toggle"
                      type="button"
                      onClick={() => toggleDropdown(index)}
                    >
                      View Tickets
                    </button>
                    <div
                      className="custom-dropdown-content"
                      style={{
                        height: dropdownOpen === index ? "150px" : "0",
                        overflow: "hidden",
                        transition: "height 0.3s ease",
                      }}
                    >
                      {dropdownOpen === index && (
                        <div className="custom-dropdown-menu">
                          <span className="dropdown-item-text">
                            Ticket Numbers:
                          </span>
                          <div className="dropdown-divider" />
                          {ticket.tickets.length > 0 ? (
                            ticket.tickets.map((number, i) => (
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
                      )}
                    </div>
                  </div>
                </td>
                {/* <td>{ticket.price }</td> */}
                <td>{ticket.userName || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No tickets found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination Component */}
      {/* Add pagination here */}
    </div>
  );
};

export default PurchasedTickets;
