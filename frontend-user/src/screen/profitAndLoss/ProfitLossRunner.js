import React from "react";
import { toast } from "react-toastify";
import Pagination from "../common/Pagination";

const ProfitAndLossRunner = ({
  data,
  SetComponent,
  SetProfitLossRunnerData,
  currentPage,
  totalItems,
  SetRunnerId,
  handlePageChange
}) => {
  const startIndex = Math.min((data.currentPage - 1) * data.itemPerPage + 1);
  const endIndex = Math.min(data.currentPage * data.itemPerPage, data.totalData);

  const handleItemPerPage = (event) => {
    console.log("")
    SetProfitLossEventData((prevState) => ({
      ...prevState,
      itemPerPage: Number(event.target.value),
      currentPage: Number(prevState.currentPage),
    }));
  };

  const handleSearch = (e) => {
    SetProfitLossRunnerData((prev) => ({
      ...prev,
      searchItem: e.target.value,
    }));
  };

  const handelGotoBetHistory = (runnerId, componentName) => {
    SetComponent(componentName);
    SetRunnerId(runnerId);
  };

  return (
    <>
      {/* card */}
      <div className="card w-100 rounded"  style={{ marginTop: "150px" }}>
        <div
          className="card-header text-white p-2 d-flex justify-content-between align-items-center text-uppercase"
          style={{ backgroundColor: "#2CB3D1" }}
        >
          <b>&nbsp;&nbsp;Profit & Loss Markets</b>
          <span
            style={{ cursor: "pointer" }}
            title="Back"
            onClick={() => {
              SetComponent("ProfitAndLossEvent");
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

            <div className="table-responsive">
              {data?.data?.length === 0 && totalItems !== 0 ? ( // Problem : if really no data from server always it is spinning
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
                            Sport Name
                          </th>
                          <th scope="col">
                            Event Name
                          </th>
                          <th scope="col">
                            Market Id
                          </th>
                          <th scope="col">
                            Market Name
                          </th>
                          <th scope="col">
                            Result
                          </th>
                          <th scope="col">
                            Profit & Loss
                          </th>
                          <th scope="col">
                            Commission
                          </th>
                          <th scope="col">
                            Settle Time
                          </th>
                        </tr>
                        {data?.data?.length > 0 ? (
                          data?.data?.map((data, index) => (
                            <tr key={index} align="center">
                              <td>{data?.gameName}</td>
                              <td>{data?.marketName}</td>
                              <td>{data?.marketId || "NDS"}</td>
                              <td
                                className="text-primary fw-bold"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  handelGotoBetHistory(
                                    data?.runnerId,
                                    "UserBetHistory"
                                  );
                                }}
                              >
                                {data?.isWin ? "WINNER" : "MATCH ODD"}
                              </td>
                              {/* <td>{data?.isWin?"WINNER":"MATCH ODD"}</td> */}
                              <td>{data?.runnerName}</td>
                              <td
                                className={`fw-bold ${data?.profitLoss > 0
                                  ? "text-success"
                                  : "text-danger"
                                  }`}
                              >
                                {data?.profitLoss}
                              </td>
                              <td>0</td>
                              <td>{"NDS"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr align="center">
                            <td colspan="8">
                              <div
                                class="alert alert-info fw-bold"
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
          <li className="list-group-item overflow-auto">
            {/* Pagination */}
            {data?.data?.length > 0 && (
              <Pagination
                currentPage={data.currentPage}
                totalPages={data.totalPages}
                handlePageChange={(page) => {
                  handlePageChange(page);
                }}
                startIndex={startIndex}
                endIndex={endIndex}
                totalData={data.totalData}
              />
            )}
            {/* Pagination */}
          </li>
      </div>
      {/* card */}
    </>
  );
};

export default ProfitAndLossRunner;
