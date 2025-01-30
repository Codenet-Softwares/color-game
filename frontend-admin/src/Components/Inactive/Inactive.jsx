import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaTimes } from "react-icons/fa";
import SingleCard from "../common/singleCard";
import AccountServices from "../../Services/AccountServices";
import { useAuth } from "../../Utils/Auth";
import Pagination from "../Pagination"; // Adjust the import as needed
import { toast } from "react-toastify";

const Inactive = () => {
  const auth = useAuth();
  const [inactiveGames, setInactiveGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [totalData, setTotalData] = useState("");
 useEffect(() => {
    // Debouncing logic: Update `debouncedSearchTerm` after 500ms
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer); // Clear the timer on cleanup
  }, [searchTerm]);
  useEffect(() => {
    auth.showLoader();
    fetchInactiveGames();
  }, [currentPage, itemsPerPage, debouncedSearchTerm]);

  const fetchInactiveGames = () => {
    AccountServices.getInactiveGames(
      auth.user,
      currentPage,
      itemsPerPage,
      debouncedSearchTerm
    )
      .then((res) => {
        const gamesData = res.data?.data || [];
        setInactiveGames(gamesData);
        setTotalData(res.data.pagination.totalItems);
        setTotalPages(res.data.pagination.totalPages);
      })
      .catch((err) => {
      })
      .finally(() => {
        auth.hideLoader();
      });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setInactiveGames((prev) => ({ ...prev, name: "" }));
  };

  const handleRevokeAnnouncement = (marketId, runnerId) => {
    auth.showLoader();
    const data = {
      marketId: marketId,
      runnerId: runnerId,
    };

    AccountServices.revokeAnnounceWin(data, auth.user)
      .then((response) => {
        toast.success("Revoke announcement successful", response.data);
        fetchInactiveGames(); // Refresh the list after a successful revoke
      })
      .catch((err) => {
        toast.error("Error revoking announcement:", err);
      }).finally(() => {
        // Hide the loader after the request is complete (success or error)
        auth.hideLoader();
      });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  let startIndex = Math.min(
    (Number(currentPage) - 1) * Number(itemsPerPage) + 1
  );
  let endIndex = Math.min(
    Number(currentPage) * Number(itemsPerPage),
    Number(totalData)
  );

  return (
    <div className="container p-5">
      <div className="card shadow-sm">
        <div
          className="card-header"
          style={{
            backgroundColor: "#3E5879",
            color: "#FFFFFF",
          }}
        >
          <h3 className="mb-0 fw-bold  text-center text-uppercase">Announced Game</h3>
        </div>
        <div className="card-body" style={{background:"#E1D1C7"}}>
          {/* Search and Entries Selection */}
          <div className="row mb-4">
            <div className="col-md-6 position-relative">
              <FaSearch
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "20px",
                  transform: "translateY(-50%)",
                  color: "#6c757d",
                  fontSize: "18px",
                }}
              />
              <input
                type="text"
                className="form-control fw-bold"
                placeholder="Search By Game Name Or Market Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  paddingLeft: "40px",
                  borderRadius: "30px",
                  border: "2px solid #3E5879",
                }}
              />
              {searchTerm && (
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
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
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
          </div>

          {/* Table */}
          <SingleCard
            className=" mb-5 "
            style={{
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 1)",
            }}
          >
            <div className="table-responsive">
              <table
                className="table table-striped table-hover rounded-table text-center"
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
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inactiveGames.length > 0 ? (
                    inactiveGames.map((game, index) => {
                      const winningRunners = game.runners.filter(
                        (runner) => runner.isWin === 1
                      );

                      return (
                        <React.Fragment key={game.market.marketId}>
                          {winningRunners.length > 0 ? (
                            <tr>
                              <td rowSpan={winningRunners.length}>
                                {startIndex + index}
                              </td>
                              <td rowSpan={winningRunners.length}>
                                {game.game.gameName}
                              </td>
                              <td rowSpan={winningRunners.length}>
                                {game.market.marketName}
                              </td>
                              <td>
                                {winningRunners.map((runner) => (
                                  <div key={runner.runnerId}>
                                    <div
                                      style={{
                                        fontWeight: "bold",
                                        color: "#4682B4",
                                        marginBottom: "10px",
                                      }}
                                    >
                                      Runner Won : {runner.runnerName}
                                    </div>

                                    <button
                                      className="btn btn-danger"
                                      onClick={() =>
                                        handleRevokeAnnouncement(
                                          game.market.marketId,
                                          runner.runnerId
                                        )
                                      }
                                    >
                                      Revoke Announcement
                                    </button>
                                  </div>
                                ))}
                              </td>
                            </tr>
                          ) : (
                            <tr key={game.market.marketId}>
                              <td>{startIndex + index + 1}</td>
                              <td>{game.game.gameName}</td>
                              <td>{game.market.marketName}</td>
                              <td>
                                <button
                                  className="btn btn-danger"
                                  onClick={() =>
                                    handleRevokeAnnouncement(
                                      game.market.marketId
                                    )
                                  }
                                >
                                  Revoke Announcement
                                </button>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-danger fw-bold">
                        No Inactive Games Found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SingleCard>
          {inactiveGames.length > 0 && (
            <Pagination style={{background:"#3E5879"}}
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              startIndex={startIndex}
              endIndex={endIndex}
              totalData={totalData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Inactive;
