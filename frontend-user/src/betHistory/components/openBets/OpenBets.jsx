import React from "react";
import RenderBackTable from "./components/RenderBackTable";
import RenderLayTable from "./components/RenderLayTable";

const OpenBets = ({ betHistoryData, handleBetHistorySelectionMenu }) => {
  return (
    <div
      className="card border-bottom-0 rounded-0 px-0 py-3 "
      style={{ overflow: "hidden" }}
    >
      <div
        className="card-header"
        style={{
          backgroundColor: "#202020",
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
              <div>
                <RenderBackTable betHistoryData={betHistoryData} />
              </div>
              <div className="mt-2">
                <RenderLayTable betHistoryData={betHistoryData} />
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default OpenBets;
