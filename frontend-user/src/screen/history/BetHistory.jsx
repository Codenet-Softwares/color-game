import React, { useState, useEffect } from "react";
import AppDrawer from "../common/appDrawer";
import Layout from "../layout/layout";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import Pagination from "../common/Pagination";
import moment from "moment";
import { useAppContext } from "../../contextApi/context";

import {
  getDataFromHistoryLandingPage,
  getOpenBetsGame,
  user_getBackLayData_api,
  user_getBetHistory_api,
  user_getLotteryBetHistory_api,
  // user_getOpenBetData_api,
  // user_getOpenBetmarket_api,
} from "../../utils/apiService";
import { getbiddingInitialState } from "../../utils/getInitiateState";
import { formatDateForUi } from "../../utils/helper";

const BetHistory = () => {
  const [betHistoryData, setBetHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalEntries, setTotalEntries] = useState(10);
  const [openBet, setOpenBet] = useState([]);
  const [selectedGameName, setSelectedGameName] = useState("");
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [flag, setFlag] = useState(true);
  const [gameType, setGameType] = useState("");
  const defaultStartDate = new Date();
  const [selected, setSelected] = useState(<Date />);
  // <Date/>
  const [dateValue, setDateValue] = useState({
    startDate: defaultStartDate,
    endDate: new Date(),
  });
  const [dateVisible, setDateVisible] = useState(false); // date visible only when user selects date
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  defaultStartDate.setDate(defaultStartDate.getDate() - 1);
  function formatDate(dateString) {
    // Create a new Date object using the input string
    let date = new Date(dateString);
    // Extract year, month, and day
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2); // Adding 1 to month because January is 0
    let day = ("0" + date.getDate()).slice(-2);
    // Concatenate the parts with '-' separator
    return `${year}-${month}-${day}`;
  }
  const handleDateValue = (name, value) => {
    setDateValue((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [gameSelectionBetHistory, setGameSelectionBetHistory] = useState([]); // from dummy data into bet history selection
  const [openBetGameNames, setOpenBetGameNames] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState({
    dataSource: "live",
    select2: "",
    select3: "",
  });
  const [fetchData, setFetchData] = useState(true);
  const { store } = useAppContext();

  let startIndex = Math.min((currentPage - 1) * totalEntries + 1);
  let endIndex = Math.min(currentPage * totalEntries, totalItems);
  // the api called for bet history data
  async function handleGetHistory() {
    setFlag(false);
    const response = await user_getBetHistory_api({
      gameId: selectedGameId,
      // marketName: gameSelectionBetHistory,
      pageNumber: currentPage,
      dataLimit: totalEntries,
      startDate: formatDate(dateValue.startDate),
      endDate: formatDate(dateValue.endDate),
      dataSource: selectedOptions.dataSource,
    });

    if (response) {
      setBetHistoryData(response?.data);
      setTotalPages(response?.pagination?.totalPages);
      setTotalItems(response?.pagination?.totalItems);
      setGameType("Colorgame");
    } else {
      //add loading part //
    }
  }

  async function getHistoryForLotteryBetHistory() {
    setFlag(false);
    const response = await user_getLotteryBetHistory_api({
      gameId: selectedGameId,
      // marketName: gameSelectionBetHistory,
      pageNumber: currentPage,
      dataLimit: totalEntries,
      startDate: formatDate(dateValue.startDate),
      endDate: formatDate(dateValue.endDate),
      dataSource: selectedOptions.dataSource,
    });

    if (response) {
      setBetHistoryData(response?.data);
      setTotalPages(response?.pagination?.totalPages);
      setTotalItems(response?.pagination?.totalItems);
      setGameType("Lottery");
    } else {
      //add loading part //
    }
  }
  // useeffect for bet history data
  useEffect(() => {
    if (selectedGameId === "lottery") {
      getHistoryForLotteryBetHistory();
    } else {
      handleGetHistory();
    }
  }, [currentPage, totalItems, totalEntries]);

  // pagination handlechange (to be solved later )
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // entries for no. of entries for pagination
  const handleEntriesChange = (event) => {
    const entries = Number(event.target.value);
    setTotalEntries(entries);
    // After updating totalItems, we need to fetch data for the first page with the new number of items
    setCurrentPage(1);

    // handleGetHistory()
  };

  //this is the select market response whic for both open bets and bet history
  async function handleGetSelectData() {
    const response = await getDataFromHistoryLandingPage();
    if (response) setGameSelectionBetHistory(response.data);
  }

  const openBetsGame = async () => {
    const response = await getOpenBetsGame();
    setOpenBetGameNames(response.data);
  };


  // useeffect for bet history and open bets selection input boxes only
  useEffect(() => {
    handleGetSelectData();
    openBetsGame();
  }, []);
 
  

  // this is for open bets selection onchnage
  const handleSelectChange = (e) => {
    setSelectedGameName(e.target.value);
  };

  const handleGetHistoryChange = (e) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      dataSource: e.target.value,
    }));

    // Additional logic based on the selected option, if required
  };

  const handleGameChange = (e) => {
    setSelectedGameId(e.target.value);
    setDateVisible(true); // Show date picker when market is selected
  };


  // this is back lay open bets data but this api needs to be updated
  async function handleGetData() {
    const response = await user_getBackLayData_api({
      marketId: selectedGameName,
    });
    setOpenBet(response?.data);
  }
  // this is useEffect for  back lay open bets data but this api needs to be updated
  useEffect(() => {
    if (selectedGameName != "") {
      handleGetData();
    }
  }, [selectedGameName]);

  // Function to render "No data found" message when history data is empty
  const renderNoDataFound = () => {
    return (
      <div class="alert alert-danger text-center mt-2" role="alert">
        No data found
      </div>
    );
  };
  // this is the complete get history selection card with bet history data table
  function history() {
    return (
      <div>
        <div
          className="card shadow p-3 mb-5  rounded"
          style={{ marginTop: "150px",background:"#2CB3D1" }}
        >
          <div className="card-body">
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <select
                    className="form-select form-select-sm fw-bold"
                    aria-label=".form-select-sm example"
                    value={selectedOptions.dataSource}
                    onChange={(e) => handleGetHistoryChange(e)}
                  >
                    <option className="fw-bold" value="live" selected>
                      Live Data
                    </option>
                    <option value="backup" className="fw-bold">Back Data</option>
                    <option value="olddata" className="fw-bold">Old Data</option>
                  </select>
                </div>
              </div>

              <div className="col-auto">&nbsp;</div>

              <div className="col">
                <div className="form-group ">
                  <select
                    className="form-select form-select-sm fw-bold"
                    aria-label=".form-select-sm example"
                    value={selectedGameId || ""}
                    onChange={handleGameChange}
                  >
                    <option value="" className=""> Select Game </option>
                    {gameSelectionBetHistory.map((game, index) => (
                      <option className="" key={index} value={game.gameId}>
                        {game.gameName}
                      </option>
                    ))}
                    <option value="lottery" className="">Lottery</option>
                  </select>
                </div>
              </div>

              <div className="col-auto">&nbsp;</div>

              <div className="col">
                <div className="form-group">
                  <select
                    className="form-select form-select-sm fw-bold"
                    aria-label=".form-select-sm example"
                    value={selectedOptions.select3}
                    onChange={(e) => handleGetHistoryChange(e, "select3")}
                  >
                    <option selected className="fw-bold">Open this select menu</option>
                    <option value="1" className="fw-bold">Settle</option>
                    <option value="1" className="fw-bold">Unsettel</option>
                  </select>
                </div>
              </div>
            </div>

            {/* {dateVisible && ( */}
            <div className="row align-items-center">
              <div className="col">
                <div className="form-group">
                  <label className="">From:</label>
                  <div className="input-group" style={{ maxWidth: "100%" }}>
                    <Datetime                   
                      value={dateValue.startDate}
                      name="startDate"
                      dateFormat="DD-MM-YYYY"
                      onChange={(e) =>
                        handleDateValue("startDate", moment(e).toDate())
                      }
                      timeFormat="HH:mm"
                      isValidDate={(current) => current.isBefore(new Date())}
                      readonly // Prevent manual typing
                      onKeyDown={(e) => e.preventDefault()} // Block manual input from keyboard
                    />
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="form-group">
                  <label className="">To:</label>
                  <div className="input-group" style={{ maxWidth: "100%" }}>
                    <Datetime
                      value={dateValue.endDate}
                      name="endDate"
                      dateFormat="DD-MM-YYYY"
                      onChange={(e) =>
                        handleDateValue("endDate", moment(e).toDate())
                      }
                      timeFormat="HH:mm"
                      isValidDate={(current) => current.isBefore(new Date())}
                      readonly // Prevent manual typing
                      onKeyDown={(e) => e.preventDefault()} // Block manual input from keyboard
                    />
                  </div>
                </div>
              </div>

              <div className="col">
                <button
                  className="btn btn-primary "
                  onClick={() =>
                    selectedGameId === "lottery"
                      ? getHistoryForLotteryBetHistory()
                      : handleGetHistory()
                  }
                  disabled={!selectedGameId}
                >
                  Get History
                </button>
              </div>
            </div>
            {/* )} */}
          </div>
        </div>

        <div className="card shadow p-3 mb-5 bg-white rounded">
          <div
            className="card-header"
            style={{
              backgroundColor: "#2CB3D1",
              color: "white",
              textAlign: "center",
            }}
          >
            <h5 className="card-title text-uppercase fw-bold">Bet History</h5>
          </div>
          {selectedGameId === null ? (
            <div className="alert alert-info text-center mt-2 fw-bold" role="alert">
              Please Select a Game Name & Click Get History
            </div>
          ) : betHistoryData?.length > 0 ? (
            <div className="card-body">
              {/* Show entries dropdown */}
              <div className="mb-3">
                <label htmlFor="showEntriesDropdown" className="form-label">
                  Show entries
                </label>
                <select
                  className="form-select"
                  id="showEntriesDropdown"
                  value={totalEntries}
                  onChange={handleEntriesChange}
                >
                  <option value="10" selected>
                    10 Entries
                  </option>
                  <option value="25">25 Entries</option>
                  <option value="50">50 Entries</option>
                  <option value="100">100 Entries</option>
                </select>
              </div>

              <div style={{ overflow: "auto" }}>
                <table className="table table-bordered">
                  {gameType === "Lottery" ? (
                    <>
                      <thead>
                        <tr align="center">
                          <th scope="col">Sport Name</th>
                          <th scope="col">Event</th>
                          <th scope="col">Tickets</th>
                          <th scope="col">Sem</th>
                          <th scope="col">Ticket Price</th>
                          <th scope="col">Amount</th>
                          <th scope="col">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {betHistoryData?.map((item, index) => (
                          <tr key={index} align="center">
                            <td>{item.gameName}</td>
                            <td>{item.marketName}</td>
                            <td>
                              {" "}
                              <div
                                className="dropdown"
                                style={{ position: "relative" }}
                              >
                                <button
                                  className="btn btn-link dropdown-toggle"
                                  type="button"
                                  onClick={() => toggleDropdown(index)}
                                >
                                  View Tickets
                                </button>
                                <div
                                  className="custom-dropdown-content"
                                  style={{
                                    height:
                                      dropdownOpen === index ? "200px" : "0",
                                    overflow:
                                      dropdownOpen === index
                                        ? "auto"
                                        : "hidden",
                                    transition: "height 0.3s ease",
                                    background: "white",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                                  }}
                                >
                                  {dropdownOpen === index && (
                                    <div
                                      style={{
                                        maxHeight: "200px", // Sets the maximum height
                                        // overflowY: "auto", // Enables scrolling if necessary
                                        padding: "10px", // Optional: Space inside the dropdown
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontWeight: "bold",
                                          display: "block",
                                          marginBottom: "5px",
                                        }}
                                      >
                                        Ticket Numbers:
                                      </span>
                                      <hr
                                        style={{
                                          margin: "5px 0",
                                          borderColor: "#ddd",
                                        }}
                                      />
                                      {item?.tickets?.length > 0 ? (
                                        item?.tickets?.map((number, i) => (
                                          <span
                                            key={i}
                                            style={{
                                              display: "block",
                                              padding: "5px 10px",
                                              borderBottom: "1px solid #eee",
                                              color: "#333",
                                            }}
                                          >
                                            {number}
                                          </span>
                                        ))
                                      ) : (
                                        <span
                                          style={{
                                            color: "#999",
                                            fontStyle: "italic",
                                          }}
                                        >
                                          No ticket numbers available
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>{item.sem}</td>
                            <td className="fw-bold">{item.ticketPrice}</td>
                            <td>{item.amount}</td>
                            <td>{new Date(item.date).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  ) : (
                    <>
                      <thead>
                        <tr>
                          <th scope="col">Sport Name</th>
                          <th scope="col">Event</th>
                          <th scope="col">Market</th>
                          <th scope="col">Selection</th>
                          <th scope="col">Type</th>
                          <th scope="col">Odds Req.</th>
                          <th scope="col">Stack</th>
                          <th scope="col">Place Time</th>
                          <th scope="col">Settle Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {betHistoryData?.map((item, index) => (
                          <tr key={index} align="center">
                            <td>{item?.gameName}</td>
                            <td>{item?.marketName}</td>
                            <td>{"WINNER"}</td>
                            <td>{item?.runnerName}</td>
                            <td className="fw-bold" style={{ color: item?.type === "back" ? "blue" : "red" }}>
                              {item?.type}
                            </td>
                            <td>{item?.rate}</td>
                            <td className="fw-bold">{item?.value}</td>
                            <td>{formatDateForUi(item?.placeDate)}</td>
                            <td>{formatDateForUi(item?.date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}
                </table>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                startIndex={startIndex}
                endIndex={endIndex}
                totalData={totalItems}
              />
            </div>
          ) : (
            renderNoDataFound()
          )}
        </div>
      </div>
    );
  }

  // this is the open bets section with selection with conditinally rendering back and lay table data with market selection
  function openBets() {
    return (
      <div className="card" style={{ marginTop: "150px", height: "800px" }}>
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
              style={{ width: "100%" }}
              onChange={handleSelectChange}
            >
              <option value={""} >Select Sport Name</option>
              {openBetGameNames.map((item, index) => (
                <option key={index} value={item.gameId}>
                  {item.gameName}
                </option>
              ))}
            </select>
          </div>

          {/* Render back  and laytable if market is selected */}
          {selectedGameName.length > 0 && !selectedGameName == "" && (
            <>
              {renderBackTable()}
              {renderLayTable()}
            </>
          )}
        </div>
      </div>
    );
  }
  // Function to render back table called in open bets function
  const renderBackTable = () => {
    return (
      <div
        className="card shadow p-3 mb-5 rounded"
        style={{ backgroundColor: "#cfe2f3" }}
      >
        <div className="card-body">
          <div className="table-responsive ">
            <table className="table table-striped table-sm">
              {/* Table header */}
              <thead>
                <tr align="center fs-6">
                  <th className="d-none d-sm-table-cell">Back</th>
                  <th className="d-none d-sm-table-cell">Odds</th>
                  <th className="d-none d-sm-table-cell">Stake</th>
                  <th className="d-none d-sm-table-cell">Profit</th>
                  <th className="d-table-cell d-sm-none">Details</th>
                </tr>
              </thead>
              {/* Table body - data to be filled dynamically */}
              <tbody>
                {/* Insert rows for back bets */}
                {openBet.filter((item) => item.type === "back").length > 0 ? (
                  openBet
                    .filter((item) => item.type === "back")
                    .map((item, index) => (
                      <tr key={index} align="center">
                        {/* Show for larger screens */}
                        <td className="d-none d-sm-table-cell">
                          {item.runnerName}
                        </td>
                        <td className="d-none d-sm-table-cell">{item.rate}</td>
                        <td className="d-none d-sm-table-cell">{item.value}</td>
                        <td className="d-none d-sm-table-cell">
                          {Math.round(item.value)}(-
                          {Math.round(item.bidAmount)})
                        </td>

                        {/* Show for smaller screens */}
                        <td className="d-table-cell d-sm-none">
                          <div>
                            <strong>Back (Bet For):</strong> {item.runnerName}
                          </div>
                          <div>
                            <strong>Odds:</strong> {item.rate}
                          </div>
                          <div>
                            <strong>Stake:</strong> {item.value}
                          </div>
                          <div>
                            <strong>Profit:</strong> {Math.round(item.value)}
                            (-
                            {Math.round(item.bidAmount)})
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" align="center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Function to render lay table  called in open bets function
  const renderLayTable = () => {
    return (
      <div
        className="card shadow p-3 mb-5 rounded"
        style={{ backgroundColor: "#f8d7da" }}
      >
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-sm">
              {/* Table header */}
              <thead>
                <tr align="center">
                  <th className="d-none d-sm-table-cell">Lay</th>
                  <th className="d-none d-sm-table-cell">Odds</th>
                  <th className="d-none d-sm-table-cell">Stake</th>
                  <th className="d-none d-sm-table-cell">Liability</th>
                  <th className="d-table-cell d-sm-none">Details</th>
                </tr>
              </thead>
              {/* Table body - data to be filled dynamically */}
              <tbody>
                {/* Insert rows for lay bets */}
                {openBet.filter((item) => item.type === "lay").length > 0 ? (
                  openBet
                    .filter((item) => item.type === "lay")
                    .map((item, index) => (
                      <tr key={index} align="center">
                        {/* Show for larger screens */}
                        <td className="d-none d-sm-table-cell">
                          {item.runnerName}
                        </td>
                        <td className="d-none d-sm-table-cell">{item.rate}</td>
                        <td className="d-none d-sm-table-cell">{item.value}</td>
                        <td className="d-none d-sm-table-cell">
                          {Math.round(item.value)}(-
                          {Math.round(item.bidAmount)})
                        </td>

                        {/* Show for smaller screens */}
                        <td className="d-table-cell d-sm-none">
                          <div>
                            <strong>Lay (Bet Against):</strong>{" "}
                            {item.runnerName}
                          </div>
                          <div>
                            <strong>Odds:</strong> {item.rate}
                          </div>
                          <div>
                            <strong>Stake:</strong> {item.value}
                          </div>
                          <div>
                            <strong>Liability:</strong> {Math.round(item.value)}
                            (-
                            {Math.round(item.bidAmount)})
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" align="center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  function getBody() {
    return (
      <>
        <div className="row">
          <div className="col-lg-9">{history()}</div>

          <div className="col-lg-3">{openBets()}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <AppDrawer showCarousel={false}>
        <Layout />
        {getBody()}
      </AppDrawer>
    </>
  );
};

export default BetHistory;
