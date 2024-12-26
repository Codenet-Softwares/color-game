import "../common/common.css";
import Layout from "../layout/layout";
import AppDrawer from "./appDrawer";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../contextApi/context";
import { betHistory } from "../../utils/apiService";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import strings from "../../utils/constant/stringConstant";

const loading = () => {
  return (
    <div className="d-flex justify-content-center">
      <div
        class="spinner-border"
        style={{ width: "3rem", height: "3rem", color: "black" }}
        role="status"
      >
        <span class="sr-only"></span>
      </div>
    </div>
  );
};

const History = () => {
  const { dispatch, store } = useAppContext();

  console.log("===========>ID line 13", store.user?.UserId);
  const [betHistoryData, setBetHistoryData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Constants for pagination
  const [itemsPerPage, setItemsPerPage] = useState(3); // Default items per page

  const [currentPage, setCurrentPage] = useState(1);

  // State for searching by first name
  const [searchFirstName, setSearchFirstName] = useState("");

  const { pathname } = useLocation();

  // State to determine whether to display all data or filtered data
  const [showFilteredData, setShowFilteredData] = useState(false);

  const gameIdFromstore = store.userTxn?.gameId ?? "66053792d1a49b35bfd975aa";

  const parts = pathname.split("/");
  const userId = parts[2];
  console.log("UserId", userId);

  async function getHistoryData() {
    dispatch({
      type: strings.isLoading,
      payload: true,
    });
    const response = await betHistory({
      userId: store.user?.UserId,
      gameId: gameIdFromstore,
      pageNumber: currentPage,
      dataLimit: itemsPerPage,
    });
    if (response) {
      setBetHistoryData(response.data);
      setPaginationData(response.pagination.totalPages);
    }

    dispatch({
      type: strings.isLoading,
      payload: false,
    });
  }

  useEffect(() => {
    getHistoryData();
  }, [currentPage, itemsPerPage]);

  const totalPages = paginationData;

  // Function to toggle between showing all data and filtered data
  // const handleToggleData = () => {
  //   setShowFilteredData(!showFilteredData);
  // };

  const handleGetHistory = () => {
    // Your logic for getting history goes here
    console.log("Fetching history...");
  };

  // Function to handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Function to handle previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const defaultStartDate = new Date();
  const [selected, setSelected] = useState(<Date />);
  const [dateValue, setDateValue] = useState({
    startDate: defaultStartDate,
    endDate: new Date(),
  });
  defaultStartDate.setDate(defaultStartDate.getDate() - 1);

  const handleDateValue = (name, value) => {
    setDateValue((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle search change
  // const handleSearchChange = (e) => {
  //   setSearchFirstName(e.target.value);
  //   setCurrentPage(1); // Reset to first page when changing search query
  // };

  const handelPagination = (data) => {
    setCurrentPage(data);
  };

  function getTopBox() {
    return (
      <>
        <div className="card-body">
          <div className="row">
            <div className="col">
              <div className="form-group">
                <select
                  className="form-select form-select-sm"
                  aria-label=".form-select-sm example"
                >
                  <option selected>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
            </div>
            <div className="col-auto">&nbsp;</div>
            <div className="col">
              <div className="form-group">
                <select
                  className="form-select form-select-sm"
                  aria-label=".form-select-sm example"
                >
                  <option selected>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
            </div>
            <div className="col-auto">&nbsp;</div>
            <div className="col">
              <div className="form-group">
                <select
                  className="form-select form-select-sm"
                  aria-label=".form-select-sm example"
                >
                  <option selected>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col">
              <div className="form-group">
                <label>From:</label>
                <div className="input-group" style={{ maxWidth: "100%" }}>
                  {/* <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="MM/dd/yyyy"
                    className="form-control"
                  /> */}
                  <Datetime
                    value={dateValue.startDate}
                    name="startDate"
                    dateFormat="DD-MM-YYYY"
                    onChange={(e) =>
                      handleDateValue(
                        "startDate",
                        moment(e).format("DD-MM-YYYY HH:mm")
                      )
                    }
                    timeFormat="HH:mm"
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
                        moment(e).format("DD-MM-YYYY HH:mm")
                      )
                    }
                    timeFormat="HH:mm"
                  />
                </div>
              </div>
            </div>
            <div className="col">
              <button
                className="btn btn-primary"
                onClick={handleGetHistory}
                style={{ background: "#0D505A" }}
              >
                Get History
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  function getMidBody() {
    return (
      <div className="container " style={{ marginTop: "120px" }}>
        <div className="row">
          <div className="col-md-8">
            <div>{getTopBox()}</div>
            <div
              className="card"
              style={{ backgroundColor: "white", color: "white" }}
            >
              <div
                className="card-header"
                style={{
                  background: "#0D505A",
                  textAlign: "center",
                  fontSize: "15px",
                  borderRadius: "5px",
                }}
              >
                Bet History
              </div>
              <div className="card-body">
                <div className="searchBar d-flex justify-content-center">
                  <label
                    htmlFor="searchFirstName"
                    style={{ color: "black", marginRight: "10px" }}
                  >
                    Search First Name:
                  </label>
                  <input
                    type="text"
                    id="searchFirstName"
                    style={{ width: "250px", borderRadius: "9px" }}
                  />
                  <button
                    style={{
                      width: "150px",
                      borderRadius: "9px",
                      background: "#0D505A",
                      color: "white",
                    }}
                  >
                    {showFilteredData ? "All Data" : "Filtered Data"}
                  </button>
                </div>
                <br />
                <div>
                  <label
                    htmlFor="itemsPerPage"
                    style={{ color: "black", marginRight: "10px" }}
                  >
                    Show Entries
                  </label>
                  <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    style={{ borderRadius: "6px" }}
                  >
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                  </select>
                </div>
                <br />
                {betHistoryData ? (
                  <div
                    className="table-container overflow-x-scroll"
                    style={{ overflowX: "auto" }}
                  >
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th scope="col">No</th>
                          <th scope="col">date</th>
                          <th scope="col">gameName</th>
                          <th scope="col">marketName</th>
                          <th scope="col">rate</th>
                          <th scope="col">runnerName</th>
                          <th scope="col">type</th>
                          <th scope="col">value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {betHistoryData.map((item, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{item.date}</td>
                            <td>{item.gameName}</td>
                            <td>{item.marketName}</td>
                            <td>{item.rate}</td>
                            <td>{item.runnerName}</td>
                            <td>{item.type}</td>
                            <td>{item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <nav aria-label="Page navigation example">
                      <ul className="pagination justify-content-center">
                        <li className="page-item" onClick={handlePrevPage}>
                          <a className="page-link" href="#" tabIndex="-1">
                            Previous
                          </a>
                        </li>
                        {Array.from({ length: totalPages }, (_, index) => (
                          <li
                            className={`page-item ${
                              index + 1 === currentPage ? "active" : ""
                            }`}
                            key={index}
                          >
                            <a
                              className="page-link"
                              href="#"
                              onClick={() => handelPagination(index + 1)}
                            >
                              {index + 1}
                            </a>
                          </li>
                        ))}
                        <li className="page-item" onClick={handleNextPage}>
                          <a className="page-link" href="#">
                            Next
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                ) : (
                  <>{loading()}</>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="card d-none d-lg-block"
              style={{
                backgroundColor: "white",
                color: "white",
                height: "1000px",
                border: "red",
              }}
            >
              <div
                style={{
                  background: "#0D505A",
                  textAlign: "center",
                  fontSize: "15px",
                  borderRadius: "5px",
                }}
              >
                {" "}
                Open Bets{" "}
              </div>
              <div>
                <form>
                  <select
                    className="selectMarket"
                    style={{ margin: "2px", borderRadius: "5px" }}
                  >
                    <option>select Market</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </select>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function betBody() {
    return <>{getMidBody()}</>;
  }

  return (
    <>
      <AppDrawer showMidCarousel={false}>
        <Layout />
        {betBody()}
      </AppDrawer>
    </>
  );
};

export default History;
// pagination can be refferred from this page but not to be navigated
