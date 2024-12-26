import React, { useState } from 'react';
import { formatDateForUi } from '../../utils/helper';

const UserLotteryBetHistory = ({ data, SetComponent }) => {

    const formatDate = (isoString) => {
        const date = new Date(isoString);

        // Extract year, month, day, hours, minutes, and seconds
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // Format the date as "YYYY-MM-DD HH:mm:ss"
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const toggleDropdown = (id) => {
        setDropdownOpen(dropdownOpen === id ? null : id);
    };

    return (
        <div className="card w-100 rounded">
            {/* Header section with title and back button */}
            <div
                className="card-header text-white p-1 d-flex justify-content-between"
                style={{ backgroundColor: "#2CB3D1" }}
            >
                <b>&nbsp;&nbsp;Bet History</b>
                <span
                    style={{ cursor: "pointer" }}
                    title="Back"
                    onClick={() => {
                        SetComponent("ProfitAndLossLotteryEvent");
                    }}
                >
                    <i className="fas fa-arrow-left"></i>
                </span>
            </div>

            {/* Button section for filtering bets (Back, Lay, Void) */}
            {/* <div className="m-1 d-flex justify-content-end align-items-end">
                <button style={{ margin: "4px", backgroundColor: "lightBlue" }}>Back</button>
                <button style={{ margin: "4px", backgroundColor: "lightPink" }}>Lay</button>
                <button style={{ margin: "4px", backgroundColor: "white" }}>Void</button>
            </div> */}

            {/* Main table section that displays bet history */}
            <ul className="list-group list-group-flush" style={{ overflowX: "auto" }}>
                <li className="list-group-item">
                    <div className="QA_section">
                        <div className="QA_table mb_30" style={{ overflowX: "auto" }}>
                            <table className="table lms_table_active3 table-bordered">
                                <thead>
                                    {/* Table header */}
                                    <tr
                                        style={{
                                            backgroundColor: "#e6e9ed",
                                            color: "#5562a3",
                                        }}
                                        align="center"
                                    >
                                        <th scope="col">
                                            <b>Sport Name</b>
                                        </th>
                                        <th scope="col">
                                            <b>Event</b>
                                        </th>
                                        <th scope="col">
                                            <b>Market</b>
                                        </th>
                                        <th scope="col">
                                            <b>Ticket</b>
                                        </th>
                                        <th scope="col">
                                            <b>Sem</b>
                                        </th>
                                        <th scope="col">
                                            <b>Ticket Price</b>
                                        </th>
                                        <th scope="col">
                                            <b>Amount</b>
                                        </th>
                                        <th scope="col">
                                            <b>Place Time</b>
                                        </th>
                                        <th scope="col">
                                            <b>Settle Time</b>
                                        </th>
                                    </tr>
                                    {data?.data?.length > 0 ? (
                                        data?.data?.map((data, index) => (
                                            <tr key={index}
                                                align="center"
                                                style={{ backgroundColor: "#accafa" }}>
                                                <td>{data?.gameName}</td>
                                                <td>{data?.marketName}</td>
                                                <td>{"WINNER"}</td>
                                                <td>
                                                    <div className="dropdown" style={{ position: "relative" }}>
                                                        <button
                                                            className="btn btn-link dropdown-toggle"
                                                            type="button"
                                                            onClick={() => toggleDropdown(index)}
                                                        >
                                                            View Tickets
                                                        </button>
                                                        <div
                                                            className="custom-dropdown-content"
                                                            style={{
                                                                height: dropdownOpen === index ? "200px" : "0",
                                                                overflow: dropdownOpen === index ? "auto" : "hidden",
                                                                transition: "height 0.3s ease",
                                                                background: "white",
                                                                border: "1px solid #ccc",
                                                                borderRadius: "4px",
                                                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                                                            }}
                                                        >
                                                            {dropdownOpen === index && (
                                                                <div
                                                                    style={{
                                                                        maxHeight: "200px",

                                                                        padding: "10px",
                                                                    }}
                                                                >
                                                                    <span style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                                                                        Ticket Numbers:
                                                                    </span>
                                                                    <hr style={{ margin: "5px 0", borderColor: "#ddd" }} />
                                                                    {data?.tickets?.length > 0 ? (
                                                                        data?.tickets?.map((number, i) => (
                                                                            <span
                                                                                key={i}
                                                                                style={{
                                                                                    display: "block",
                                                                                    padding: "5px 10px",
                                                                                    borderBottom: "1px solid #eee",
                                                                                    color: "#333",
                                                                                }}
                                                                            >
                                                                                {number}
                                                                            </span>
                                                                        ))
                                                                    ) : (
                                                                        <span style={{ color: "#999", fontStyle: "italic" }}>
                                                                            No ticket numbers available
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                    </div>
                                                </td>
                                                <td>{data?.sem}</td>
                                                <td>{data?.ticketPrice}</td>
                                                <td className="fw-bold">{data?.amount}</td>
                                                <td>{formatDateForUi(data?.placeTime)}</td>
                                                <td>{formatDateForUi(data?.settleTime)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        // Display message if no data is available
                                        <tr align="center">
                                            <td colSpan="10">
                                                <div className="alert alert-info fw-bold" role="alert">
                                                    No Data Found !!
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </thead>
                            </table>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default UserLotteryBetHistory;
