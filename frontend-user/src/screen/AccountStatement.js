import React, { useEffect, useState } from "react";
import { getAccountStatement } from "../utils/getInitiateState";
import { getAccountstatement_api } from "../utils/apiService";
import Pagination from "./common/Pagination";
import DatePicker from "react-datepicker";
import { customErrorHandler } from "../utils/helper";
import AppDrawer from "./common/appDrawer";
import Layout from "./layout/layout";

const AccountStatement = () => {
  // Initialize state using getAccountStatement function
  const [getAccountstatement, setGetAccountstatement] = useState(
    getAccountStatement()
  );

  // Separate state for date handling
  const [backupDate, setbackupDate] = useState({
    startDate: null,
    endDate: null,
  });

  // Format the date to "YYYY-MM-DD" for API requests
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Function to call the API and update state with the response
  async function fetchAccountStatement() {
    try {
      const response = await getAccountstatement_api({
        pageNumber: getAccountstatement.currentPage,
        dataLimit: getAccountstatement.totalEntries,
        fromDate: getAccountstatement.startDate,
        toDate: getAccountstatement.endDate,
        dataSource: getAccountstatement.dataSource,
      });

      // If the API call is successful, update the state with statement data
      setGetAccountstatement((prevState) => ({
        ...prevState,
        statement: response?.data,
        totalPages: response?.pagination?.totalPages,
        totalData: response?.pagination?.totalItems,
      }));
    } catch (error) {
      customErrorHandler(error); // Custom error handling
    }
  }

  const startIndex = Math.min((getAccountstatement.currentPage - 1) * 10 + 1);
  const endIndex = Math.min(
    getAccountstatement.currentPage * 10,
    getAccountstatement.totalData
  );

  // UseEffect to trigger fetchAccountStatement whenever the dependencies change
  useEffect(() => {
    fetchAccountStatement();
  }, [
    getAccountstatement.currentPage,
    getAccountstatement.totalEntries,
    getAccountstatement.startDate,
    getAccountstatement.endDate,
    getAccountstatement.dataSource,
  ]);

  // Functions to update backup date state when a new date is picked
  const setStartDate = (date) => {
    setbackupDate((prevState) => ({ ...prevState, startDate: date }));
  };

  const setEndDate = (date) => {
    setbackupDate((prevState) => ({ ...prevState, endDate: date }));
  };

  // Function to format date for UI display
  function formatDateForUi(dateString) {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }

  // When 'Get Statement' button is clicked, update the main state with the formatted date
  const handleGetDate = () => {
    setGetAccountstatement((prevState) => ({
      ...prevState,
      startDate: formatDate(backupDate.startDate),
      endDate: formatDate(backupDate.endDate),
      currentPage: 1, // Reset to first page when fetching data by date
    }));
  };

  return (
    <>
      <AppDrawer showCarousel={false}>
        <Layout />
        <div style={{ marginTop: "150px" }}>
          <div className="d-flex justify-content-center px-2">
            <div className="card w-100 rounded">
              {/* Card Header */}
              <div
                className="card-header text-white p-2 text-uppercase text-center"
                style={{ backgroundColor: "#2CB3D1" }}
              >
                <b className="h5 fw-bold">&nbsp;&nbsp;Account Statement</b>
              </div>

              <div className="form-group mb-3 px-2 mt-2 fw-bold">
                <div className="container-fluid">
                  <div className="row g-sm-1 align-items-end justify-content-center text-center">
                     {/* Total Entries */}
                    <div className="col-12 col-sm-2 col-md-2 me-sm-3 mb-3 mb-sm-0">
                    <label className="fw-bold d-block">Total Entries</label>
                    <select
                        className="form-select form-select-sm w-100 m-1 fw-bold"
                        onChange={(e) =>
                          setGetAccountstatement((prevState) => ({
                            ...prevState,
                            totalEntries: e.target.value,
                            currentPage: 1, 
                          }))
                        }
                      >
                        <option value="10">10 entries</option>
                        <option value="25">25 entries</option>
                        <option value="50">50 entries</option>
                        <option value="100">100 entries</option>
                      </select>
                    </div>
                      {/* Data Source */}
                    <div className="col-12 col-sm-2 col-md-2 mb-3 mb-sm-0">
                    <label className="fw-bold d-block">Data Source</label>
                    <select
                        className="form-select form-select-sm w-100 fw-bold"
                        onChange={(e) => {
                          setGetAccountstatement((prevState) => ({
                            ...prevState,
                            dataSource: e.target.value,
                            startDate: "",
                            endDate: "",
                          }));
                          setbackupDate((prev) => ({
                            ...prev,
                            startDate: null,
                            endDate: null,
                          }));
                        }}
                      >
                        <option value="live" selected>
                          LIVE DATA
                        </option>
                        <option value="backup">BACKUP DATA</option>
                        <option value="olddata">OLD DATA</option>
                      </select>
                    </div>
                    {/* Start Date */}
                    <div className="col-12 col-sm-2 col-md-2 mb-3 mb-sm-0">
                    <label className="fw-bold d-block">From</label>
                    <DatePicker
                        selected={backupDate.startDate}
                        onChange={setStartDate}
                        disabled={getAccountstatement.dataSource === "live"} // Disable if live data
                        placeholderText="Select Start Date"
                        className="form-control form-control-sm w-100"
                      />
                    </div>
                      {/* End Date */}
                    <div className="col-12 col-sm-2 col-md-2 mb-3 mb-sm-0">
                    <label className="fw-bold d-block">To</label>
                    <DatePicker
                        selected={backupDate.endDate}
                        onChange={setEndDate}
                        disabled={getAccountstatement.dataSource === "live"} // Disable if live data
                        placeholderText="Select Start Date"
                        className="form-control form-control-sm w-100"
                      />
                    </div>
                     {/* Get Statement Button */}
                     <div className="col-12 col-sm-2 col-md-2 d-flex align-items-end mb-3 mb-sm-0">
                      <button
                        className="btn btn-primary w-100"
                        disabled={
                          !backupDate.startDate || !backupDate.endDate // Disable button if no dates selected
                        }
                        onClick={handleGetDate}
                      >
                        Get Statement
                      </button>
                    </div>
                  </div>
                </div>              
              </div>

              {/* Transaction Table */}
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <div className="white_card_body">
                    <div className="QA_section">
                      <div className="QA_table mb-3">
                        <div className="table-responsive"
                         style={{
                            overflowX: "auto",
                            WebkitOverflowScrolling: "touch",
                            whiteSpace: "nowrap",
                          }}
                        >
                        <table className="table lms_table_active3 table-bordered text-center">
                          <thead>
                            <tr
                              style={{ backgroundColor: "#e6e9ed" }}
                              align="center"
                            >
                              <th scope="col">
                                <h6 className="fw-bold">Date/Time</h6>
                              </th>
                              <th scope="col">
                                <h6 className="fw-bold">Deposit</h6>
                              </th>
                              <th scope="col">
                                <h6 className="fw-bold">Withdraw</h6>
                              </th>
                              <th scope="col">
                                <h6 className="fw-bold">Balance</h6>
                              </th>
                              <th scope="col">
                                <h6 className="fw-bold">Remark</h6>
                              </th>
                              <th scope="col">
                                <h6 className="fw-bold">From &rarr; To</h6>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Loop through statement data */}
                            {getAccountstatement?.statement?.map(
                              (transaction) => (
                                <tr key={transaction._id} align="center">
                                  <td>{formatDateForUi(transaction.date)}</td>
                                  <td>
                                    {transaction.transactionType === "credit" ||
                                    transaction.transactionType ===
                                      "deposit" ? (
                                      <span className="fw-bold text-success">
                                        {transaction.amount}
                                      </span>
                                    ) : null}
                                  </td>
                                  <td>
                                    {transaction.transactionType ===
                                    "withdrawal" ? (
                                      <span className="text-danger fw-bold">
                                        {transaction.amount}
                                      </span>
                                    ) : null}
                                  </td>
                                  <td className="fw-bold">
                                    {transaction.balance}
                                  </td>
                                  <td>{transaction.remarks}</td>
                                  <td>
                                    {transaction.hasOwnProperty(
                                      "transferFromUserAccount"
                                    ) &&
                                    transaction.hasOwnProperty(
                                      "transferToUserAccount"
                                    )
                                      ? `${transaction.transferFromUserAccount} → ${transaction.transferToUserAccount}`
                                      : "Self-Transaction"}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                        </div>
                      
                      </div>
                    </div>

                    {/* No Data Found Message */}
                    {getAccountstatement?.statement?.length === 0 && (
                      <div
                        className="alert text-dark bg-light mt-3"
                        role="alert"
                      >
                        <div className="alert-text d-flex justify-content-center text-danger">
                          <b> &#128680; No Data Found !! </b>
                        </div>
                      </div>
                    )}
                  </div>
                </li>

                {/* Pagination */}
                {getAccountstatement?.statement?.length > 0 && (
                  <li className="list-group-item overflow-auto">
                    <Pagination
                      currentPage={getAccountstatement.currentPage}
                      totalPages={getAccountstatement.totalPages}
                      handlePageChange={(newPage) =>
                        setGetAccountstatement((prevState) => ({
                          ...prevState,
                          currentPage: newPage,
                        }))
                      }
                      startIndex={startIndex}
                      endIndex={endIndex}
                      totalData={getAccountstatement.totalData}
                    />
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </AppDrawer>
    </>
  );
};

export default AccountStatement;
