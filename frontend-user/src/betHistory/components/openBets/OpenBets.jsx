import React from "react";
import RenderBackTable from "./components/RenderBackTable";
import RenderLayTable from "./components/RenderLayTable";

const OpenBets = ({ betHistoryData, handleBetHistorySelectionMenu }) => {
  console.log("first", betHistoryData);
  return (
    <div className="card" style={{ overflowY: "auto", height: "82vh" }}>
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
      <div className="card-body">
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
              <option key={index} value={item.gameId}>
                {item.gameName}
              </option>
            ))}
          </select>
        </div>
        {console.log("first", betHistoryData)}
        {/* Render back  and laytable if market is selected */}
        {betHistoryData?.selectColorGame.length > 0 &&
          !betHistoryData?.selectColorGame == "" && (
            <>
              <RenderBackTable betHistoryData={betHistoryData} />
              <RenderLayTable betHistoryData={betHistoryData} />
            </>
          )}
      </div>
    </div>
  );
};

export default OpenBets;
