import React, { useEffect, useState } from "react";
import { useAuth } from "../../Utils/Auth";
import GameService from "../../Services/GameService";
import Pagination from "../Pagination";
import { FaSearch, FaTimes } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const DeleteMarket = () => {
  const auth = useAuth();
  const [markets, setMarkets] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Debounce delay of 500ms

    return () => clearTimeout(timer); // Cleanup the timer on every new change
  }, [searchTerm]);
  const fetchMarkets = async (page = 1, pageSize = 10, search = "") => {
    auth.showLoader();
    try {
      const response = await GameService.deleteGameMarket(
        auth.user,
        "",
        page,
        pageSize,
        search
      );
      setMarkets(response.data.data || []);
      setPagination({
        page: response.data.pagination.page || 1,
        pageSize: response.data.pagination.pageSize || 10,
        totalPages: response.data.pagination.totalPages || 1,
        totalItems: response.data.pagination.totalItems || 0,
      });
    } catch (error) {
      console.error("Error fetching markets:", error);
    } finally {
      auth.hideLoader();
    }
  };

  const handleRestore = async (approvalMarketId) => {
    try {
      await GameService.restoreDeletedMarket(auth.user, approvalMarketId);
      fetchMarkets(pagination.page, pagination.pageSize, searchTerm);
      alert("Market restored successfully!");
    } catch (error) {
      console.error("Error restoring market:", error);
      alert("Failed to restore market.");
    }
  };
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchMarkets(1, pagination.pageSize, value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    fetchMarkets(1, pagination.pageSize, "");
  };

  const handlePageChange = (newPage) => {
    fetchMarkets(newPage, pagination.pageSize, debouncedSearchTerm);
  };

  const handlePageSizeChange = (event) => {
    const newPageSize = Number(event.target.value);
    setPagination((prev) => ({ ...prev, pageSize: newPageSize, page: 1 }));
    fetchMarkets(1, newPageSize,debouncedSearchTerm);
  };

  const handleDelete = async (approvalMarketId) => {
    try {
      await GameService.gameMarketDelete(auth.user, approvalMarketId);

      setMarkets((prevMarkets) =>
        prevMarkets.filter((market) => market.approvalMarketId !== approvalMarketId)
      );

      fetchMarkets(pagination.page, pagination.pageSize, searchTerm);

      alert("Market deleted successfully!");
    } catch (error) {
      console.error("Error deleting market:", error);
      alert("Failed to delete market.");
    }
  };

  useEffect(() => {
    fetchMarkets(pagination.page, pagination.pageSize, debouncedSearchTerm);
  }, [debouncedSearchTerm, pagination.page, pagination.pageSize]);

  const startIndex = (pagination.page - 1) * pagination.pageSize + 1;
  const endIndex = Math.min(
    pagination.page * pagination.pageSize,
    pagination.totalItems
  );

  return (
    <div className="container my-5 ">
      <div className="card shadow-sm">
        <div className="card-header text-white text-center text-uppercase" style={{background:"#3E5879"}}>
          <h3 className="mb-0">Delete Markets</h3>
        </div>
        <div className="card-body" style={{background:"#E1D1C7"}}>
          <div className="row mb-4">
            <div className="col-md-6 position-relative">
              <div className="input-group">
                <span
                  className="input-group-text bg-light border-2"
                  style={{ borderRadius: "30px 0 0 30px" }}
                >
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-2"
                  placeholder="Search by market name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // Set search term on change
                  style={{ borderRadius: "0 30px 30px 0" }}
                />
                {searchTerm && (
                  <button
                    className="btn btn-light border-2"
                    onClick={handleClearSearch}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 1,
                      padding: "0 10px",
                    }}
                  >
                    <FaTimes className="text-muted" />
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-6 text-end">
              <label className="me-2">Show</label>
              <select
                className="form-select d-inline-block w-auto"
                value={pagination.pageSize}
                onChange={handlePageSizeChange}
                style={{ borderRadius: "30px", border: "2px solid #6c757d" }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <label className="ms-2">Entries</label>
            </div>
          </div>

          {/* Table */}
         
          {markets.length > 0 ? (
            <div className="table-responsive mx-auto">
              <table className="table table-striped table-hover">
                <thead className="table-secondary text-center">
                  <tr>
                    <th>#</th>
                    <th>Market Name</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {markets.map((market, index) => (
                    <tr key={market.approvalMarketId}>
                      <td>{startIndex + index}</td>
                      <td>{market.marketName}</td>
                      <td>
                        <span
                          style={{
                            color: market.isActive ? "green" : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {market.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger me-2"
                          onClick={() => handleDelete(market.approvalMarketId)}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-info"
                          onClick={() => handleRestore(market.approvalMarketId)}
                        >
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <h5 className="text-center fw-bold text-dark">No markets found.</h5>
          )}

          {/* Pagination */}
          {markets.length > 0 && (
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
      </div>
    </div>
  );
};

export default DeleteMarket;