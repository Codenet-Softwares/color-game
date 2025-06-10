import React, { useEffect, useState } from "react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import { capitalizeEachWord } from "../../../../utils/helper";
const FilterBlock = ({
  handleGetHistory,
  getHistoryForLotteryBetHistory,
  betHistoryData,
  handleBetHistorySelectionMenu,
  handleDateValue,
}) => {
  const [hasFetched, setHasFetched] = useState(false);
  const [dateError, setDateError] = useState("");

  const isAllFieldsSelected =
    betHistoryData.dataSource &&
    betHistoryData.selectGame &&
    betHistoryData.selectMenu;

  const isLiveData = betHistoryData.dataSource === "live";
  const isBackupOrOld =
    betHistoryData.dataSource === "backup" ||
    betHistoryData.dataSource === "olddata";

  const isDateValid = () => {
    if (!betHistoryData.startDate || !betHistoryData.endDate) return false;
    return !moment(betHistoryData.startDate).isAfter(
      moment(betHistoryData.endDate)
    );
  };

  const handleDateValueWrapper = (field, value) => {
    setHasFetched(false);
    handleDateValue(field, value);

    const { startDate, endDate } = {
      ...betHistoryData,
      [field]: value,
    };

    if (startDate && endDate && moment(startDate).isAfter(moment(endDate))) {
      setDateError("Start date cannot be after end date");
    } else {
      setDateError("");
    }
  };

  useEffect(() => {
    if (isLiveData && isAllFieldsSelected && !hasFetched) {
      if (betHistoryData.selectGame === "lottery") {
        getHistoryForLotteryBetHistory();
      } else {
        handleGetHistory();
      }
      setHasFetched(true);
    }

    if (isBackupOrOld && isAllFieldsSelected && isDateValid() && !hasFetched) {
      if (betHistoryData.selectGame === "lottery") {
        getHistoryForLotteryBetHistory();
      } else {
        handleGetHistory();
      }
      setHasFetched(true);
    }
  }, [
    betHistoryData.dataSource,
    betHistoryData.selectGame,
    betHistoryData.selectMenu,
    isAllFieldsSelected,
    // betHistoryData.startDate,
    // betHistoryData.endDate,
  ]);

  const isButtonDisabled = () => {
    if (!isAllFieldsSelected || dateError) return true;
    if (isLiveData) return true;
    if (
      isBackupOrOld &&
      (!betHistoryData.startDate || !betHistoryData.endDate || !isDateValid())
    ) {
      return true;
    }
    return false;
  };

  return (
    <div
      className="card shadow p-3 mb-5 rounded"
      style={{ marginTop: "85px", background: "#253b4a" }}
    >
      <div className="col-12">
        <div className="row">
          <div className="card-body">
            {/* First Row: Live Data, Select Game, Select Menu */}
            <div className="row g-2">
              <div className="col-12 col-md-4">
                <select
                  className="form-select form-select-sm fw-bold"
                  name="dataSource"
                  value={betHistoryData.dataSource}
                  onChange={(e) => {
                    setHasFetched(false);
                    handleBetHistorySelectionMenu(e);
                  }}
                >
                  <option value="live" className="fw-bold">
                    Live Data
                  </option>
                  <option value="backup" className="fw-bold">
                    Backup Data
                  </option>
                  <option value="olddata" className="fw-bold">
                    Old Data
                  </option>
                </select>
              </div>

              <div className="col-12 col-md-4">
                <select
                  className="form-select form-select-sm fw-bold"
                  name="selectGame"
                  value={betHistoryData.selectGame || ""}
                  onChange={(e) => {
                    setHasFetched(false);
                    handleBetHistorySelectionMenu(e);
                  }}
                >
                  <option value="">Select Game</option>
                  {betHistoryData.gameSelectionData.map((game, index) => (
                    <option key={index} value={game.gameId}>
                      {/* {game.gameName} */}
                      {capitalizeEachWord(game.gameName)}
                    </option>
                  ))}
                  <option value="lottery">Lottery</option>
                </select>
              </div>

              <div className="col-12 col-md-4">
                <select
                  className="form-select form-select-sm fw-bold"
                  name="selectMenu"
                  value={betHistoryData.selectMenu}
                  onChange={(e) => {
                    setHasFetched(false);
                    handleBetHistorySelectionMenu(e);
                  }}
                >
                  <option className="fw-bold">Select menu</option>
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

            {/* Second Row: From Date & To Date */}
            <div className="d-flex flex-column flex-md-row gap-1 align-items-md-end mt-3 text-center">
              <div className="col-md-6">
                <label className="form-label text-white">From:</label>
                <Datetime
                  value={betHistoryData.startDate}
                  name="startDate"
                  dateFormat="DD-MM-YYYY"
                  onChange={(e) =>
                    handleDateValueWrapper("startDate", moment(e).toDate())
                  }
                  timeFormat="HH:mm"
                  isValidDate={(current) => current.isBefore(new Date())}
                  closeOnSelect={true}
                  inputProps={{
                    readOnly: true,
                    disabled: isLiveData,
                    onKeyDown: (e) => e.preventDefault(),
                    style: {
                      cursor: isLiveData ? "not-allowed" : "pointer",
                      backgroundColor: isLiveData ? "#e9ecef" : "#f3f3f3",
                    },
                  }}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-white">To:</label>
                <Datetime
                  value={betHistoryData.endDate}
                  name="endDate"
                  dateFormat="DD-MM-YYYY"
                  onChange={(e) =>
                    handleDateValueWrapper("endDate", moment(e).toDate())
                  }
                  timeFormat="HH:mm"
                  isValidDate={(current) => current.isBefore(new Date())}
                  closeOnSelect={true}
                  inputProps={{
                    readOnly: true,
                    disabled: isLiveData,
                    onKeyDown: (e) => e.preventDefault(),
                    style: {
                      cursor: isLiveData ? "not-allowed" : "pointer",
                      backgroundColor: isLiveData ? "#e9ecef" : "#f3f3f3",
                    },
                  }}
                />
              </div>
            </div>

            {/* Date Error Message */}
            {dateError && (
              <div className="text-danger text-center mt-2">{dateError}</div>
            )}

            {/* Button Row */}
            <div className="col-md-6 d-flex align-items-center justify-content-center mx-auto mt-3">
              <button
                className="btn  w-100 text-white"
                onClick={() =>
                  betHistoryData.selectGame === "lottery"
                    ? getHistoryForLotteryBetHistory()
                    : handleGetHistory()
                }
                disabled={isButtonDisabled()}
                style={{ backgroundColor: "#6a7e89" }}
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
