import React, { useEffect, useState } from "react";
import AccountServices from "../Services/AccountServices";
import { useAuth } from "../Utils/Auth";
import { getViewWinningHistory } from "../Utils/intialState";
import { toast } from "react-toastify";
import { customErrorHandler } from "../Utils/helper";
import SingleCard from "./common/singleCard";
import Pagination from "./Pagination";

const ViewWinningHistory = () => {
  const auth = useAuth();
  const [viewWinningHistory, setViewWinningHistory] = useState(
    getViewWinningHistory()
  );

  useEffect(() => {
    fetchviewWinningHistory();
  }, [
    viewWinningHistory?.currentPage,
    viewWinningHistory?.totalEntries,
    viewWinningHistory?.debouncedSearchTerm,
  ]);

  const fetchviewWinningHistory = () => {
    auth.showLoader();
    AccountServices.viewWinninghistory(
      auth.user,
      viewWinningHistory?.currentPage,
      viewWinningHistory?.totalEntries
      // viewWinningHistory.debouncedSearchTerm
    )
      .then((res) => {
        setViewWinningHistory((prev) => ({
          ...prev,
          history: res?.data?.data || [],
          totalPages: res?.data.pagination?.totalPages,
          totalData: res?.data.pagination?.totalItems,
        }));
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
      })
      .finally(() => {
        auth.hideLoader();
      });
  };

  const fetchVoidWinningBet = (marketId) => {
    const isConfirmed = window.confirm("Are you sure you want to void this market?");
    if (!isConfirmed) return;
    auth.showLoader();
    AccountServices.voidWinningBet(auth.user, marketId)
      .then((res) => {
        toast.success("Market voided successfully!");
        fetchviewWinningHistory();
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
      })
      .finally(() => {
        auth.hideLoader();
      });
  };
  const handleRevokeAnnouncement = (marketId, runnerId) => {
    auth.showLoader();
    const isConfirmed = window.confirm("Are you sure you want to Revoke?");
    if (!isConfirmed) return;
    console.log("runnerId=============", runnerId);
    console.log("marketId=============", marketId);

    AccountServices.revokeAnnounceWin(
      {
        marketId: marketId,
        runnerId: runnerId,
      },
      auth.user
    )
      .then((response) => {
        toast.success("Revoke announcement successful", response.data);
        // fetchInactiveGames();
        fetchviewWinningHistory();
      })
      .catch((err) => {
        toast.error("Error revoking announcement:", err);
      })
      .finally(() => {
        // Hide the loader after the request is complete (success or error)
        auth.hideLoader();
      });
  };
  const handlePageChange = (page) => {
    if (page >= 1 && page <= viewWinningHistory?.totalPages) {
      setViewWinningHistory((prev) => ({
        ...prev,
        currentPage: page,
      }));
    }
  };

  const toggleAccordion = (index) => {
    setViewWinningHistory((prevState) => ({
      ...prevState,
      openRowIndex: prevState?.openRowIndex === index ? null : index,
    }));
  };

  console.log("first", viewWinningHistory);

  let startIndex = Math.min(
    (Number(viewWinningHistory?.currentPage) - 1) *
      Number(viewWinningHistory?.totalEntries) +
      1,
    Number(viewWinningHistory?.totalData)
  );
  let endIndex = Math.min(
    Number(viewWinningHistory?.currentPage) *
      Number(viewWinningHistory?.totalEntries),
    Number(viewWinningHistory?.totalData)
  );

  return (
    <div className="container my-5 p-5">
      <div className="card shadow-lg">
        <div
          className="card-header"
          style={{
            backgroundColor: "#3E5879",
            color: "#FFFFFF",
          }}
        >
          <h3 className="mb-0 fw-bold text-center text-uppercase">
            Winning History
          </h3>
        </div>
        <div className="card-body" style={{ background: "#E1D1C7" }}>
          {/* Search and Entries Selection */}
          {/* <div className="row mb-4">
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
                                placeholder="Search By Market Name..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setViewWinningHistory((prev) => ({
                                        ...prev,
                                        searchTerm: e.target.value
                                    }))
                                }


                                style={{
                                    paddingLeft: "40px",
                                    borderRadius: "30px",
                                    border: "2px solid #3E5879",
                                }}
                            />
                            {viewWinningHistory.searchTerm && (
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

                        <div className="col-md-6 text-end">
                            <label className="me-2 fw-bold">Show</label>
                            <select
                                className="form-select rounded-pill d-inline-block w-auto"
                                value={viewWinningHistory.totalEntries}
                                style={{
                                    borderRadius: "50px",
                                    border: "2px solid #3E5879",
                                }}
                                onChange={(e) =>
                                    setViewWinningHistory((prev) => ({
                                        ...prev,
                                        totalEntries: parseInt(e.target.value),
                                    }))
                                }
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <label className="ms-2 fw-bold">Entries</label>
                        </div>
                    </div> */}

          {/* Table */}
          <SingleCard
            className=" mb-5 text-center"
            style={{
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 1)",
            }}
          >
            <div className="table-responsive">
              <table
                className="table table-striped table-hover rounded-table"
                style={{
                  border: "2px solid #3E5879",
                  borderRadius: "10px",
                }}
              >
                <thead
                  className="table-primary text-uppercase"
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <tr>
                    <th>Serial Number</th>
                    <th>Game Name</th>
                    <th>Market Name</th>
                    {/* <th>Status</th> */}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {viewWinningHistory?.history?.length > 0 ? (
                    viewWinningHistory?.history.map((game, gameIndex) => (
                      <React.Fragment key={game?.gameId}>
                        <tr>
                          <td>{gameIndex + 1}</td>
                          <td>{game?.gameName}</td>
                          <td>{game?.marketName}</td>
                          {/* <td className="fw-bold">
                            {game.type === "Matched" ? "Matched" : "Unmatched"}
                          </td> */}
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => toggleAccordion(gameIndex)}
                            >
                              {viewWinningHistory?.openRowIndex === gameIndex
                                ? "Hide Details"
                                : "View Details"}
                            </button>
                          </td>
                        </tr>
                        {/* Accordion Content */}
                        {viewWinningHistory?.openRowIndex === gameIndex && (
                          <tr>
                            <td colSpan="5">
                              <div className="accordion-body">
                                <table className="table table-bordered">
                                  <thead className="table-secondary">
                                    <tr>
                                      <th>Declared By</th>
                                      <th>Runner Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {game.data.map((runner, runnerIndex) => (
                                      <tr
                                        key={`${game?.gameId}-${runner?.runnerId}-${runnerIndex}`}
                                      >
                                        <td>{runner?.declaredByNames}</td>
                                        <td>{runner?.runnerName}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot>
                                    <tr>
                                      <td colSpan="2" className="text-center">
                                        <button
                                          className="btn px-3 me-2 text-white"
                                          style={{ background: "#3E5879" }}
                                          onClick={() =>
                                            fetchVoidWinningBet(game.marketId)
                                          }
                                        >
                                          Void
                                        </button>
                                        <button
                                          className="btn btn-danger px-3"
                                          onClick={() => {
                                            handleRevokeAnnouncement(
                                              game.marketId,
                                              game.data[0].runnerId
                                            );
                                          }}
                                        >
                                          Revoke
                                        </button>
                                        {/* {console.log("object",game.data[0].runnerId)} */}
                                      </td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center text-danger fw-bold"
                      >
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SingleCard>

          {viewWinningHistory?.history?.length > 0 && (
            <Pagination
              currentPage={viewWinningHistory?.currentPage}
              totalPages={viewWinningHistory?.totalPages}
              handlePageChange={handlePageChange}
              startIndex={startIndex}
              endIndex={endIndex}
              totalData={viewWinningHistory?.totalData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewWinningHistory;
