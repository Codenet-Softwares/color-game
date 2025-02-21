import React from "react";

const RenderBackTable = ({ betHistoryData }) => {
  return (
    <div
      className="card shadow p-3 mb-5 rounded"
      style={{ backgroundColor: "#cfe2f3" }}
    >
      <div className="card-body">
        <div className="table-responsive ">
          <table className="table table-striped table-sm">
            {/* Table header */}
            <thead>
              <tr align="center fs-6">
                <th className="d-none d-sm-table-cell">Back</th>
                <th className="d-none d-sm-table-cell">Odds</th>
                <th className="d-none d-sm-table-cell">Stake</th>
                <th className="d-none d-sm-table-cell">Profit</th>
                <th className="d-table-cell d-sm-none">Details</th>
              </tr>
            </thead>
            {/* Table body - data to be filled dynamically */}
            <tbody>
              {/* Insert rows for back bets */}
              {betHistoryData?.openBet.filter((item) => item.type === "back")
                .length > 0 ? (
                openBet
                  .filter((item) => item.type === "back")
                  .map((item, index) => (
                    <tr key={index} align="center">
                      {/* Show for larger screens */}
                      <td className="d-none d-sm-table-cell">
                        {item.runnerName}
                      </td>
                      <td className="d-none d-sm-table-cell">{item.rate}</td>
                      <td className="d-none d-sm-table-cell">{item.value}</td>
                      <td className="d-none d-sm-table-cell">
                        {Math.round(item.value)}(-
                        {Math.round(item.bidAmount)})
                      </td>

                      {/* Show for smaller screens */}
                      <td className="d-table-cell d-sm-none">
                        <div>
                          <strong>Back (Bet For):</strong> {item.runnerName}
                        </div>
                        <div>
                          <strong>Odds:</strong> {item.rate}
                        </div>
                        <div>
                          <strong>Stake:</strong> {item.value}
                        </div>
                        <div>
                          <strong>Profit:</strong> {Math.round(item.value)}
                          (-
                          {Math.round(item.bidAmount)})
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="5" align="center">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RenderBackTable;
