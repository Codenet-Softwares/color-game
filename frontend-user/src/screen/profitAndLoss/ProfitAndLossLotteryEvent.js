import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Pagination from "../common/Pagination";
// import { capitalizeEachWord } from "../../utils/helper";

const ProfitAndLossLotteryEvent = ({
  data,
  SetComponent,
  SetMarketId,
  SetProfitLossEventData,
  currentPage,
  SetToggle,
  totalItems,
  handlePageChange,
  profitLossLotteryEventData,
  getProfitLossLotteryEventWise,
}) => {
  const startIndex = Math.min((profitLossLotteryEventData.currentPage - 1) * profitLossLotteryEventData.itemPerPage + 1, profitLossLotteryEventData.totalData);
  const endIndex = Math.min(profitLossLotteryEventData.currentPage * profitLossLotteryEventData.itemPerPage, profitLossLotteryEventData.totalData);
  const [renderApi, setRenderApi] = useState(null);

  const handelGotoLotteryBetHistory = (componentName, id) => {
    SetComponent(componentName);
    SetMarketId(id);
  };
  const handleItemPerPage = (event) => {

    SetProfitLossEventData((prevState) => ({
      ...prevState,
      itemPerPage: Number(event.target.value),
      currentPage: Number(prevState.currentPage),
    }));
  };

  const handleSearch = (e) => {
    SetProfitLossEventData((prev) => ({
      ...prev,
      searchItem: e.target.value,
    }));
  };

  // useEffect(() => {
  //   let timer = setTimeout(() => {
  //     getLotteryProfitLossEventWise(
  //       null,
  //       "ProfitAndLossLotteryEvent",
  //       profitLossLotteryEventData.searchItem
  //     );
  //   }, 300);
  //   return () => clearTimeout(timer);
  // }, [profitLossLotteryEventData.searchItem]);

  const handlePageChangeProfitAndLossLotteryEvent = async (page) => {
    handlePageChange(page);
    let flag = Math.random();
    setRenderApi(flag);
  };

  useEffect(() => {
    if (renderApi !== null) {
      getProfitLossLotteryEventWise(null, "ProfitAndLossLotteryEvent");
    }
  }, [renderApi]);



  useEffect(() => {
    getProfitLossLotteryEventWise(null, "ProfitAndLossLotteryEvent");
  }, [profitLossLotteryEventData.itemPerPage]);


  return (
    <>
      {/* card */}
      <div className="card w-100 rounded" style={{ marginTop: "90px", paddingBottom: "80px" }}>
        <div
          className="card-heade text-white p-1 d-flex justify-content-between rounded-top border-bottom-0 border-4 border-dark border-top"
          style={{ backgroundColor: "#2B4758" }}
        >
          <b className="text-uppercase">&nbsp;&nbsp;Profit & Loss Events</b>
          <span
            style={{ cursor: "pointer" }}
            title="Back"
            onClick={() => {
              SetToggle(true);
            }}
          >
            {" "}
            <i className="fas fa-arrow-left"></i>
          </span>
        </div>
        <div className="m-1 d-flex justify-content-between align-items-center">
          <select
            className="form-select w-auto m-1"
            onChange={(e) => handleItemPerPage(e)}
            defaultValue="10"
          >
            <option value="10">10 Entries</option>
            <option value="25">25 Entries</option>
            <option value="50">50 Entries</option>
            <option value="100">100 Entries</option>
          </select>
          {/* <input
            type="search"
            className="form-control w-auto"
            placeholder="Search..."
            onChange={handleSearch}
          /> */}
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <div className="white_card_body">
              {data?.data?.length === 0 && totalItems !== 0 ? (
                // Loader
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "100px" }}
                >
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                // Table
                <div className="QA_section" style={{ overflowX: "auto" }}>
                  <div className="QA_table mb_30">
                    <table className="table lms_table_active3 table-bordered">
                      <thead>
                        <tr
                          style={{
                            backgroundColor: "#e6e9ed",
                            color: "#5562a3",
                          }}
                          align="center"
                        >
                          <th scope="col">
                            <b>Sport Name</b>
                          </th>
                          <th scope="col">
                            <b>Event Name</b>
                          </th>
                          <th scope="col">
                            <b>Profit & Loss</b>
                          </th>
                          <th scope="col">
                            <b>Commission</b>
                          </th>
                          <th scope="col">
                            <b>Total P&L</b>
                          </th>
                        </tr>
                        {data?.data?.length > 0 ? (
                          data?.data?.map((data, index) => (
                            <tr key={index} align="center">
                              <td>{data?.gameName}</td>
                              <td
                                className="text-primary fw-bold"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  handelGotoLotteryBetHistory(
                                    "UserLotteryBetHistory",
                                    data.marketId
                                  );
                                }}
                              >
                                {data?.marketName}
                              </td>
                              <td
                                className={`fw-bold ${data?.profitLoss > 0
                                    ? "text-success"
                                    : "text-danger"
                                  }`}
                              >
                                {data?.profitLoss}
                              </td>
                              <td>{data?.commission || 0}</td>
                              <td
                                className={`fw-bold ${data?.profitLoss > 0
                                    ? "text-success"
                                    : "text-danger"
                                  }`}
                              >
                                {data?.profitLoss}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr align="center">
                            <td colspan="5">
                              <div
                                class="alert alert-danger fw-bold"
                                role="alert"
                              >
                                No Data Found !!
                              </div>
                            </td>
                          </tr>
                        )}
                      </thead>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </li>
          <li className="list-group-item overflow-auto">
            {/* Pagination */}
            {data?.data?.length > 0 && (
              <Pagination
                currentPage={data.currentPage}
                totalPages={data.totalPages}
                handlePageChange={(page) => {
                  handlePageChangeProfitAndLossLotteryEvent(page);
                }}
                startIndex={startIndex}
                endIndex={endIndex}
                totalData={data.totalData}
              />
            )}
            {/* Pagination */}
          </li>
        </ul>
      </div>
      {/* card */}
    </>
  );
};

export default ProfitAndLossLotteryEvent;
