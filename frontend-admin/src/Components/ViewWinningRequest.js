import React, { useEffect, useState } from "react";
import { getViewWinningRequest } from "../Utils/intialState";
import AccountServices from "../Services/AccountServices";
import { useAuth } from "../Utils/Auth";
import { toast } from "react-toastify";
import { customErrorHandler } from "../Utils/helper";
import SingleCard from "./common/singleCard";
import WinningRequestAccept from "./modal/WinningRequestAccept";
import Pagination from "./Pagination";
import { FaSearch, FaTimes } from "react-icons/fa";

const ViewWinningRequest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [viewWinningRequest, setViewWinningRequest] = useState(
    getViewWinningRequest()
  );
  const auth = useAuth();
  console.log("isopen", viewWinningRequest);
  const openModalWithData = (data, marketId) => {
    setViewWinningRequest((prev) => ({
      ...prev,
      modalOpen: true,
      data: data,
      marketId: marketId,
    }));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= viewWinningRequest?.totalPages) {
      setViewWinningRequest((prev) => ({
        ...prev,
        currentPage: page,
      }));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setViewWinningRequest((prev) => ({
        ...prev,
        currentPage: 1,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchViewWinningRequest();
  }, [
    viewWinningRequest?.currentPage,
    viewWinningRequest?.totalEntries,
    debouncedSearchTerm,
    viewWinningRequest?.isRefresh,
  ]);

  const fetchViewWinningRequest = () => {
    auth.showLoader();
    AccountServices.viewWinningRequest(
      auth.user,
      viewWinningRequest?.currentPage,
      viewWinningRequest?.totalEntries,
      debouncedSearchTerm
    )
      .then((res) => {
        setViewWinningRequest((prev) => ({
          ...prev,
          request: res?.data?.data || [],
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

  console.log("first", viewWinningRequest);
  const handleClearSearch = () => {
    setSearchTerm("");
  };
  let startIndex = Math.min(
    (Number(viewWinningRequest?.currentPage) - 1) *
    Number(viewWinningRequest?.totalEntries) +
    1,
    Number(viewWinningRequest?.totalData)
  );
  let endIndex = Math.min(
    Number(viewWinningRequest?.currentPage) *
    Number(viewWinningRequest?.totalEntries),
    Number(viewWinningRequest?.totalData)
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
            Winning Request
          </h3>
        </div>
        <div className="card-body" style={{ background: "#E1D1C7" }}>
          {/* Search and Entries Selection */}
          <div className="row mb-4">
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
                value={viewWinningRequest.totalEntries}
                style={{
                  borderRadius: "50px",
                  border: "2px solid #3E5879",
                }}
                onChange={(e) =>
                  setViewWinningRequest((prev) => ({
                    ...prev,
                    totalEntries: parseInt(e.target.value),
                    currentPage: 1
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
          </div>

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
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {viewWinningRequest?.request.length > 0 ? (
                    <>
                      {viewWinningRequest?.request.map((bet, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{bet?.gameName}</td>
                          <td>{bet?.marketName}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                openModalWithData(bet.data, bet.marketId);
                              }}
                            >
                              View More
                            </button>

                            <WinningRequestAccept
                              data={viewWinningRequest?.data}
                              isOpen={viewWinningRequest?.modalOpen}
                              onClose={() =>
                                setViewWinningRequest((prev) => ({
                                  ...prev,
                                  modalOpen: false,
                                }))
                              }
                              marketId={viewWinningRequest?.marketId}
                              setViewWinningRequest={setViewWinningRequest}
                              viewWinningRequest={viewWinningRequest}
                            />
                          </td>
                        </tr>
                      ))}
                    </>
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
          {viewWinningRequest?.request?.length > 0 && (
            <Pagination
              currentPage={viewWinningRequest?.currentPage}
              totalPages={viewWinningRequest?.totalPages}
              handlePageChange={handlePageChange}
              startIndex={startIndex}
              endIndex={endIndex}
              totalData={viewWinningRequest?.totalData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewWinningRequest;
