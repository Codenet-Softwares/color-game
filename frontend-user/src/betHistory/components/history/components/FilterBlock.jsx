import React from "react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

const FilterBlock = ({
  handleGetHistory,
  getHistoryForLotteryBetHistory,
  betHistoryData,
  handleBetHistorySelectionMenu,
  handleDateValue,
}) => {
  return (
    <div
      className="card shadow p-3 mb-5 rounded"
      style={{ marginTop: "150px", background: "#2CB3D1" }}
    >
<div className="card-body">
  {/* First Row: Live Data, Select Game, Select Menu */}
<div className="d-flex flex-column flex-md-row gap-2">
  {/* Live Data & Select Game: Always together */}
  <div className="d-flex flex-row w-100 gap-2">
    <div className="w-50">
      <select
        className="form-select form-select-sm fw-bold"
        name="dataSource"
        value={betHistoryData.dataSource}
        onChange={handleBetHistorySelectionMenu}
      >
        <option value="live" className="fw-bold">Live Data</option>
        <option value="backup" className="fw-bold">Back Data</option>
        <option value="olddata" className="fw-bold">Old Data</option>
      </select>
    </div>
    <div className="w-50">
      <select
        className="form-select form-select-sm fw-bold"
        name="selectGame"
        value={betHistoryData.selectGame || ""}
        onChange={handleBetHistorySelectionMenu}
      >
        <option value="">Select Game</option>
        {betHistoryData.gameSelectionData.map((game, index) => (
          <option key={index} value={game.gameId}>{game.gameName}</option>
        ))}
        <option value="lottery">Lottery</option>
      </select>
    </div>
  </div>

  {/* Select Menu: Below in mobile, inline in desktop */}
  <div className="w-75 w-md-25 mt-md-0">
    <select
      className="form-select form-select-sm fw-bold "
      name="selectMenu"
      value={betHistoryData.selectMenu}
      onChange={handleBetHistorySelectionMenu}
    >
      <option className="fw-bold">Open this select menu</option>
      <option value="void" className="fw-bold">Void</option>
      <option value="settle" className="fw-bold">Settle</option>
      <option value="unsettle" className="fw-bold">Unsettle</option>
    </select>
  </div>
</div>


  {/* Second Row: From Date, To Date, Get History Button */}
  <div className="d-flex flex-column flex-md-row gap-2 align-items-md-end m-0">
    <div className="w-100 w-md-25 m-0">
      <label className="form-label">From:</label>
      <Datetime
        value={betHistoryData.startDate}
        name="startDate"
        dateFormat="DD-MM-YYYY"
        onChange={(e) => handleDateValue("startDate", moment(e).toDate())}
        timeFormat="HH:mm"
        isValidDate={(current) => current.isBefore(new Date())}
        closeOnSelect={true}
        inputProps={{
          readOnly: true,
          onKeyDown: (e) => e.preventDefault(),
          style: {
            cursor: "pointer",
            backgroundColor: "#f3f3f3",
          },
        }}
      />
    </div>
    <div className="w-100 w-md-25">
      <label className="form-label">To:</label>
      <Datetime
        value={betHistoryData.endDate}
        name="endDate"
        dateFormat="DD-MM-YYYY"
        onChange={(e) => handleDateValue("endDate", moment(e).toDate())}
        timeFormat="HH:mm"
        isValidDate={(current) => current.isBefore(new Date())}
        closeOnSelect={true}
        inputProps={{
          readOnly: true,
          onKeyDown: (e) => e.preventDefault(),
          style: {
            cursor: "pointer",
            backgroundColor: "#f3f3f3",
          },
        }}
      />
    </div>
    <div className="w-100 w-md-25">
      <button
        className="btn btn-primary w-100 mt-3 mt-md-0"
        onClick={() =>
          betHistoryData.selectGame === "lottery"
            ? getHistoryForLotteryBetHistory()
            : handleGetHistory()
        }
        disabled={!betHistoryData.selectGame}
      >
        Get History
      </button>
    </div>
  </div>
</div>



    </div>
  );
};

export default FilterBlock;