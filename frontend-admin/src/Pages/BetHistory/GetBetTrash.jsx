import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Pagination from "../../Components/Pagination";
import { useAuth } from "../../Utils/Auth";

const GetBetTrash = ({
  selectedMarketDetails,
  handleRestoreMarketTrash,
  handleDeleteMarketTrash,
  setSelectedMarketDetails,
}) => {
  const auth = useAuth();

  console.log("selectedMarketDetails", selectedMarketDetails);

  const handlePageChange = (pageNumber) => {
    setSelectedMarketDetails((prev) => ({ ...prev, currentPage: pageNumber }));
  };

  const handleEntriesChange = (e) => {
    setSelectedMarketDetails((prev) => ({
      ...prev,
      currentPage: 1,
      totalEntries: parseInt(e.target.value, 10),
    }));
  };

  const startIndex =
    (selectedMarketDetails.currentPage - 1) *
    selectedMarketDetails.totalEntries;
  const endIndex = Math.min(
    startIndex + selectedMarketDetails.totalEntries,
    selectedMarketDetails.markets.length
  );

  return (
    <div
      className="card shadow-lg p-3 m-2 rounded"
      style={{ background: "#E1D1C7" }}
    >
      <div className="mt-3 text-end">
        <label className="me-2 fw-bold">Show</label>
        <select
          className="form-select d-inline-block w-auto"
          value={selectedMarketDetails.totalEntries}
          onChange={handleEntriesChange}
          style={{
            borderRadius: "50px",
            border: "2px solid #3E5879",
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <label className="ms-2 fw-bold">Entries</label>
      </div>
      <div className="table-responsive p-3">
        <table className="table table-striped table-hover text-center">
          <thead className="table-primary text-uppercase">
            <tr>
              <th>Runner Name</th>
              <th>User Name</th>
              <th>Rate</th>
              <th>Type</th>
              <th>Stake</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {selectedMarketDetails?.markets?.length > 0 ? (
              selectedMarketDetails?.markets?.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.runnerName}</td>
                  <td>{detail.userName}</td>
                  <td>{detail.rate}</td>
                  <td
                    className={`text-uppercase fw-bold ${
                      detail.type === "back" ? "text-success" : "text-danger"
                    }`}
                  >
                    {detail.type}
                  </td>
                  <td>
                    {Math.round(detail.value)}({Math.round(detail.bidAmount)})
                  </td>
                  <td>
                    <button
                      className="btn btn-danger me-2"
                      onClick={() =>
                        handleDeleteMarketTrash({
                          marketId: detail.marketId,
                          userId: detail.userId,
                          runnerId: detail.runnerId,
                          betId: detail.betId,
                        })
                      }
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-info"
                      onClick={() =>
                        handleRestoreMarketTrash({
                          marketId: detail.marketId,
                          userId: detail.userId,
                          runnerId: detail.runnerId,
                          betId: detail.betId,
                        })
                      }
                    >
                      Restore
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-danger text-center fw-bold">
                  No Data Found For The Selected Market
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={selectedMarketDetails.currentPage}
        totalPages={selectedMarketDetails.totalPages}
        handlePageChange={handlePageChange}
        startIndex={
          (selectedMarketDetails.currentPage - 1) *
            selectedMarketDetails.totalEntries +
          1
        }
        endIndex={Math.min(
          selectedMarketDetails.currentPage *
            selectedMarketDetails.totalEntries,
          selectedMarketDetails.totalData
        )}
        totalData={selectedMarketDetails.totalData}
      />
    </div>
  );
};

export default GetBetTrash;
