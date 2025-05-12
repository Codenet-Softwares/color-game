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
        {/* Row 1 (Mobile): Live Data + Select Game */}
        <div className="d-flex gap-2 mb-3">
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

<div className="text-center">
  <div className="mb-2 d-flex justify-content-center">
    <div className="w-75">
      <select
        className="form-select form-select-sm fw-bold mx-auto"
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

  <div className="mb-2 d-flex justify-content-center flex-column align-items-center">
    <label className="text-center">From:</label>
    <div className="w-75 ">
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
  </div>

  <div className="mb-2 d-flex justify-content-center flex-column align-items-center">
    <label className="text-center">To:</label>
    <div className="w-75">
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
  </div>

  <div className="d-flex justify-content-center">
    <div className="w-75">
      <button
        className="btn btn-primary w-100"
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
    </div>
  );
};

export default FilterBlock;
