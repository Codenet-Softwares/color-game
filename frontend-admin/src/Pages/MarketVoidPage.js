import React, { useEffect, useState } from "react";
import GameService from "../Services/GameService";
import { useAuth } from "../Utils/Auth";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaTimes } from "react-icons/fa";
import SingleCard from "../Components/common/singleCard";
import Pagination from "../Components/Pagination";
import { toast } from "react-toastify";
import { customErrorHandler } from "../Utils/helper";

const MarketVoidPage = () => {
  const auth = useAuth();
  const [voidGame, setVoidGame] = useState({
    gamelist: [],
    currentPage: 1,
    totalPages: "",
    totalEntries: 5,
    name: "",
    totalData: "",
  });

  useEffect(() => {
    fetchVoidGames();
  }, [voidGame.currentPage, voidGame.totalEntries, voidGame.name]);

  const fetchVoidGames = () => {
    GameService.voidMarketList(
      auth.user,
      voidGame.currentPage,
      voidGame.totalEntries,
      voidGame.name
    )
      .then((res) => {
        console.log(
          "pagination",
          res?.data.pagination.totalPages,
          res.data.pagination.totalItems
        );
        setVoidGame({
          ...voidGame,
          gamelist: res.data?.data,
          totalPages: res?.data.pagination?.totalPages,
          totalData: res?.data.pagination?.totalItems,
        });
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
      });
  };

  const handleClearSearch = () => {
    setVoidGame({ ...voidGame, name: "" });
  };

  const handlePageChange = (pageNumber) => {
    setVoidGame({ ...voidGame, currentPage: pageNumber });
  };
  let startIndex = Math.min(
    (Number(voidGame.currentPage) - 1) * Number(voidGame.totalEntries) + 1
  );
  let endIndex = Math.min(
    Number(voidGame.currentPage) * Number(voidGame.totalEntries),
    Number(voidGame.totalData)
  );

  return (
    <div className="container my-5 p-5">
      <div className="card shadow-sm">
        <div
          className="card-header"
          style={{
            backgroundColor: "#3E5879",
            color: "#FFFFFF",
          }}
        >
          <h3 className="mb-0 fw-bold text-center">Void Game</h3>
        </div>
        <div className="card-body" style={{background:"#D8C4B6"}}>
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
                className="form-control"
                placeholder="Search by game name or market name..."
                value={voidGame.name}
                onChange={(e) =>
                  setVoidGame({ ...voidGame, name: e.target.value })
                }
                style={{
                  paddingLeft: "40px",
                  borderRadius: "30px",
                  border: "2px solid #6c757d",
                }}
              />
              {voidGame.name && (
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
                value={voidGame.totalEntries}
                onChange={(e) =>
                  setVoidGame({ ...voidGame, totalEntries: e.target.value })
                }
                style={{
                  borderRadius: "50px",
                  border: "2px solid #6c757d",
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
                className="table table-striped table-hover rounded-table"
                style={{
                  border: "2px solid #6c757d",
                  borderRadius: "10px",
                }}
              >
                <thead
                  className="table-primary"
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <tr>
                    <th style={{ width: "25%" }}>Serial Number</th>
                    <th style={{ width: "20%" }}>Game Name</th>
                    <th style={{ width: "20%" }}>Market Name</th>
                    <th style={{ width: "35%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {voidGame?.gamelist?.length > 0 ? (
                    <>
                      {voidGame.gamelist.map((data, index) => (
                        <tr key={index}>
                          <td colSpan="4">
                            <div
                              className="accordion"
                              id={`accordionExample-${index}`}
                            >
                              <div className="accordion-item">
                                <h2
                                  className="accordion-header"
                                  id={`flush-headingOne-${index}`}
                                >
                                  <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#flush-collapseOne-${index}`}
                                    aria-expanded="false"
                                    aria-controls={`flush-collapseOne-${index}`}
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      width: "100%",
                                      padding: "0.75rem 1.25rem",
                                    }}
                                  >
                                    <span style={{ width: "25%" }}>
                                      {index + 1}
                                    </span>
                                    <span style={{ width: "25%" }}>
                                      {data.gameName}
                                    </span>
                                    <span style={{ width: "25%" }}>
                                      {data.marketName}
                                    </span>
                                    <span style={{ width: "25%" }}>
                                      {data.action}
                                    </span>
                                  </button>
                                </h2>
                                <div
                                  id={`flush-collapseOne-${index}`}
                                  className="accordion-collapse collapse"
                                  aria-labelledby={`flush-headingOne-${index}`}
                                  data-bs-parent={`#accordionExample-${index}`}
                                >
                                  <div className="accordion-body">
                                    {/* Accordion Body Content */}
                                    <div className="table-responsive">
                                      <table
                                        className="table table-striped table-hover rounded-table"
                                        style={{
                                          border: "2px solid #6c757d",
                                          borderRadius: "10px",
                                        }}
                                      >
                                        <thead
                                          className="table-primary"
                                          style={{
                                            position: "sticky",
                                            top: 0,
                                            zIndex: 1,
                                          }}
                                        >
                                          <tr>
                                            <th>Runnner Name</th>
                                            <th>Back</th>
                                            <th>Lay</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {data.Runners.length > 0 ? (
                                            data.Runners.map((data, index) => {
                                              return (
                                                <React.Fragment key={index}>
                                                  <tr>
                                                    <td>{data.runnerName}</td>
                                                    <td>{data.back}</td>
                                                    <td>{data.lay}</td>
                                                  </tr>
                                                </React.Fragment>
                                              );
                                            })
                                          ) : (
                                            <tr>
                                              <td
                                                colSpan="4"
                                                className="text-center"
                                              >
                                                No inactive games found.
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No inactive games found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SingleCard>

          {voidGame?.gamelist?.length > 0 && (
            <Pagination
              currentPage={voidGame.currentPage}
              totalPages={voidGame.totalPages}
              handlePageChange={handlePageChange}
              startIndex={startIndex}
              endIndex={endIndex}
              totalData={voidGame.totalData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketVoidPage;
