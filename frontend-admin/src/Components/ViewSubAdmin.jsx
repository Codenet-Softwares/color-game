import React, { useEffect, useState } from "react";
import { getViewSubadmin } from "../Utils/intialState";
import AccountServices from "../Services/AccountServices";
import { useAuth } from "../Utils/Auth";
import { toast } from "react-toastify";
import { customErrorHandler } from "../Utils/helper";
import SingleCard from "./common/singleCard";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const ViewSubAdmin = () => {
  const [viewSubadmin, setViewSubadmin] = useState(getViewSubadmin());

  const auth = useAuth();
  console.log("isopen", viewSubadmin);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= viewSubadmin?.totalPages) {
      setViewSubadmin((prev) => ({
        ...prev,
        currentPage: page,
      }));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setViewSubadmin((prev) => ({
        ...prev,
        debouncedSearchTerm: prev.searchTerm,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [viewSubadmin?.searchTerm]);

  useEffect(() => {
    fetchViewWinningRequest();
  }, [
    // viewSubadmin?.currentPage,
    // viewSubadmin?.totalEntries,
    // viewSubadmin?.debouncedSearchTerm,
    viewSubadmin?.isRefresh,
  ]);

  const fetchViewWinningRequest = () => {
    auth.showLoader();
    AccountServices.viewSubAdmin(
      auth.user
      //   viewSubadmin?.currentPage,
      //   viewSubadmin?.totalEntries
      // viewSubadmin.debouncedSearchTerm
    )
      .then((res) => {
        setViewSubadmin((prev) => ({
          ...prev,
          data: res?.data?.data || [],
          //   totalPages: res?.data.pagination?.totalPages,
          //   totalData: res?.data.pagination?.totalItems,
        }));
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
      })
      .finally(() => {
        auth.hideLoader();
      });
  };

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
            LIST OF SUB-ADMIN
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
                                    setviewSubadmin((prev) => ({
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
                            {viewSubadmin.searchTerm && (
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
                                value={viewSubadmin.totalEntries}
                                style={{
                                    borderRadius: "50px",
                                    border: "2px solid #3E5879",
                                }}
                                onChange={(e) =>
                                    setViewSubadmin((prev) => ({
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
            className="mb-5 text-center"
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
                {/* Table Header */}
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
                    <th className="text-start">Name</th>
                    <th className="text-start">Permission</th>
                    <th>Action</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {viewSubadmin?.data?.length > 0 ? (
                    viewSubadmin?.data?.map((subadmin, index) => (
                      <tr key={index}>
                        <td className="fw-bold">{index + 1}</td>
                        <td
                          className="fw-bold text-start"
                          style={{ color: "#DC686E" }}
                        >
                          {subadmin?.userName}
                        </td>
                        <td className="text-dark fw-bold text-start">
                          {subadmin?.permissions}
                        </td>
                        <td>
                          <button
                            className="btn btn-info me-2"
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Edit"
                          >
                            <FaEdit className="" />
                          </button>
                          <button
                            className="btn btn-danger"
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Delete"
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center text-danger fw-bold p-3"
                      >
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SingleCard>

          {/* {viewSubadmin?.request?.length > 0 && (
            <Pagination
              currentPage={viewSubadmin?.currentPage}
              totalPages={viewSubadmin?.totalPages}
              handlePageChange={handlePageChange}
              startIndex={startIndex}
              endIndex={endIndex}
              totalData={viewSubadmin?.totalData}
            />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default ViewSubAdmin;
