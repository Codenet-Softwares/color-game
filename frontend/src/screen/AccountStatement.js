import React, { useEffect, useState } from 'react';
import { getAccountStatement } from '../utils/getInitiateState';
import { getAccountstatement_api } from '../utils/apiService';
import Pagination from './common/Pagination';
import DatePicker from "react-datepicker";
import { customErrorHandler } from '../utils/helper';
import AppDrawer from './common/appDrawer';
import Layout from './layout/layout';

const AccountStatement = () => {
    // Initialize state using getAccountStatement function
    const [getAccountstatement, setGetAccountstatement] = useState(getAccountStatement());

    // Separate state for date handling
    const [backupDate, setbackupDate] = useState({
        startDate: null,
        endDate: null
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
    const endIndex = Math.min(getAccountstatement.currentPage * 10, getAccountstatement.totalEntries);

    // UseEffect to trigger fetchAccountStatement whenever the dependencies change
    useEffect(() => {
        fetchAccountStatement();
    }, [getAccountstatement.currentPage, getAccountstatement.totalEntries, getAccountstatement.startDate, getAccountstatement.endDate, getAccountstatement.dataSource]);

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
            currentPage: 1 // Reset to first page when fetching data by date
        }));
    };

    return (
        <>
            <AppDrawer showCarousel={false}>
                <Layout />
                <div style={{ marginTop: "120px" }}>
                    <div className="d-flex justify-content-center m-5">
                        <div className="card w-100 rounded">
                            {/* Card Header */}
                            <div className="card-header text-white p-1" style={{ backgroundColor: "#2CB3D1" }}>
                                <b>&nbsp;&nbsp;Account Statement</b>
                            </div>

                            <div className="form-group mb-3 mb-md-0 px-2">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-sm">Total Entries</div>
                                        <div className="col-sm">Data Source</div>
                                        <div className="col-sm">From:</div>
                                        <div className="col-sm">To:</div>
                                        <div className="col-sm"></div>
                                    </div>
                                </div>
                                <div className="container">
                                    <div className="row">
                                        {/* Total Entries Dropdown */}
                                        <div className="col-sm">
                                            <select
                                                className="form-select form-select-sm w-50 m-1"
                                                onChange={(e) =>
                                                    setGetAccountstatement((prevState) => ({
                                                        ...prevState,
                                                        totalEntries: e.target.value,
                                                        currentPage: 1, // Reset to first page when entries per page change
                                                    }))
                                                }

                                            >
                                                <option value="10">10 entries</option>
                                                <option value="25">25 entries</option>
                                                <option value="50">50 entries</option>
                                                <option value="100">100 entries</option>
                                            </select>
                                        </div>

                                        {/* Data Source Dropdown */}
                                        <div className="col-sm">
                                            <select
                                                className="form-select form-select-sm w-50 m-1"
                                                onChange={(e) => {
                                                    setGetAccountstatement((prevState) => ({
                                                        ...prevState,
                                                        dataSource: e.target.value,
                                                        startDate: "",
                                                        endDate: ""
                                                    }));
                                                    setbackupDate((prev) => ({
                                                        ...prev, startDate: null, endDate: null
                                                    }));
                                                }}
                                            >
                                                <option value="live" selected>LIVE DATA</option>
                                                <option value="backup">BACKUP DATA</option>
                                                <option value="olddata">OLD DATA</option>
                                            </select>
                                        </div>

                                        {/* Start Date Picker */}
                                        <div className="col-sm">
                                            <DatePicker
                                                selected={backupDate.startDate}
                                                onChange={setStartDate}
                                                disabled={getAccountstatement.dataSource === "live"} // Disable if live data
                                                placeholderText="Select Start Date"
                                            />
                                        </div>

                                        {/* End Date Picker */}
                                        <div className="col-sm">
                                            <DatePicker
                                                selected={backupDate.endDate}
                                                onChange={setEndDate}
                                                disabled={getAccountstatement.dataSource === "live"} // Disable if live data
                                                placeholderText="Select End Date"
                                            />
                                        </div>

                                        {/* Get Statement Button */}
                                        <div className="col-sm">
                                            <button
                                                className="btn btn-primary mb-2"
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
                                            <div className="QA_table mb_30">
                                                <table className="table lms_table_active3 table-bordered">
                                                    <thead>
                                                        <tr style={{ backgroundColor: "#e6e9ed", color: "#5562a3" }} align="center">
                                                            <th scope="col"><b>Date/Time</b></th>
                                                            <th scope="col"><b>Deposit</b></th>
                                                            <th scope="col"><b>Withdraw</b></th>
                                                            <th scope="col"><b>Balance</b></th>
                                                            <th scope="col"><b>Remark</b></th>
                                                            <th scope="col"><b>From &rarr; To</b></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {/* Loop through statement data */}
                                                        {getAccountstatement?.statement?.map((transaction) => (
                                                            <tr key={transaction._id} align="center">
                                                                <td>{formatDateForUi(transaction.date)}</td>
                                                                <td>{transaction.transactionType === "credit" || transaction.transactionType === "deposit" ? <span className="fw-bold text-success">{transaction.amount}</span> : null}</td>
                                                                <td>{transaction.transactionType === "withdrawal" ? <span className="text-danger fw-bold">{transaction.amount}</span> : null}</td>
                                                                <td className="fw-bold">{transaction.balance}</td>
                                                                <td>{transaction.remarks}</td>
                                                                <td>
                                                                    {transaction.hasOwnProperty("transferFromUserAccount") && transaction.hasOwnProperty("transferToUserAccount")
                                                                        ? `${transaction.transferFromUserAccount} → ${transaction.transferToUserAccount}`
                                                                        : "Self-Transaction"}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* No Data Found Message */}
                                        {getAccountstatement?.statement?.length === 0 && (
                                            <div className="alert text-dark bg-light mt-3" role="alert">
                                                <div className="alert-text d-flex justify-content-center">
                                                    <b> &#128680; No Data Found !! </b>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </li>

                                {/* Pagination */}
                                {getAccountstatement?.statement?.length > 0 && (
                                    <li className="list-group-item">
                                        <Pagination
                                            currentPage={getAccountstatement.currentPage}
                                            totalPages={getAccountstatement.totalPages}
                                            handlePageChange={(newPage) => setGetAccountstatement((prevState) => ({ ...prevState, currentPage: newPage }))}
                                            startIndex={startIndex}
                                            endIndex={endIndex}
                                            totalData={getAccountstatement.totalEntries}
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
