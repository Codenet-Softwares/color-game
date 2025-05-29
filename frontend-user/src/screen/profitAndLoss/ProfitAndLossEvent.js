import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Pagination from "../common/Pagination";

const ProfitAndLossEvent = ({
  data,
  SetComponent,
  SetMarketId,
  SetProfitLossEventData,
  currentPage,
  SetToggle,
  totalItems,
  handlePageChange,
  getProfitLossEventWise,
  gameId,
  profitLossEventData
}) => {
  const startIndex = Math.min((profitLossEventData.currentPage - 1) * profitLossEventData.itemPerPage + 1, profitLossEventData.totalData);
  const endIndex = Math.min(profitLossEventData.currentPage * profitLossEventData.itemPerPage, profitLossEventData.totalData);
  const [renderApi, setRenderApi] = useState(null);

  const handelGotoRunnerWiseProfitLoss = (marketId, componentName) => {
    SetComponent(componentName);
    SetMarketId(marketId);
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

  useEffect(() => {
    let timer = setTimeout(() => {
      getProfitLossEventWise(gameId, "ProfitAndLossEvent", profitLossEventData.searchItem);
      
    }, 300);
    return () => clearTimeout(timer);
  }, [profitLossEventData.searchItem]);

  const handlePageChangeProfitAndLossEvent = async (page) => {
    handlePageChange(page);
    let flag = Math.random()
    setRenderApi(flag);
  }


  useEffect(() => {
    if (renderApi !== null) {
      getProfitLossEventWise(gameId, "ProfitAndLossEvent");
    }
  }, [renderApi,profitLossEventData.itemPerPage]);

  useEffect(() => {
      getProfitLossEventWise(gameId, "ProfitAndLossEvent");
  }, [ profitLossEventData.itemPerPage]);

  return (
    <>
      {/* card */}
      <div className="card w-100 rounded " style={{ marginTop: "150px" }}>
        <div
          className="card-header text-white p-2 d-flex justify-content-between align-items-center text-uppercase"
          style={{ backgroundColor: "#2CB3D1" }}
        >
          <b>&nbsp;&nbsp;Profit & Loss Events</b>
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
        <div className="m-1 row g-2 align-items-center">
          <div className="col-12 col-md-auto mb-1">
          <select

            className="form-select fw-bold"
            onChange={handleItemPerPage}

          >
            <option value="10">10 Entries</option>
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
                          <th>
                            Sport Name
                          </th>
                          <th>
                            Event Name
                          </th>
                          <th>
                            Profit & Loss
                          </th>
                          <th>
                            Commission
                          </th>
                          <th>
                            Total P&L
                          </th>
                        </tr>
                        </thead>
                        <tbody>

                        {data?.data?.length > 0 ? (
                          data?.data?.map((data, index) => (
                            <tr key={index} align="center">
                              <td>{data?.gameName}</td>
                              <td
                                className="text-primary fw-bold"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  handelGotoRunnerWiseProfitLoss(
                                    data.marketId,
                                    "ProfitAndLossRunner"
                                  );
                                }}
                              >
                                {data?.marketName}
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
                              <td
                                className={`fw-bold ${data?.totalProfitLoss > 0
                                  ? "text-success"
                                  : "text-danger"
                                  }`}
                              >
                                {data?.totalProfitLoss}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr align="center">
                            <td colspan="8">
                              <div
                                    class="alert alert-danger fw-bold"
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
                  handlePageChangeProfitAndLossEvent(page);
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

export default ProfitAndLossEvent;
