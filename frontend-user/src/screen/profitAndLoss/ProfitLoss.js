import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import ProfitAndLossEvent from "./ProfitAndLossEvent";
import ProfitAndLossRunner from "./ProfitLossRunner";
import Pagination from "../common/Pagination";
import {
  getprofitLossEventDataState,
  getprofitLossLotteryEventDataState,
  getprofitLossRunnerDataState,
  getUserBetHistory,
  getUserLotteryBetHistory,
} from "../../utils/getInitiateState";
import {
  getProfitLossEvent,
  getProfitLossLotteryEvent,
  getProfitLossRunner,
  getUserBetHistory_api,
  getUserLotteryBetHistory_api,
} from "../../utils/apiService";
import { customErrorHandler } from "../../utils/helper";
import UserBetHistory from "./UserBetHistory";
import { toast } from "react-toastify";
import ProfitAndLossLotteryEvent from "./ProfitAndLossLotteryEvent";
import UserLotteryBetHistory from "./UserLotteryBetHistory";

const ProfitLoss = ({
  UserName,
  setEndDate,
  setStartDate,
  startDate,
  endDate,
  dataGameWise,
  currentPage,
  totalData,
  handlePageChange,
  totalPages,
  SetProfitLossData,
  handleDateForProfitLoss,
  profitLossData
}) => {
  //Pagination
  const startIndex = Math.min((currentPage - 1) * 10 + 1,totalData);
  const endIndex = Math.min(currentPage * 10, totalData);

  const [profitLossEventData, SetProfitLossEventData] = useState(
    getprofitLossEventDataState()
  );

  const [profitLossRunnerData, SetProfitLossRunnerData] = useState(
    getprofitLossRunnerDataState()
  );

  const [profitLossLotteryEventData, SetProfitLossLotteryEventData] = useState(
    getprofitLossLotteryEventDataState()
  );

  const [userBetHistory, setUserBetHistory] = useState(getUserBetHistory());
  const [userLotteryBetHistory, setUserLotteryBetHistory] = useState(
    getUserLotteryBetHistory()
  );

  const [toggle, SetToggle] = useState(true);
  const [component, SetComponent] = useState(null);
  const [gameId, SetGameId] = useState(null);
  const [marketId, SetMarketId] = useState(null);
  const [runnerId, SetRunnerId] = useState(null);

  async function getProfitLossRunnerWise() {
    try {
      // Set toggle to false before hitting the API
      SetToggle(false);

      // Make the API call
      const response = await getProfitLossRunner({
        userName: UserName,
        marketId: marketId,
        pageNumber: profitLossRunnerData.currentPage,
        dataLimit: profitLossRunnerData.itemPerPage,
        searchName: profitLossRunnerData.searchItem,
      });

      // Update state with the response data
      SetProfitLossRunnerData((prevState) => ({
        ...prevState,
        data: response?.data,
        totalPages: response?.pagination?.totalPages,
        totalData: response?.pagination?.totalItems,
      }));
    } catch (error) {
      // Handle any errors during the API call
      toast.error(customErrorHandler(error));
    }
  }

  useEffect(() => {
    if (marketId) getProfitLossRunnerWise();
  }, [
    marketId,
    profitLossRunnerData.itemPerPage,
  ]);

  useEffect(() => {
    let timer = setTimeout(() => {
      if (marketId) getProfitLossRunnerWise();
    }, 300);
    return () => clearTimeout(timer);
  }, [profitLossRunnerData.searchItem]);

  useEffect(() => {
    if (runnerId) getUserBetHistoryWise();
  }, [runnerId]);

  useEffect(() => {
    if (component === "UserLotteryBetHistory") getUserLotteryBetHistoryWise();
  }, [component]);

  useEffect(() => {
    if (profitLossLotteryEventData.currentPage > 1) {
      getProfitLossLotteryEventWise();
      SetComponent("ProfitAndLossLotteryEvent");
    }
  }, [profitLossLotteryEventData.currentPage]);

  // useEffect(() => {
  //   getProfitLossRunnerWise()
  //   SetComponent("ProfitAndLossLotteryEvent")
  // }, [profitLossLotteryEventData.currentPage]);

  async function getProfitLossEventWise(gameId, componentName) {
    try {
      // Set toggle to false before hitting the endpoint
      SetToggle(false);
      SetComponent(componentName);
      SetGameId(gameId);

      // Make the API call
      const response = await getProfitLossEvent({
        userName: UserName,
        gameId: gameId,
        pageNumber: profitLossEventData.currentPage,
        dataLimit: profitLossEventData.itemPerPage,
        searchName: profitLossEventData.searchItem,
      });

      // Update state with the response data
      SetProfitLossEventData((prevState) => ({
        ...prevState,
        data: response.data,
        totalPages: response?.pagination?.totalPages,
        totalData: response?.pagination?.totalItems,
      }));
    } catch (error) {
      // Handle any errors that occur during the API call
      toast.error(customErrorHandler(error));
    }
  }

  async function getUserBetHistoryWise() {
    try {
      // Set toggle to false before hitting the endpoint
      SetToggle(false);
      // Make the API call
      const response = await getUserBetHistory_api({
        runnerId: runnerId,
        page: userBetHistory.currentPage,
        limit: userBetHistory.itemPerPage,
      });

      // Update state with the response data
      setUserBetHistory((prevState) => ({
        ...prevState,
        data: response.data,
        totalPages: response?.pagination?.totalPages,
        totalData: response?.pagination?.totalItems,
      }));
    } catch (error) {
      // Handle any errors that occur during the API call
      toast.error(customErrorHandler(error));
    }
  }

  async function getProfitLossLotteryEventWise(
    gameId,
    componentName,
    searchItem
  ) {
    try {
      // Set toggle to false before hitting the endpoint
      SetToggle(false);
      SetComponent(componentName);
      SetGameId(gameId);

      // Make the API call
      const response = await getProfitLossLotteryEvent({
        userName: UserName,
        gameId: gameId,
        pageNumber: profitLossLotteryEventData.currentPage,
        dataLimit: profitLossLotteryEventData.itemPerPage,
        searchName: profitLossLotteryEventData.searchItem,
      });

      // Update state with the response data
      SetProfitLossLotteryEventData((prevState) => ({
        ...prevState,
        data: response?.data,
        totalPages: response?.pagination?.totalPages,
        totalData: response?.pagination?.totalItems,
      }));
    } catch (error) {
      // Handle any errors that occur during the API call
      toast.error(customErrorHandler(error));
    }
  }

  async function getUserLotteryBetHistoryWise() {
    try {
      // Set toggle to false before hitting the endpoint
      SetToggle(false);
      // Make the API call
      const response = await getUserLotteryBetHistory_api({
        marketId: marketId,
      });

      // Update state with the response data
      setUserLotteryBetHistory((prevState) => ({
        ...prevState,
        data: response?.data,
        totalPages: response?.pagination?.totalPages,
        totalData: response?.pagination?.totalItems,
      }));
    } catch (error) {
      // Handle any errors that occur during the API call
      toast.error(customErrorHandler(error));
    }
  }

  const handelProfitLossEventDataPage = (page) => {
    SetProfitLossEventData((prevState) => ({
      ...prevState,
      currentPage: page,
    }));
  };

  const handelProfitLossRunnerDataPage = (page) => {
    SetProfitLossRunnerData((prevState) => ({
      ...prevState,
      currentPage: page,
    }));
  };

  const handelProfitLossLotteryEventDataPage = (page) => {
    SetProfitLossLotteryEventData((prevState) => ({
      ...prevState,
      currentPage: page,
    }));
  };

  const handelUserBetHistoryPage = (page) => {
    setUserBetHistory((prevState) => ({
      ...prevState,
      currentPage: page,
    }));
  };

  const handelUserLotteryBetHistoryPage = () => {
    setUserLotteryBetHistory((prevState) => ({
      ...prevState,
      currentPage: page,
    }));
  };

  let componentToRender;
  if (component === "ProfitAndLossEvent") {
    componentToRender = (
      <ProfitAndLossEvent
        data={profitLossEventData}
        SetComponent={SetComponent}
        SetMarketId={SetMarketId}
        SetProfitLossEventData={SetProfitLossEventData}
        currentPage={profitLossEventData.currentPage}
        SetToggle={SetToggle}
        totalItems={profitLossEventData.totalData}
        handlePageChange={(page) => handelProfitLossEventDataPage(page)}
        gameId={gameId}
        profitLossEventData={profitLossEventData}
        getProfitLossEventWise={getProfitLossEventWise}

      />
    );
  } else if (component === "UserBetHistory") {
    componentToRender = (
      <UserBetHistory
        SetComponent={SetComponent}
        data={userBetHistory}
        handlePageChange={(page) => handelUserBetHistoryPage(page)}
      />
    );
  } else if (component === "UserLotteryBetHistory") {
    componentToRender = (
      <UserLotteryBetHistory
        SetComponent={SetComponent}
        data={userLotteryBetHistory}
        handlePageChange={(page) => handelUserLotteryBetHistoryPage(page)}
      />
    );
  } else if (component === "ProfitAndLossLotteryEvent") {
    componentToRender = (
      <ProfitAndLossLotteryEvent
        data={profitLossLotteryEventData}
        SetComponent={SetComponent}
        SetMarketId={SetMarketId}
        SetProfitLossEventData={SetProfitLossLotteryEventData}
        currentPage={profitLossLotteryEventData.currentPage}
        SetToggle={SetToggle}
        totalItems={profitLossLotteryEventData.totalData}
        handlePageChange={(page) => handelProfitLossLotteryEventDataPage(page)}
        getProfitLossLotteryEventWise={getProfitLossLotteryEventWise}
        profitLossLotteryEventData={profitLossLotteryEventData}
      />
    );
  } else {
    componentToRender = (
      <ProfitAndLossRunner
        data={profitLossRunnerData}
        SetComponent={SetComponent}
        SetProfitLossRunnerData={SetProfitLossRunnerData}
        currentPage={profitLossRunnerData.currentPage}
        totalItems={profitLossRunnerData.totalData}
        SetRunnerId={SetRunnerId}
        handlePageChange={(page) => handelProfitLossRunnerDataPage(page)}
        marketId={marketId}
      />
    );
  }

  const handelItemPerPage = (event) => {
    SetProfitLossData((prevState) => ({
      ...prevState,
      itemPerPage: Number(event.target.value),
      currentPage: Number(currentPage),
    }));
  };

  const handleSearch = (e) => {
    SetProfitLossData((prev) => ({
      ...prev,
      searchItem: e.target.value,
    }));
  };

  return (
    <div className="col-sm-12 mt-3 px-3">
      {toggle && (
        <div className="card mb-3 w-100 rounded" style={{ marginTop: "150px" }}>
          <div
            className="card-body"
            style={{ backgroundColor: "#2CB3D1", borderRadius: "8px" }}
          >
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-9 col-md-9 text-center ">
                  <label className="fw-bold mb-1">Data Source</label>{" "}
                  <select
                    class="form-select fw-bold"
                    aria-label="Default select example"
                    onChange={(e) => {
                      SetProfitLossData((prevState) => ({
                        ...prevState,
                        dataSource: e.target.value,
                      }));
                    }}
                  >
                    <option className="fw-bold" value="live" selected>
                      Live Data
                    </option>
                    <option className="fw-bold" value="backup">
                      Backup Data
                    </option>
                    <option className="fw-bold" value="olddata">
                      Old Data
                    </option>
                  </select>
                </div>
                <div class="col-9 col-md-6 d-flex flex-column text-center">
                  {" "}
                  <label className="fw-bold mb-1">From:</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    placeholderText={"Select Start Date"}
                    className="form-control"
                    disabled={profitLossData.dataSource === "live"}
                    onKeyDown={(e) => e.preventDefault()} // Block manual input from keyboard
                  />
                </div>
                <div class="col-9 col-md-6 d-flex flex-column text-center">
                  {" "}
                  <label className="fw-bold mb-1">To:</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    placeholderText={"Select End Date"}
                    className="form-control"
                    disabled={profitLossData.dataSource === "live"}
                    onKeyDown={(e) => e.preventDefault()} // Block manual input from keyboard
                  />
                </div>
                <div class="col-12 col-md-9 d-flex align-items-end mt-3">
                  <button
                    className="btn btn-danger w-100 fw-bold"
                    disabled={startDate === null || endDate === null}
                    onClick={handleDateForProfitLoss}
                  >
                    Get Statement
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* card */}
      {toggle ? (
        <div class="card w-100 rounded">
          <div
            class="card-header text-white p-2 text-center text-uppercase h5"
            style={{ backgroundColor: "#2CB3D1" }}
          >
            <b>&nbsp;&nbsp;Profit & Loss</b>
          </div>
          <div className="m-1 row g-2 align-items-center">
            <div className="col-12 col-md-auto mb-1">
              <select
                className="form-select fw-bold"
                onChange={handelItemPerPage}
              >
                <option value="10" selected>
                  10 Entries
                </option>
                <option value="25">25 Entries</option>
                <option value="50">50 Entries</option>
                <option value="100">100 Entries</option>
              </select>
            </div>
            <div className="col-12 col-md-auto ms-auto">
              <input
                type="search"
                className="form-control"
                placeholder="Search..."
                onChange={handleSearch}
              />
            </div>
          </div>
          {/* Table */}
          <div class="table-responsive">
            <table className="table lms_table_active3 table-bordered">
              <thead>
                <tr
                  style={{
                    backgroundColor: "#e6e9ed",
                    color: "#5562a3",
                  }}
                  className="text-center"
                >
                  <th>
                    <h6 className="fw-bold">Sport Name</h6>
                  </th>
                  <th>
                    <h6 className="fw-bold">Profit & Loss</h6>
                  </th>
                  <th>
                    <h6 className="fw-bold">Commission</h6>
                  </th>
                  <th>
                    <h6 className="fw-bold">Total P&L</h6>
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataGameWise?.length > 0 ? (
                  dataGameWise?.map((data) => (
                    <tr align="center">
                      {" "}
                      <td
                        onClick={() =>
                          data?.gameName === "Lottery"
                            ? getProfitLossLotteryEventWise(
                              data?.gameId,
                              "ProfitAndLossLotteryEvent"
                            )
                            : getProfitLossEventWise(
                              data?.gameId,
                              "ProfitAndLossEvent"
                            )
                        }
                        className="text-primary fw-bold"
                        style={{ cursor: "pointer" }}
                      >
                        {data?.gameName}
                      </td>
                      <td
                        className={`fw-bold ${data?.totalProfitLoss > 0
                          ? "text-success"
                          : "text-danger"
                          }`}
                      >
                        {data?.totalProfitLoss}
                      </td>
                      <td>{data?.commission || 0}</td>
                      <td>
                        <span
                          className={`fw-bold ${data?.totalProfitLoss > 0
                            ? "text-success"
                            : "text-danger"
                            }`}
                        >
                          {data?.totalProfitLoss}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr align="center">
                    <td colspan="4">
                      <div
                          className="alert alert-danger fw-bold text-danger"
                        role="alert"
                      >
                        No Data Found !!
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
          {/* Table */}

          {/* No Data Found */}
          
          {/* End of No Data Found */}
          <li
            className="list-group-item"
            style={{
              overflowX: "auto",
              overflowY: "hidden",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* Pagination */}
            {dataGameWise?.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                startIndex={startIndex}
                endIndex={endIndex}
                totalData={totalData}
              />
            )}
            {/* Pagination */}
          </li>

        </div>
      ) : (
        <>{componentToRender}</>
      )}

      {/* card */}
    </div>
  );
};

export default ProfitLoss;
