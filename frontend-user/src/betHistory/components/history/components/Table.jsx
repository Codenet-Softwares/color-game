import React from "react";
import Pagination from "../../../../screen/common/Pagination";
import { formatDateForUi } from "../../../../utils/helper";
import ViewTicketsModal from "./ViewTicketsModal";

const Table = ({
  renderNoDataFound,
  betHistoryData,
  handleBetHistorySelectionMenu,
  handlePageChange,
  setBetHistoryData,
}) => {
  let startIndex = Math.min(
    (betHistoryData.currentPage - 1) * betHistoryData.totalEntries + 1
  );
  let endIndex = Math.min(
    betHistoryData.currentPage * betHistoryData.totalEntries,
    betHistoryData.totalData
  );

  const openModalWithTickets = (ticketNumbers) => {
    setBetHistoryData((prev) => ({
      ...prev,
      selectedTickets: ticketNumbers,
      modalOpen: true,
    }));
  };

  return (
    <div className="card shadow p-3 mb-5 bg-white rounded">
      <div
        className="card-header"
        style={{
          backgroundColor: "#2CB3D1",
          color: "white",
          textAlign: "center",
        }}
      >
        <h5 className="card-title text-uppercase fw-bold">Bet History</h5>
      </div>
      {betHistoryData.selectGame === null ? (
        <div className="alert alert-info text-center mt-2 fw-bold" role="alert">
          Please Select a Game Name & Click Get History
        </div>
      ) : betHistoryData.history?.length > 0 ? (
        <div className="card-body">
          {/* Show entries dropdown */}
          <div className="mb-3">
            <label htmlFor="showEntriesDropdown" className="form-label">
              Show Entries
            </label>
            <select
              className="form-select"
              id="showEntriesDropdown"
              name="totalEntries"
              value={betHistoryData.totalEntries}
              onChange={(e) => {
                handleBetHistorySelectionMenu(e);
                handlePageChange(1);
              }}
            >
              <option value="10" selected>
                10 Entries
              </option>
              <option value="25">25 Entries</option>
              <option value="50">50 Entries</option>
              <option value="100">100 Entries</option>
            </select>
          </div>

          <div style={{ overflow: "auto" }}>
            <table className="table table-bordered">
              {betHistoryData.gameType === "Lottery" ? (
                <>
                  <thead>
                    <tr align="center">
                      <th scope="col">Sport Name</th>
                      <th scope="col">Event</th>
                      <th scope="col">Tickets</th>
                      <th scope="col">Sem</th>
                      <th scope="col">Ticket Price</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {betHistoryData.history?.map((item, index) => (
                      <tr key={index} align="center">
                        <td>{item.gameName}</td>
                        <td>{item.marketName}</td>
                        <td>
                          {" "}
                          <div
                            className="dropdown"
                            style={{ position: "relative" }}
                          >
                            <button
                              className="btn btn-outline-dark fw-semibold px-4 py-2 rounded-5 shadow-sm border-1"
                              type="button"
                              onClick={() => openModalWithTickets(item.tickets)}
                            >
                              <i className="bi bi-ticket-perforated me-2"></i>{" "}
                              View Tickets
                            </button>
                            <ViewTicketsModal
                              isOpen={betHistoryData.modalOpen}
                              onClose={() =>
                                setBetHistoryData((prev) => ({
                                  ...prev,
                                  modalOpen: false,
                                }))
                              }
                              ticketNumbers={betHistoryData.selectedTickets}
                            />
                          </div>
                        </td>
                        <td>{item.sem}</td>
                        <td className="fw-bold">{item.ticketPrice}</td>
                        <td>{item.amount}</td>
                        <td>{new Date(item.date).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              ) : (
                <>
                  <thead>
                    <tr>
                      <th scope="col">Sport Name</th>
                      <th scope="col">Event</th>
                      <th scope="col">Market</th>
                      <th scope="col">Selection</th>
                      <th scope="col">Type</th>
                      <th scope="col">Odds Req.</th>
                      <th scope="col">Stack</th>
                      <th scope="col">Settle Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {betHistoryData.history?.map((item, index) => (
                      <tr key={index} align="center">
                        <td>{item?.gameName}</td>
                        <td>{item?.marketName}</td>
                        <td>{"WINNER"}</td>
                        <td>{item?.runnerName}</td>
                        <td
                          className="fw-bold"
                          style={{
                            color: item?.type === "back" ? "blue" : "red",
                          }}
                        >
                          {item?.type}
                        </td>
                        <td>{item?.rate}</td>
                        <td className="fw-bold">{item?.value}</td>
                        <td>{formatDateForUi(item?.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}
            </table>
          </div>
          <Pagination
            currentPage={betHistoryData.currentPage}
            totalPages={betHistoryData.totalPages}
            handlePageChange={handlePageChange}
            startIndex={startIndex}
            endIndex={endIndex}
            totalData={betHistoryData.totalData}
          />
        </div>
      ) : (
        renderNoDataFound()
      )}
    </div>
  );
};

export default Table;
