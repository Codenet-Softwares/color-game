import React, { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import SingleCard from "../common/singleCard";
import Pagination from "../Pagination";
import GameService from "../../Services/GameService";
import { useAuth } from "../../Utils/Auth";
import { customErrorHandler } from "../../Utils/helper";
import { toast } from "react-toastify";

const SubAdminView = () => {
  const auth = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // Added state for status filter
  const [subAdminHistory, setSubAdminHistory] = useState({
    subAdminHistory: [],
    currentPage: 1,
    totalPages: 1,
    totalEntries: 10,
    name: "",
    totalData: 0,
    runnerName: "",
    remarks: "",
  });
  const toggleAccordion = (index, status, runnerName, remarks) => {

    if (status === "Pending") {
      toast.warning("Your submission is not yet approved.");
      return;
    }
    setSubAdminHistory((prevState) => ({
      ...prevState,
      openRowIndex: prevState?.openRowIndex === index ? null : index,
      runnerName: runnerName,
      remarks: remarks,
    }));
  };

  const fetchSubAdminHistory = () => {
    GameService.getSubAdminHistory(
      auth.user,
      subAdminHistory.currentPage,
      subAdminHistory.totalEntries,
      debouncedSearchTerm,
      statusFilter
    )
      .then((res) => {
        setSubAdminHistory((prev) => ({
          ...prev,
          subAdminHistory: res.data?.data || [],
          totalPages: res?.data.pagination?.totalPages,
          totalData: res?.data.pagination?.totalLimits,
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
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setSubAdminHistory((prev) => ({
        ...prev,
        currentPage: 1,
      }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchSubAdminHistory();
  }, [
    subAdminHistory.currentPage,
    subAdminHistory.totalEntries,
    debouncedSearchTerm,
    statusFilter,
  ]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // const handlePageChange = (pageNumber) => {
  //   setSubAdminHistory((prev) => ({ ...prev, currentPage: pageNumber }));
  // };
  const handlePageChange = (page) => {
    if (page >= 1 && page <= subAdminHistory?.totalPages) {
      setSubAdminHistory((prev) => ({
        ...prev,
        currentPage: page,
      }));
    }
  };
  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  let startIndex = Math.min(
    (Number(subAdminHistory.currentPage) - 1) *
      Number(subAdminHistory.totalEntries) +
      1,
    Number(subAdminHistory.totalData)
  );

  let endIndex = Math.min(
    Number(subAdminHistory.currentPage) * Number(subAdminHistory.totalEntries),
    Number(subAdminHistory.totalData)
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
              Sub-Admin History
            </h3>
          </div>

          <div className="card-body">
            {/* Search and Entries Selection */}
            <div className="row mb-4">
              <div className="col-md-6 position-relative">
                <div
                  className="d-flex align-items-center"
                  style={{ position: "relative" }}
                >
                  <div style={{ position: "relative", flexGrow: 1 }}>
                    {/* Search Icon */}

                    <FaSearch
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "15px",
                        transform: "translateY(-50%)",
                        color: "#3E5879",
                        fontSize: "18px",
                      }}
                    />

                    {/* Search Input */}
                    <input
                      type="text"
                      className="form-control fw-bold"
                      placeholder="Search By Market Name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        paddingLeft: "40px",
                        paddingRight: searchTerm ? "35px" : "15px",
                        borderRadius: "30px",
                        border: "2px solid #3E5879",
                        width: "100%",
                      }}
                    />

                    {/* Clear Search Icon */}
                    {searchTerm && (
                      <FaTimes
                        onClick={handleClearSearch}
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "15px",
                          transform: "translateY(-50%)",
                          color: "#6c757d",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                      />
                    )}
                  </div>
                  {/* Dropdown for status selection */}
                  <select
                    className="form-select ms-3 fw-bold"
                    style={{
                      width: "150px",
                      borderRadius: "30px",
                      border: "2px solid #3E5879",
                    }}
                    value={statusFilter}
                    onChange={handleStatusChange}
                  >
                    <option value="">Select Status</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Entries Dropdown */}
              <div className="col-md-6 text-end">
                <label className="me-2 fw-bold">Show</label>
                <select
                  className="form-select d-inline-block w-auto"
                  style={{
                    borderRadius: "50px",
                    border: "2px solid #3E5879",
                  }}
                  onChange={(e) =>
                    setSubAdminHistory((prev) => ({
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
            </div>

            {/* Table */}
            <SingleCard
              className="mb-5 text-center"
              style={{
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 1)",
              }}
            >
              <div className="table-responsive">
                <table
                  className="table table-striped table-hover text-center"
                  style={{
                    borderRadius: "50px",
                    border: "2px solid #3E5879",
                  }}
                >
                  <thead className="table-primary text-uppercase">
                    <tr>
                      <th>Serial No.</th>
                      <th>Market Name</th>
                      <th>Status</th>
                      {/* <th>Remark</th> */}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subAdminHistory.subAdminHistory?.length > 0 ? (
                      subAdminHistory.subAdminHistory.map(
                        (subHistory, index) => (
                          <React.Fragment key={index}>
                            <tr>
                              <td>{startIndex + index}</td>
                              <td>{subHistory.marketName}</td>
                              <td>{subHistory.status}</td>
                              {/* <td>{subHistory.remarks}</td> */}
                              <td>
                                <button
                                  className={`btn fw-bold ${
                                    subHistory.status === "Pending"
                                      ? "btn-danger opacity-50"
                                      : "btn-primary"
                                  }`}
                                  onClick={() =>
                                    toggleAccordion(
                                      index,
                                      subHistory.status,
                                      subHistory.runnerName,
                                      subHistory.remarks
                                    )
                                  }
                                >
                               
                                  {subAdminHistory.openRowIndex === index
                                    ? "Hide Details"
                                    : "View Details"}
                                </button>
                              </td>
                            </tr>
                            {subAdminHistory.openRowIndex === index && (
                              <tr>
                                <td colSpan="5">
                                  <div key={index} className="accordion-body">
                                    {/* <h5 className="fw-bold">{subHistory.marketName}</h5>  */}
                                    <table className="table table-bordered">
                                      <thead className="table-secondary">
                                        <tr>
                                          <th>Runner Name</th>
                                          <th>Remark</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>{subAdminHistory.runnerName}</td>
                                          <td>{subAdminHistory.remarks}</td>
                                        </tr>
                                        {/* {subHistory.runnerName?.length === 2 ? (
                                          <tr>
                                            <td>
                                              {subHistory.runnerName.join(", ")}
                                            </td>
                                            <td>{subHistory.remarks}</td>
                                          </tr>
                                        ) : Array.isArray(
                                            subHistory.runnerName
                                          ) &&
                                          subHistory.runnerName.length > 0 ? (
                                          subHistory.runnerName.map(
                                            (runner, runnerIndex) => (
                                              <tr key={runnerIndex}>
                                                <td>{runner}</td>
                                                <td>{subHistory.remarks}</td>
                                              </tr>
                                            )
                                          )
                                        ) : (
                                          <tr>
                                            <td
                                              colSpan="2"
                                              className="text-danger fw-bold"
                                            >
                                              No Runners Available
                                            </td>
                                          </tr>
                                        )} */}
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
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
            {subAdminHistory?.subAdminHistory?.length > 0 && (
              <Pagination
                currentPage={subAdminHistory.currentPage}
                totalPages={subAdminHistory.totalPages}
                handlePageChange={handlePageChange}
                startIndex={startIndex}
                endIndex={endIndex}
                totalData={subAdminHistory.totalData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubAdminView;
