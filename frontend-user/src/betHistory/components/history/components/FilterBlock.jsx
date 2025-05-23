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
      <div className="col-12">
        <div className="row">
          <div className="card-body">

            {/* First Row: Live Data, Select Game, Select Menu */}
            <div className="row g-2">
              {/* Live Data */}
              <div className="col-12 col-md-4">
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

              {/* Select Game */}
              <div className="col-12 col-md-4">
                <select
                  className="form-select form-select-sm fw-bold"
                  name="selectGame"
                  value={betHistoryData.selectGame || ""}
                  onChange={handleBetHistorySelectionMenu}
                >
                  <option value="">Select Game</option>
                  {betHistoryData.gameSelectionData.map((game, index) => (
                    <option key={index} value={game.gameId}>
                      {game.gameName}
                    </option>
                  ))}
                  <option value="lottery">Lottery</option>
                </select>
              </div>

              {/* Select Menu */}
              <div className="col-12 col-md-4">
                <select
                  className="form-select form-select-sm fw-bold"
                  name="selectMenu"
                  value={betHistoryData.selectMenu}
                  onChange={handleBetHistorySelectionMenu}
                >
                  <option className="fw-bold">Select menu</option>
                  <option value="void" className="fw-bold">Void</option>
                  <option value="settle" className="fw-bold">Settle</option>
                  <option value="unsettle" className="fw-bold">Unsettle</option>
                </select>
              </div>
            </div>

            {/* Second Row: From Date & To Date */}
            <div className="d-flex flex-column flex-md-row gap-1 align-items-md-end mt-3 text-center">
              <div className="col-md-6">
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
              <div className="col-md-6">
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
            </div>

            {/* Button Row */}
            <div className="col-md-6 d-flex align-items-center justify-content-center mx-auto mt-3">
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
