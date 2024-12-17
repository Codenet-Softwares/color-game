import React, { useCallback, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LotteryNewPage.css";
import {
  LotteryRange,
  SearchLotteryTicketUser,
  GetUpdateMarketStatus,
  getUpdateMarketStatus,
} from "../../utils/apiService";
import SearchLotteryResult from "./SearchLotteryResult";
import { getLotteryRange } from "../../utils/getInitiateState";
import moment from "moment";
import CountDownTimerLottery from "../common/CountTimerLottery";
import { useParams } from "react-router-dom";

const LotteryNewPage = ({ drawId }) => {
  console.log("====>>>> line number 10", drawId);
  const { marketId } = useParams();

  console.log("marketId", marketId);

  const [sem, setSem] = useState("");
  const [group, setGroup] = useState("");
  const [series, setSeries] = useState("");
  const [number, setNumber] = useState("");
  const [isGroupPickerVisible, setIsGroupPickerVisible] = useState(false);
  const [isSeriesPickerVisible, setIsSeriesPickerVisible] = useState(false);
  const [isNumberPickerVisible, setIsNumberPickerVisible] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [showSearch, setShowSearch] = useState(true);
  const [lotteryRange, setLotteryRange] = useState(getLotteryRange());
  const [filteredNumbers, setFilteredNumbers] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]); // For filtered series
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [seriesList, setSeriesList] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [start, setStart] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [endTimeForTimer, setEndTimeForTimer] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [marketIds, setMarketIds] = useState([]);
  const [marketName, setMarketName] = useState("");
  const [setIsTimeUp, setSetIsTimeUp] = useState(false);
  const [isSuspend, setIsSuspend] = useState(false);
  const [priceEach, setPriceEach] = useState("");
  console.log("===>> marketName", lotteryRange);

  // useEffect(() => {
  //   if (setIsTimeUp) {
  //     setIsSuspend(true);
  //   } else {
  //     setIsSuspend(false);
  //   }
  // }, [setIsTimeUp]);

  useEffect(() => {
    if (startTime) {
      const currentTime = moment();
      const marketStartTime = moment(startTime);
      if (currentTime.isSameOrAfter(marketStartTime)) {
        setShowCountdown(true);
      } else {
        setShowCountdown(false);
      }
    }
  }, [startTime]);

  useEffect(() => {
    const handleLotteryRange = async () => {
      try {
        const data = await LotteryRange();
        console.log("======>>>>>> response from data", data);

        if (data && data.data) {
          const filteredMarket = data.data.filter(
            (item) => item.marketId === drawId
          );

          if (filteredMarket.length > 0) {
            const currentMarket = filteredMarket[0];
            console.log("===>> currentMarket", currentMarket);

            setLotteryRange({
              group_start: currentMarket.group_start || "",
              group_end: currentMarket.group_end || "",
              series_start: currentMarket.series_start || "",
              series_end: currentMarket.series_end || "",
              number_start: currentMarket.number_start || 0,
              number_end: currentMarket.number_end || 0,
            });

            // Update the filtered values based on the new market range
            setFilteredNumbers(generateNumbers(currentMarket.number_start, currentMarket.number_end));
            setFilteredGroups(generateGroups(currentMarket.group_start, currentMarket.group_end));
            setFilteredSeries(generateSeries(currentMarket.series_start, currentMarket.series_end));

            setPriceEach(currentMarket.price || "no price to show");
            setMarketName(currentMarket.marketName || "Unknown Market");

            const start = moment.utc(currentMarket.start_time);
            const end = moment.utc(currentMarket.end_time);
            console.log("object============>>>>>>>>", start);
            setIsSuspend(currentMarket.isActive)
            setStartTime(
              moment.utc(currentMarket.start_time).format("YYYY-MM-DD HH:mm")
            );
            setEndTime(
              moment.utc(currentMarket.end_time).format("YYYY-MM-DD HH:mm")
            );

            setEndTimeForTimer(
              moment.utc(currentMarket.end_time).format("YYYY-MM-DDTHH:mm:ss")
            );

            // const currentTime = moment();
            // console.log("Current time:", currentTime.format("YYYY-MM-DD HH:mm"));
            // console.log("Start time:", start.format("YYYY-MM-DD HH:mm"));

            // if (currentTime.isSameOrAfter(start)) {
            //   setShowCountdown(true);
            //   console.log("Countdown will be shown.");
            // } else {
            //   setShowCountdown(false);
            //   console.log("Countdown will not be shown.");
            // }
          } else {
            console.warn("No market found matching the given drawId");
            setMarketName("Unknown Market");
          }
        } else {
          console.warn("LotteryRange returned null or undefined data");
        }
      } catch (error) {
        console.error("Error fetching lottery range:", error);
      }
    };

    handleLotteryRange();
  }, [drawId]);

  const handleSemChange = (e) => {
    setSem(e.target.value);
  };

  // Dynamically generate series based on the range from the API
  const generateSeries = (start, end) => {
    const letters = [];
    for (let i = start.charCodeAt(0); i <= end.charCodeAt(0); i++) {
      const letter = String.fromCharCode(i);
      if (letter !== "I" && letter !== "F" && letter !== "O") {
        letters.push(letter);
      }
    }
    return letters;
  };

  // Generate groups within a specified range
  const generateGroups = (start, end) => {
    return Array.from({ length: Math.abs(end - start) + 1 }, (_, i) =>
      (i + start).toString()
    );
  };

  const renderSeriesGrid = () => {
    return (
      <div className="calendar-grid">
        {filteredSeries.length === 0 ? (
          <div className="text-center">No Results</div>
        ) : (
          filteredSeries.map((letter) => (
            <button
              key={letter}
              className="calendar-cell"
              onClick={() => handleSeriesSelect(letter)}
            >
              {letter}
            </button>
          ))
        )}
      </div>
    );
  };

  const renderGroupGrid = () => {
    return (
      <div className="calendar-grid">
        {filteredGroups.length === 0 ? (
          <div className="text-center">No Results</div>
        ) : (
          filteredGroups.map((group) => (
            <button
              key={group}
              className="calendar-cell"
              onClick={() => handleGroupSelect(group)}
            >
              {group}
            </button>
          ))
        )}
      </div>
    );
  };

  const handleGroupSelect = (value) => {
    setGroup(value);
    setIsGroupPickerVisible(false);
  };

  const handleSeriesSelect = (value) => {
    setSeries(value);
    setIsSeriesPickerVisible(false);
  };

  // Generate numbers within a specified range
  const generateNumbers = (start, end) => {
    const actualStart = Math.min(start, end);
    const actualEnd = Math.max(start, end);
    return Array.from(
      { length: actualEnd - actualStart + 1 },
      (_, i) => i + actualStart
    );
  };

  // Debounced filter function for number, group, and series inputs
  const debouncedFilter = useCallback(
    (value, type) => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout); // Clear previous timeout
      }

      const timeout = setTimeout(() => {
        let filtered = [];
        switch (type) {
          case "number":
            filtered = generateNumbers(
              lotteryRange.number_start,
              lotteryRange.number_end
            ).filter((num) => num.toString().startsWith(value));
            setFilteredNumbers(filtered);
            break;
          case "group":
            if (value) {
              filtered = filteredGroups.filter((group) =>
                group.startsWith(value)
              );
              setFilteredGroups(filtered);
            } else {
              // Reset to all groups if input is empty
              setFilteredGroups(
                generateGroups(lotteryRange.group_start, lotteryRange.group_end)
              );
            }
            break;
          case "series":
            if (value) {
              filtered = filteredSeries.filter((series) =>
                series.startsWith(value)
              );
              setFilteredSeries(filtered);
            } else {
              // Reset to all series if input is empty
              setFilteredSeries(
                generateSeries(
                  lotteryRange.series_start,
                  lotteryRange.series_end
                )
              );
            }
            break;
          default:
            break;
        }
      }, 1500);

      setDebounceTimeout(timeout);
    },
    [lotteryRange, debounceTimeout, filteredGroups, filteredSeries]
  );

  const handleNumberInputChange = (e) => {
    const inputValue = e.target.value;
    setNumber(inputValue);
    debouncedFilter(inputValue, "number"); // Pass type as "number"
  };

  const handleGroupInputChange = (e) => {
    const inputValue = e.target.value;
    setGroup(inputValue);
    debouncedFilter(inputValue, "group"); // Pass type as "group"
  };

  const handleSeriesInputChange = (e) => {
    const inputValue = e.target.value;
    setSeries(inputValue);
    debouncedFilter(inputValue, "series"); // Pass type as "series"
  };

  const handleNumberSelect = (value) => {
    setNumber(value);
    setIsNumberPickerVisible(false);
  };

  const renderNumberGrid = () => {
    return (
      <div className="calendar-grid">
        {filteredNumbers.length === 0 ? (
          <div className="text-center">No Results</div>
        ) : (
          filteredNumbers.map((num) => (
            <button
              key={num}
              className="calendar-cell"
              onClick={() =>
                handleNumberSelect(num.toString().padStart(5, "0"))
              }
            >
              {num.toString().padStart(5, "0")}
            </button>
          ))
        )}
      </div>
    );
  };

  const handleSearch = async () => {
    const requestBody = {
      group: group ? parseInt(group) : null,
      series: series || null,
      number: number || null,
      sem: sem ? parseInt(sem) : null,
      marketId: drawId,
    };

    try {
      const response = await SearchLotteryTicketUser(requestBody);
      setResponseData(response.data);
      setShowSearch(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFocus = (type) => {
    setIsGroupPickerVisible(type === "group");
    setIsSeriesPickerVisible(type === "series");
    setIsNumberPickerVisible(type === "number");
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center mt-5"
      style={{ minHeight: "75vh", backgroundColor: "#f0f4f8" }}
    >
      {/* Main Content Wrapper */}
      <div
        className="border border-3 rounded-3 shadow-lg position-relative"
        style={{
          padding: "40px",
          width: "80%",
          maxWidth: "800px",
          backgroundColor: "#ffff",
        }}
      >
        {/* Suspended Overlay */}
        {!isSuspend && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              zIndex: 10,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "inherit",
            }}
          >
            <h1 className="fw-bold text-black">Suspended</h1>
          </div>
        )}

        {showSearch ? (
          <>
            <div className="text-center mb-4">
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ position: "relative", width: "100%" }}
              >
                <h2
                  className="mb-1"
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "#ff4500",
                    fontWeight: "bold",
                    fontSize: "2rem",
                    textAlign: "center",
                  }}
                >
                  {marketName}
                </h2>
                <div></div>
                <div>
                  <h5
                    className="btn text-white fw-bold"
                    style={{ background: "#1A859D" }}
                  >
                    Price: <strong>{priceEach}</strong>
                  </h5>
                </div>
              </div>

              {startTime && endTime && (
                <p style={{ color: "#6c757d" }}>
                  Start Time: <strong>{startTime}</strong> | End Time:{" "}
                  <strong>{endTime}</strong>
                </p>
              )}
              <h2
                className="mb-1"
                style={{
                  color: "#ff4500",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                  fontSize: "2rem",
                }}
              >
                🎉 Find Your Lucky Ticket & Win Big! 🎟️
              </h2>
              <p style={{ color: "#6c757d" }}>
                Search by Sem, Group, Series, or Number
              </p>
              {showCountdown && (
                <CountDownTimerLottery
                  endDateTime={endTimeForTimer}
                />
              )}
            </div>

            {/* Sem Input */}
            <div className="mb-3">
              <label className="form-label">SEM</label>
              <select
                className="form-select"
                value={sem}
                onChange={handleSemChange}
              >
                <option value="">Select Sem</option>
                {[5, 10, 25, 50, 100, 200].map((semValue) => (
                  <option key={semValue} value={semValue}>
                    {semValue}
                  </option>
                ))}
              </select>
            </div>

            {/* Group Input */}
            <div className="mb-3">
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Group"
                  className="form-control"
                  value={group}
                  onFocus={() => handleFocus("group")}
                  onChange={handleGroupInputChange} // Allow manual input
                />
                {isGroupPickerVisible && (
                  <div className="picker-dropdown">{renderGroupGrid()}</div>
                )}
              </div>
            </div>

            {/* Series Input */}
            <div className="mb-3">
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Series"
                  className="form-control"
                  value={series}
                  onFocus={() => handleFocus("series")}
                  onChange={handleSeriesInputChange} // Allow manual input
                />
                {isSeriesPickerVisible && (
                  <div className="picker-dropdown">{renderSeriesGrid()}</div>
                )}
              </div>
            </div>

            {/* Number Input */}
            <div className="mb-3">
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Number"
                  className="form-control"
                  value={number}
                  onFocus={() => handleFocus("number")}
                  onChange={handleNumberInputChange}
                />
                {isNumberPickerVisible && (
                  <div className="picker-dropdown">{renderNumberGrid()}</div>
                )}
              </div>
            </div>

            {/* Centered Search Button */}
            <div className="d-flex justify-content-center">
              <button
                className="btn mt-3 text-white"
                onClick={handleSearch}
                style={{
                  width: "150px",
                  background: "#176577",
                }}
              >
                Search
              </button>
            </div>
          </>
        ) : (
          <SearchLotteryResult responseData={responseData} marketId={drawId} />
        )}
      </div>
    </div>
  );
};

export default LotteryNewPage;
