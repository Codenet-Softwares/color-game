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
  user_getBackLayData_api,
  user_getBetHistory_api,
} from "../../utils/apiService";

const BetHistory = () => {
  const [betHistoryData, setBetHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalEntries, setTotalEntries] = useState(5);
  const [openBet, setOpenBet] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState("");
  const [selectedMarketId, setSelectedMarketId] = useState("");
  const [dateVisible, setDateVisible] = useState(false);
  const defaultStartDate = new Date();
  const [dateValue, setDateValue] = useState({
    startDate: defaultStartDate,
    endDate: new Date(),
  });

  defaultStartDate.setDate(defaultStartDate.getDate() - 1);

  // Function to handle date value changes
  const handleDateValue = (name, value) => {
    setDateValue((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle entries change
  const handleEntriesChange = (event) => {
    const entries = Number(event.target.value);
    setTotalEntries(entries);
    setCurrentPage(1);
  };

  // Function to handle get history change
  const handleGetHistoryChange = (e, selectName) => {
    const { value } = e.target;
    setSelectedMarketId(value);
    setDateVisible(true); // Show date picker when market is selected
  };

  // Function to handle get history
  async function handleGetHistory() {
    const response = await user_getBetHistory_api({
      marketId: selectedMarketId,
      pageNumber: currentPage,
      dataLimit: totalEntries,
      startDate: moment(dateValue.startDate).format("YYYY-MM-DD HH:mm"),
      endDate: moment(dateValue.endDate).format("YYYY-MM-DD HH:mm"),
    });

    if (response) {
      setBetHistoryData(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);
    } else {
      // Handle error or loading state
    }
  }

  // useEffect to fetch data when market id or pagination changes
  useEffect(() => {
    if (selectedMarketId !== "") {
      handleGetHistory();
    }
  }, [selectedMarketId, currentPage, totalEntries]);

  // Function to render "No data found" message when history data is empty
  const renderNoDataFound = () => {
    return (
      <div className="card-body">
        <p>No data found</p>
      </div>
    );
  };

  // JSX for history component
  function history() {
    return (
      <div>
        <div className="card-body">
          <div className="row">
            <div className="col">
              <div className="form-group">
                <select
                  className="form-select form-select-sm"
                  aria-label=".form-select-sm example"
                  value={selectedMarketId || ""}
                  onChange={(e) => handleGetHistoryChange(e, "select1")}
                >
                  <option value="">Open this select menu</option>
                  {marketSelectionbetHistory.map((market, index) => (
                    <option key={index} value={market.marketId}>
                      {market.marketName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {dateVisible && ( // Render date selection only when dateVisible is true
              <>
                <div className="col">
                  <div className="form-group">
                    <label>From:</label>
                    <div className="input-group" style={{ maxWidth: "100%" }}>
                      <Datetime
                        value={dateValue.startDate}
                        name="startDate"
                        dateFormat="DD-MM-YYYY"
                        onChange={(e) =>
                          handleDateValue(
                            "startDate",
                            moment(e).toDate()
                          )
                        }
                        timeFormat="HH:mm"
                        isValidDate={(current) =>
                          current.isBefore(new Date())
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="col">
                  <div className="form-group">
                    <label>To:</label>
                    <div className="input-group" style={{ maxWidth: "100%" }}>
                      <Datetime
                        value={dateValue.endDate}
                        name="endDate"
                        dateFormat="DD-MM-YYYY"
                        onChange={(e) =>
                          handleDateValue(
                            "endDate",
                            moment(e).toDate()
                          )
                        }
                        timeFormat="HH:mm"
                        isValidDate={(current) =>
                          current.isBefore(new Date())
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="col">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleGetHistory()}
                  >
                    Get History
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card shadow p-3 mb-5 bg-white rounded">
          <div className="card-header bg-primary text-white">
            <h5 className="card-title">Bet History</h5>
          </div>
          {betHistoryData.length > 0 ? (
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
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                </select>
              </div>

              <div style={{ overflow: "auto" }}>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Game Name</th>
                      <th scope="col">Market Name</th>
                      <th scope="col">Runner Name</th>
                      <th scope="col">Rate</th>
                      <th scope="col">Value</th>
                      <th scope="col">Type</th>
                      <th scope="col">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {betHistoryData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.gameName}</td>
                        <td>{item.marketName}</td>
                        <td>{item.runnerName}</td>
                        <td>{item.rate}</td>
                        <td>{item.value}</td>
                        <td>{item.type}</td>
                        <td>{new Date(item.date).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
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

  return (
    <>
      <AppDrawer showCarousel={false}>
        <Layout />
        {history()}
      </AppDrawer>
    </>
  );
};

export default BetHistory;
//