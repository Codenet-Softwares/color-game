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
      className="card shadow p-3 mb-5  rounded"
      style={{ marginTop: "150px", background: "#2CB3D1" }}
    >
      <div className="card-body">
        <div className="row">
          <div className="col">
            <div className="form-group">
              <select
                className="form-select form-select-sm fw-bold"
                aria-label=".form-select-sm example"
                name="dataSource"
                value={betHistoryData.dataSource}
                onChange={(e) => handleBetHistorySelectionMenu(e)}
              >
                <option className="fw-bold" value="live" selected>
                  Live Data
                </option>
                <option value="backup" className="fw-bold">
                  Back Data
                </option>
                <option value="olddata" className="fw-bold">
                  Old Data
                </option>
              </select>
            </div>
          </div>

          <div className="col-auto">&nbsp;</div>

          <div className="col">
            <div className="form-group ">
              <select
                className="form-select form-select-sm fw-bold"
                aria-label=".form-select-sm example"
                name="selectGame"
                value={betHistoryData.selectGame || ""}
                onChange={(e) => handleBetHistorySelectionMenu(e)}
              >
                <option value="" className="">
                  {" "}
                  Select Game{" "}
                </option>
                {betHistoryData.gameSelectionData.map((game, index) => (
                  <option className="" key={index} value={game.gameId}>
                    {game.gameName}
                  </option>
                ))}
                <option value="lottery" className="">
                  Lottery
                </option>
              </select>
            </div>
          </div>

          <div className="col-auto">&nbsp;</div>

          <div className="col">
            <div className="form-group">
              <select
                className="form-select form-select-sm fw-bold"
                aria-label=".form-select-sm example"
                name="selectMenu"
                value={betHistoryData.selectMenu}
                onChange={(e) => handleBetHistorySelectionMenu(e)}
              >
                <option selected className="fw-bold">
                  Open this select menu
                </option>
                <option value="void" className="fw-bold">
                  Void
                </option>
                <option value="settle" className="fw-bold">
                  Settle
                </option>
                <option value="unsettle" className="fw-bold">
                  Unsettle
                </option>
              </select>
            </div>
          </div>
        </div>
        {console.log("first====>", betHistoryData.dataSource)}
        {/* {dateVisible && ( */}
        <div className="row align-items-center">
          <div className="col">
            <div className="form-group">
              <label className="">From:</label>
              <div className="input-group" style={{ maxWidth: "100%" }}>
                <Datetime
                  value={betHistoryData.startDate}
                  name="startDate"
                  dateFormat="DD-MM-YYYY"
                  disabled={betHistoryData.dataSource === "live"}
                  onChange={(e) =>
                    handleDateValue("startDate", moment(e).toDate())
                  }
                  timeFormat="HH:mm"
                  isValidDate={(current) => current.isBefore(new Date())}
                  closeOnSelect={true}
                  inputProps={{
                    readOnly: true, // Prevents manual typing
                    disabled: betHistoryData.dataSource === "live",
                    onKeyDown: (e) => e.preventDefault(), // Disables keyboard input
                    style: {
                      cursor: "pointer",
                      backgroundColor: "#f3f3f3",
                    }, // Optional: Styling
                  }}
                />
              </div>
            </div>
          </div>

          <div className="col">
            <div className="form-group">
              <label className="">To:</label>
              <div className="input-group" style={{ maxWidth: "100%" }}>
                <Datetime
                  value={betHistoryData.endDate}
                  name="endDate"
                  dateFormat="DD-MM-YYYY"
                  onChange={(e) =>
                    handleDateValue("endDate", moment(e).toDate())
                  }
                  timeFormat="HH:mm"
                  isValidDate={(current) => current.isBefore(new Date())}
                  closeOnSelect={true}
                  inputProps={{
                    readOnly: true, // Prevents manual typing
                    disabled: betHistoryData.dataSource === "live",
                    onKeyDown: (e) => e.preventDefault(), // Disables keyboard input
                    style: {
                      cursor: "pointer",
                      backgroundColor: "#f3f3f3",
                    }, // Optional: Styling
                  }}
                />
              </div>
            </div>
          </div>

          <div className="col">
            <button
              className="btn btn-primary "
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
        {/* )} */}
      </div>
    </div>
  );
};

export default FilterBlock;
