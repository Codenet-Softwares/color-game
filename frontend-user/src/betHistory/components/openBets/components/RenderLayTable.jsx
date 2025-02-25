import React from "react";

const RenderLayTable = ({ betHistoryData }) => {
  console.log("first", betHistoryData);

  return (
    <div
      className="card shadow p-3 mb-5 rounded"
      style={{ backgroundColor: "#f8d7da" }}
    >
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-sm">
            {/* Table header */}
            <thead>
              <tr align="center">
                <th className="d-none d-sm-table-cell">Lay</th>
                <th className="d-none d-sm-table-cell">Odds</th>
                <th className="d-none d-sm-table-cell">Stake</th>
                <th className="d-none d-sm-table-cell">Liability</th>
                <th className="d-table-cell d-sm-none">Details</th>
              </tr>
            </thead>
           
            <tbody>
              {/* Insert rows for lay bets */}
              {betHistoryData?.openBet?.filter((item) => item?.type === "lay")
                ?.length > 0 ? (
                betHistoryData?.openBet
                  ?.filter((item) => item?.type === "lay")
                  ?.map((item, index) => (
                    <tr key={index} align="center">
                      {/* Show for larger screens */}
                      <td className="d-none d-sm-table-cell">
                        {item.runnerName}
                      </td>
                      <td className="d-none d-sm-table-cell">{item.rate}</td>
                      <td className="d-none d-sm-table-cell">{item.value}</td>
                      <td className="d-none d-sm-table-cell">
                        {Math.round(item.value)}(-{Math.round(item.bidAmount)})
                      </td>

                      {/* Show for smaller screens */}
                      <td className="d-table-cell d-sm-none">
                        <div>
                          <strong>Lay (Bet Against):</strong> {item.runnerName}
                        </div>
                        <div>
                          <strong>Odds:</strong> {item.rate}
                        </div>
                        <div>
                          <strong>Stake:</strong> {item.value}
                        </div>
                        <div>
                          <strong>Liability:</strong> {Math.round(item.value)}(-
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

export default RenderLayTable;
