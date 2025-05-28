import React, { useEffect, useState } from "react";
import { useAuth } from "../../Utils/Auth";
import GameService from "../../Services/GameService";
import SingleCard from "../../Components/common/singleCard";
import Pagination from "../Pagination";
import { FaSearch, FaTimes } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { getDeleteMarket } from "../../Utils/intialState";
import { customErrorHandler } from "../../Utils/helper";
import { toast } from "react-toastify";

const DeleteMarket = () => {
  const auth = useAuth();
  const [deleteMarket, setDeleteMarket] = useState(getDeleteMarket());
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [refresh, setRefresh] = useState({});

  console.log("deleteMarket", deleteMarket);

  const fetchMarkets = async (search = "") => {
    auth.showLoader();
    try {
      const response = await GameService.deleteGameMarket(
        auth.user,
        "",
        deleteMarket.currentPage,
        deleteMarket.totalEntries,
        debouncedSearchTerm
      );

      setDeleteMarket((prevData) => ({
        ...prevData,
        data: response.data.data || [],
        totalPages: response.data.pagination.totalPages || 1,
        totalData: response.data.pagination.totalItems || 0,
      }));
    } catch (error) {
      toast.error(customErrorHandler(error));
    } finally {
      auth.hideLoader();
    }
  };

  useEffect(() => {
    fetchMarkets(debouncedSearchTerm);
  }, [refresh, deleteMarket.currentPage, deleteMarket.totalEntries]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setDeleteMarket((prev) => ({
        ...prev,
        currentPage: 1,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = async (approvalMarketId) => {
    auth.showLoader();
    try {
      const res = await GameService.gameMarketDelete(
        auth.user,
        approvalMarketId
      );
      setDeleteMarket((prevMarkets) =>
        prevMarkets?.data?.filter(
          (market) => market.approvalMarketId !== approvalMarketId
        )
      );

      setRefresh(res);
      alert("Market deleted successfully!");
    } catch (error) {
      console.error("Error deleting market:", error);
      alert("Failed to delete market.");
    } finally {
      auth.hideLoader();
    }
  };

  const handleRestore = async (approvalMarketId) => {
    auth.showLoader();
    try {
      const res = await GameService.restoreDeletedMarket(
        auth.user,
        approvalMarketId
      );
      setRefresh(res);
      alert("Market restored successfully!");
    } catch (error) {
      console.error("Error restoring market:", error);
      alert("Failed to restore market.");
    } finally {
      auth.hideLoader();
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= deleteMarket?.totalPages) {
      setDeleteMarket((prev) => ({
        ...prev,
        currentPage: page,
      }));
    }
  };

  const handlePageSize = (value) => {
    setDeleteMarket((prev) => ({
      ...prev,
      totalEntries: value,
      currentPage: 1,
    }));
  };

  let startIndex = Math.min(
    (Number(deleteMarket.currentPage) - 1) * Number(deleteMarket.totalEntries) +
      1,
    Number(deleteMarket.totalData)
  );
  let endIndex = Math.min(
    Number(deleteMarket.currentPage) * Number(deleteMarket.totalEntries),
    Number(deleteMarket.totalData)
  );

  console.log(startIndex, endIndex);

  return (
    <div className="container my-5 ">
      <div className="card shadow-sm">
        <div
          className="card-header text-white text-center text-uppercase"
          style={{ background: "#3E5879" }}
        >
          <h3 className="mb-0 fw-bold">Deleted Markets</h3>
        </div>
        <div className="card-body" style={{ background: "#E1D1C7" }}>
          <div className="row mb-4">
            <div className="col-md-6 position-relative">
              <div className="input-group">
                <span
                  className="input-group-text bg-light border-2"
                  style={{
                    borderRadius: "30px 0 0 30px",
                    border: "2px solid #3E5879",
                  }}
                >
                  <FaSearch className="fw-bold" />
                </span>
                <input
                  type="text"
                  className="form-control fw-bold"
                  placeholder="Search By Market Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // Set search term on change
                  style={{
                    borderRadius: "0 30px 30px 0",
                    border: "2px solid #3E5879",
                  }}
                />
                {searchTerm && (
                  <button
                    className="btn btn-light border-2"
                    // onClick={handleClearSearch}
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
              <label className="me-2 fw-bold">Show</label>
              <select
                className="form-select d-inline-block w-auto fw-bold"
                value={deleteMarket.totalEntries}
                onChange={(e) => handlePageSize(e.target.value)}
                style={{ borderRadius: "30px", border: "2px solid #3E5879" }}
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

          {deleteMarket?.data?.length > 0 ? (
            <SingleCard
              className=" mb-5 text-center"
              style={{
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 1)",
              }}
            >
              <div className="table-responsive mx-auto">
                <table
                  className="table table-striped table-hover"
                  style={{ border: "2px solid #3E5879" }}
                >
                  <thead className="table-primary text-center text-uppercase">
                    <tr>
                      <th>Serial Number</th>
                      <th>Market Name</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {deleteMarket?.data?.map((market, index) => (
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
                            onClick={() => handleDelete(market.marketId)}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-info"
                            onClick={() => handleRestore(market.marketId)}
                          >
                            Restore
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SingleCard>
          ) : (
            <div className="alert alert-warning text-center fw-bold shadow rounded-pill px-4 py-3">
              🚫 No Deleted Markets Found.
            </div>
          )}

          {/* Pagination */}
          {deleteMarket?.data?.length > 0 && (
            <Pagination
              currentPage={deleteMarket?.currentPage}
              totalPages={deleteMarket?.totalPages}
              handlePageChange={handlePageChange}
              startIndex={startIndex}
              endIndex={endIndex}
              totalData={deleteMarket?.totalData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteMarket;
