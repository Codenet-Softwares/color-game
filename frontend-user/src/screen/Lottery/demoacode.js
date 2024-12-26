import React, { useCallback, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LotteryNewPage.css";
import { LotteryRange, SearchLotteryTicketUser } from "../../utils/apiService";
import SearchLotteryResult from "./SearchLotteryResult";
import { getLotteryRange } from "../../utils/getInitiateState";

const LotteryNewPage = () => {
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
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  console.log('===>>> lottery range',lotteryRange)

  // Fetch lottery range data when component mounts
  useEffect(() => {
    handleLotteryRange();
  }, []);

  const handleLotteryRange = async () => {
    const data = await LotteryRange();
    setLotteryRange({
      group_start: data.data.group_start,
      group_end: data.data.group_end,
      series_start: data.data.series_start,
      series_end: data.data.series_end,
      number_start: data.data.number_start,
      number_end: data.data.number_end,
    });

    // Initialize the filtered numbers based on the fetched range
    setFilteredNumbers(generateNumbers(data.data.number_start, data.data.number_end));
  };

  const handleSemChange = (e) => {
    setSem(e.target.value);
  };

  const renderSeriesGrid = () => {
    const letters = ["A", "B", "C", "D", "E", "G", "H", "J", "K", "L"];
    return (
      <div className="calendar-grid">
        {letters.map((letter) => (
          <button
            key={letter}
            className="calendar-cell"
            onClick={() => handleSeriesSelect(letter)}
          >
            {letter}
          </button>
        ))}
      </div>
    );
  };

  const groupLength = Math.abs(lotteryRange.group_end - lotteryRange.group_start) + 1;

  const renderGroupGrid = () => {
    const groups = Array.from({ length: groupLength }, (_, i) => (i + lotteryRange.group_start).toString());
    return (
      <div className="calendar-grid">
        {groups.map((group) => (
          <button
            key={group}
            className="calendar-cell"
            onClick={() => handleGroupSelect(group)}
          >
            {group}
          </button>
        ))}
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
    return Array.from({ length: actualEnd - actualStart + 1 }, (_, i) => i + actualStart);
  };

  // Debounced filter function for number input
  const debouncedFilter = useCallback(
    (value) => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout); // Clear previous timeout
      }

      const timeout = setTimeout(() => {
        const filtered = generateNumbers(lotteryRange.number_start, lotteryRange.number_end).filter((num) =>
          num.toString().startsWith(value)
        );
        setFilteredNumbers(filtered);
      }, 1500);

      setDebounceTimeout(timeout);
    },
    [lotteryRange, debounceTimeout]
  );

  const handleNumberInputChange = (e) => {
    const inputValue = e.target.value;
    setNumber(inputValue);

    // Only filter if input is not empty
    if (inputValue !== "") {
      debouncedFilter(inputValue);
    } else {
      // Reset to full list if input is empty
      setFilteredNumbers(generateNumbers(lotteryRange.number_start, lotteryRange.number_end));
    }
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
              onClick={() => handleNumberSelect(num.toString().padStart(5, "0"))}
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
    };

    try {
      const response = await SearchLotteryTicketUser(requestBody);
      setResponseData(response.data);
      setShowSearch(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center mt-5"
      style={{ minHeight: "75vh", backgroundColor: "#f0f4f8" }}
    >
      <div
        className="border border-3 rounded-3 shadow-lg"
        style={{
          padding: "40px",
          width: "80%",
          maxWidth: "800px",
          backgroundColor: "#ffffff",
        }}
      >
        {showSearch ? (
          <>
            <div className="text-center mb-4">
              <h2 className="mb-1" style={{ color: "#ff4500", fontWeight: "bold", letterSpacing: "1px", fontSize: "2rem" }}>
                🎉 Find Your Lucky Ticket & Win Big! 🎟️
              </h2>
              <p style={{ color: "#3b6e91", fontSize: "1.2rem", marginTop: "10px" }}>
                Search for tickets and grab the chance to change your future today!
              </p>
            </div>

            {/* SEM Input Field */}
            <div className="mb-4">
              <label htmlFor="sem" className="form-label" style={{ color: "#4682B4", fontWeight: "bold" }}>
                Select SEM
              </label>
              <select id="sem" className="form-select" value={sem} onChange={handleSemChange}>
                <option value="">Choose SEM</option>
                {[5, 10, 25, 50, 100, 200].map((value) => (
                  <option key={value} value={value}>{`${value} SEM`}</option>
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
                  onFocus={() => setIsGroupPickerVisible(true)}
                  readOnly
                />
                {isGroupPickerVisible && <div className="picker-dropdown">{renderGroupGrid()}</div>}
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
                  onFocus={() => setIsSeriesPickerVisible(true)}
                  readOnly
                />
                {isSeriesPickerVisible && <div className="picker-dropdown">{renderSeriesGrid()}</div>}
              </div>
            </div>

            {/* Number Input */}
            <div className="mb-4">
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Number"
                  className="form-control"
                  value={number}
                  onFocus={() => setIsNumberPickerVisible(true)}
                  onChange={handleNumberInputChange}
                />
                {isNumberPickerVisible && <div className="picker-dropdown">{renderNumberGrid()}</div>}
              </div>
            </div>

            {/* Search Button */}
            <div className="text-center">
              <button
                className="btn btn-primary"
                onClick={handleSearch}
                style={{ backgroundColor: "#4682B4", padding: "10px 40px", fontWeight: "bold" }}
              >
                Search
              </button>
            </div>
          </>
        ) : (
          <SearchLotteryResult responseData={responseData} />
        )}
      </div>
    </div>
  );
};

export default LotteryNewPage;