import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Pagination from "../../Components/Pagination";
import { useAuth } from "../../Utils/Auth";

const GetBetTrash = ({
  selectedMarketDetails,
  marketName,
  handleRestoreMarketTrash,
  handleDeleteMarketTrash,
  setSelectedMarketDetails,
}) => {
  const auth = useAuth();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalEntries: 10,
  });

  const totalPages = Math.ceil(
    selectedMarketDetails.length / pagination.totalEntries
  );

  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({ ...prev, currentPage: pageNumber }));
  };

  const handleEntriesChange = (e) => {
    setPagination({
      currentPage: 1,
      totalEntries: parseInt(e.target.value, 10),
    });
  };

  //   const handleDelete = async (trashMarketId) => {
  //     const isConfirmed = window.confirm(
  //         "Are you sure you want to Delete this market?"
  //     );
  //     if (!isConfirmed) return; // Exit if the user cancels

  //     auth.showLoader(); // Show loader only when the user confirms
  //     try {
  //         await deleteMarketTrash(trashMarketId);
  //         // Remove the deleted item from selectedMarketDetails
  //         setSelectedMarketDetails((prevDetails) =>
  //             prevDetails.filter((detail) => detail.trashMarketId !== trashMarketId)
  //         );
  //     } catch (error) {
  //         console.error("Error deleting market:", error);
  //     } finally {
  //         auth.hideLoader(); // Hide loader after completion
  //     }
  // };

  // const handleRestore = async (trashMarketId) => {
  //   const isConfirmed = window.confirm(
  //       "Are you sure you want to Restore this market?"
  //   );
  //   if (!isConfirmed) return; // Exit if the user cancels

  //   auth.showLoader(); // Show loader only when the user confirms
  //   try {
  //       await restoreMarketTrash(trashMarketId);
  //       // Remove the restored item from selectedMarketDetails
  //       setSelectedMarketDetails((prevDetails) =>
  //           prevDetails.filter((detail) => detail.trashMarketId !== trashMarketId)
  //       );
  //   } catch (error) {
  //       console.error("Error restoring market:", error);
  //   } finally {
  //       auth.hideLoader(); // Hide loader after completion
  //   }
  // };

  const startIndex = (pagination.currentPage - 1) * pagination.totalEntries;
  const endIndex = Math.min(
    startIndex + pagination.totalEntries,
    selectedMarketDetails.length
  );
  const paginatedData = selectedMarketDetails.slice(startIndex, endIndex);

  return (
    <div
      className="card shadow-lg p-3 m-2 rounded"
      style={{ background: "#E1D1C7" }}
    >
      <div className="mt-3 text-end">
        <label className="me-2 fw-bold">Show</label>
        <select
          className="form-select d-inline-block w-auto"
          value={pagination.totalEntries}
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
            {paginatedData.length > 0 ? (
              paginatedData.map((detail, index) => (
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
        currentPage={pagination.currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        startIndex={startIndex + 1}
        endIndex={endIndex}
        totalData={selectedMarketDetails.length}
      />
    </div>
  );
};

export default GetBetTrash;
