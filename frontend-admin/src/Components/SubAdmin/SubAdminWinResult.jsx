import React, { useEffect, useState } from "react";
import Pagination from "../Pagination";
import SingleCard from "../common/singleCard";
import { getSubAdminWinResult } from "../../Utils/intialState";
import { toast } from "react-toastify";
import { customErrorHandler } from "../../Utils/helper";
import { useAuth } from "../../Utils/Auth";
import AccountServices from "../../Services/AccountServices";
const SubAdminWinResult = () => {
  const [subAdminWinResult, setSubAdminWinResult] =
    useState(getSubAdminWinResult);
  const auth = useAuth();

  const fetchSubAdminResult = () => {
    auth.showLoader();
    AccountServices.subAdminResult(
      auth.user,
      subAdminWinResult?.currentPage,
      subAdminWinResult?.totalEntries
      // viewWinningHistory.debouncedSearchTerm
    )
      .then((res) => {
        setSubAdminWinResult((prev) => ({
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
  useEffect(() => {
    fetchSubAdminResult();
  }, [
    subAdminWinResult?.currentPage,
    subAdminWinResult?.totalEntries,
    subAdminWinResult?.debouncedSearchTerm,
  ]);
  const toggleAccordion = (index) => {
    setSubAdminWinResult((prevState) => ({
      ...prevState,
      openRowIndex: prevState?.openRowIndex === index ? null : index,
    }));
  };
  const handlePageChange = (page) => {
    if (page >= 1 && page <= subAdminWinResult?.totalPages) {
      setSubAdminWinResult((prev) => ({
        ...prev,
        currentPage: page,
      }));
    }
  };
  let startIndex = Math.min(
    (Number(subAdminWinResult?.currentPage) - 1) *
      Number(subAdminWinResult?.totalEntries) +
      1,
    Number(subAdminWinResult?.totalData)
  );
  let endIndex = Math.min(
    Number(subAdminWinResult?.currentPage) *
      Number(subAdminWinResult?.totalEntries),
    Number(subAdminWinResult?.totalData)
  );
  return (
    <div>
      <div className="container my-5 p-5 ">
        <div className="card shadow-lg" style={{ background: "#E1D1C7" }}>
          <div
            className="card-header text-white"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#3E5879",
            }}
          >
            <h3
              className="mb-0 fw-bold text-uppercase"
              style={{ flexGrow: 1, textAlign: "center" }}
            >
              Sub-Admin Win Result
            </h3>
          </div>
          <div className="card-body" style={{ background: "#E1D1C7" }}>
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
                    {subAdminWinResult?.history?.length > 0 ? (
                      subAdminWinResult?.history.map((game, gameIndex) => (
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
                                {subAdminWinResult?.openRowIndex === gameIndex
                                  ? "Hide Details"
                                  : "View Details"}
                              </button>
                            </td>
                          </tr>
                          {/* Accordion Content */}
                          {subAdminWinResult?.openRowIndex === gameIndex && (
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

            {subAdminWinResult?.history?.length > 0 && (
              <Pagination
                currentPage={subAdminWinResult?.currentPage}
                totalPages={subAdminWinResult?.totalPages}
                handlePageChange={handlePageChange}
                startIndex={startIndex}
                endIndex={endIndex}
                totalData={subAdminWinResult?.totalData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubAdminWinResult;
