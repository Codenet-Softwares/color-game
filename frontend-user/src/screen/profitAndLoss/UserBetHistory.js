import React from "react";
import Pagination from "../common/Pagination";
// import { capitalizeEachWord } from "../../utils/helper";
const UserBetHistory = ({ data, SetComponent, handlePageChange }) => {


  const formatDate = (isoString) => {
    const date = new Date(isoString);

    // Extract year, month, day, hours, minutes, and seconds
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Format the date as "YYYY-MM-DD HH:mm:ss"
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const startIndex = Math.min((data.currentPage - 1) * data.itemPerPage + 1);
  const endIndex = Math.min(
    data.currentPage * data.itemPerPage,
    data.totalData
  );

  return (
    <div className="card w-100 rounded" style={{ marginTop: "100px" }}>
      {/* Header section with title and back button */}
      <div
        className="card-header text-white p-2 d-flex justify-content-between align-items-center text-uppercase border-bottom-0 border-4 border-dark border-top"
        style={{ backgroundColor: "#253b4a" }}
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

      <div className="m-1 row g-2 d-flex justify-content-end d-md-flex justify-content-md-end d-sm-flex justify-content-sm-center">
        <div className="col-auto">
          <button className="btn text-white fw-bold" style={{ backgroundColor: "#80C2F1" }}>
            Back
          </button>
        </div>
        <div className="col-auto">
          <button className="btn text-white fw-bold" style={{ backgroundColor: "#FAA9BA" }}>
            Lay
          </button>
        </div>
        <div className="col-auto">
          <button className="btn btn-light fw-bold text-white bg-danger">
            Void
          </button>
        </div>
      </div>
      {/* Main table section that displays bet history */}
      <div className="table-responsive">
        <table className="table lms_table_active3 table-bordered text-center" >
          <thead>
            {/* Table header */}
            <tr>
              <th>
                Sport Name
              </th>
              <th>
                Event Name
              </th>
              <th>
                Market Name
              </th>
              <th>
                Selection Name
              </th>
              <th>
                Bet Type
              </th>
              <th>
                User Price
              </th>
              <th>
                Amount
              </th>
              <th>
                Profit/Loss
              </th>
              <th>
                Place Date
              </th>
              <th>
                Match Date
              </th>
            </tr>
          </thead>
          {/* Render bet history data if available */}
          <tbody>
            {data?.data?.length > 0 ? (
              data?.data?.map((data, index) => (
                <tr key={index} align="center" className="PL_table_bg">
                  <td style={{background:"#72BBEF"}}>{data?.gameName}</td>
                  <td
                    className="fw-bold"
                    style={{ cursor: "pointer",background:"#72BBEF" }}
                  >
                    {data?.marketName}
                  </td>
                  <td style={{background:"#72BBEF"}}>{"Winner"}</td>
                  <td style={{background:"#72BBEF"}}>{data?.runnerName}</td>
                  <td style={{background:"#72BBEF"}}>{data?.type}</td>
                  <td style={{background:"#72BBEF"}}>{data?.rate}</td>
                  <td style={{background:"#72BBEF"}}>{data?.value}</td>
                  <td style={{background:"#72BBEF"}}>
                    <span className="text-success mx-1">{data?.bidAmount}</span>
                    <span className="text-danger">(-{data?.value})</span>
                  </td>
                  <td style={{background:"#72BBEF"}}>{formatDate(data?.placeDate)}</td>
                  <td style={{background:"#72BBEF"}}>{formatDate(data?.matchDate)}</td>
                </tr>
              ))
            ) : (
              // Display message if no data is available
              <tr align="center">
                <td colSpan="10">
                  {" "}
                  {/* Fixed typo from colspan="10" to colSpan="10" */}
                  <div className="alert alert-danger fw-bold" role="alert">
                    No Data Found !!
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {data?.data?.length > 0 && (
        <div className="d-flex justify-content-center p-2">
          <Pagination
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            handlePageChange={handlePageChange}
            startIndex={startIndex}
            endIndex={endIndex}
            totalData={data.totalData}
          />
        </div>
      )}
    </div>
  );
};

export default UserBetHistory;
