import React from 'react';

const UserBetHistory = ({ data, SetComponent }) => {

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
                        SetComponent("ProfitAndLossRunner"); 
                    }}
                >
                    <i className="fas fa-arrow-left"></i> 
                </span>
            </div>

            {/* Button section for filtering bets (Back, Lay, Void) */}
            <div className="m-1 d-flex justify-content-end align-items-end">
                <button style={{ margin: "4px", backgroundColor: "lightBlue" }}>Back</button>
                <button style={{ margin: "4px", backgroundColor: "lightPink" }}>Lay</button>
                <button style={{ margin: "4px", backgroundColor: "white" }}>Void</button>
            </div>

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
                                        <th scope="col"><b>Sport Name</b></th>
                                        <th scope="col"><b>Event Name</b></th>
                                        <th scope="col"><b>Market Name</b></th>
                                        <th scope="col"><b>Selection Name</b></th>
                                        <th scope="col"><b>Bet Type</b></th>
                                        <th scope="col"><b>User Price</b></th>
                                        <th scope="col"><b>Amount</b></th>
                                        <th scope="col"><b>Profit/Loss</b></th>
                                        <th scope="col"><b>Place Date</b></th>
                                        <th scope="col"><b>Match Date</b></th>
                                    </tr>
                                    {/* Render bet history data if available */}
                                    {data?.data?.length > 0 ? (
                                        data?.data?.map((data, index) => (
                                            <tr key={index} align="center">
                                                <td>{data?.gameName}</td> 
                                                <td className="text-primary fw-bold" style={{ cursor: "pointer" }}>
                                                    {data?.marketName}
                                                </td>
                                                <td>{"Winner"}</td> 
                                                <td>{data?.runnerName}</td> 
                                                <td>{data?.type}</td> 
                                                <td>{data?.rate}</td> 
                                                <td>{data?.value}</td> 
                                                <td>
                                                    <span className='text-success mx-1'>{data?.bidAmount}</span>
                                                    <span className='text-danger'>(-{data?.value})</span>
                                                </td>
                                                <td>{formatDate(data?.placeDate)}</td> 
                                                <td>{formatDate(data?.matchDate)}</td> 
                                            </tr>
                                        ))
                                    ) : (
                                        // Display message if no data is available
                                        <tr align="center">
                                            <td colSpan="10"> {/* Fixed typo from colspan="10" to colSpan="10" */}
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

export default UserBetHistory;
