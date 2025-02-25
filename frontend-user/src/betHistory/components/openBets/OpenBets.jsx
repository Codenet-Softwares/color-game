import React from "react";
import RenderBackTable from "./components/RenderBackTable";
import RenderLayTable from "./components/RenderLayTable";

const OpenBets = ({ betHistoryData, handleBetHistorySelectionMenu }) => {
  console.log("first", betHistoryData);
  return (
    <div className="card" style={{ height: "82vh", overflow: "hidden" }}>
      <div
        className="card-header"
        style={{
          backgroundColor: "#2CB3D1",
          color: "white",
          textAlign: "center",
        }}
      >
        <h5 className="card-title text-uppercase fw-bold">Open Bets</h5>
      </div>
      <div
        className="card-body"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(82vh - 56px)",
          overflow: "hidden",
        }}
      >
        <div className="form-group">
          <select
            className="form-select form-select-lg"
            id="selectMarket"
            name="selectColorGame"
            style={{ width: "100%" }}
            onChange={(e) => handleBetHistorySelectionMenu(e)}
          >
            <option value={""}>Select Sport Name</option>
            {betHistoryData?.openBetGameNames.map((item, index) => (
              <option key={index} value={item.marketId}>
                {item.marketName}
              </option>
            ))}
          </select>
        </div>

        {/* Render back and lay table if market is selected */}
        {betHistoryData?.selectColorGame.length > 0 &&
          betHistoryData?.selectColorGame !== "" && (
            <div
              style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                overflow: "hidden",
              }}
            >
              <div style={{ height: "35vh", overflowY: "auto" }}>
                <RenderBackTable betHistoryData={betHistoryData} />
              </div>
              <div
                className="mt-3"
                style={{ height: "35vh", overflowY: "auto" }}
              >
                <RenderLayTable betHistoryData={betHistoryData} />
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default OpenBets;
