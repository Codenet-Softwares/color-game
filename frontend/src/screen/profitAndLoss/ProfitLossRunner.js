import React from "react";
import { toast } from "react-toastify";
import Pagination from "../common/Pagination";

const ProfitAndLossRunner = ({
  data,
  SetComponent,
  SetProfitLossRunnerData,
  currentPage,
  totalItems,
  SetRunnerId
}) => {
  console.log("data", data);
  const startIndex = Math.min((data.currentPage - 1) * 10 + 1);
  const endIndex = Math.min(data.currentPage * 10, data.totalData);

  const handelItemPerPage = (event) => {
    console.log("event.target.value", event.target.value);
    SetProfitLossRunnerData((prevState) => ({
      ...prevState,
      itemPerPage: Number(event.target.value),
      currentPage: Number(currentPage),
    }));
    toast.error("Work Pending From ServerSide");
  };
  const handleSearch = (e) => {
    SetProfitLossRunnerData((prev) => ({
      ...prev,
      searchItem: e.target.value,
    }));
  };

  const handelGotoBetHistory = (runnerId, componentName) => {
    console.log("qwerty",runnerId)
    SetComponent(componentName);
    SetRunnerId(runnerId);
  };

  return (
    <>
      {/* card */}
      <div className="card w-100 rounded">
        <div
          className="card-heade text-white p-1 d-flex justify-content-between"
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
        <div className="m-1 d-flex justify-content-between align-items-center">
          <select
            className="form-select w-auto m-1"
            onChange={handelItemPerPage}
          >
            <option value="10" selected>
              10 Entries
            </option>
            <option value="25">25 Entries</option>
            <option value="50">50 Entries</option>
            <option value="100">100 Entries</option>
          </select>
          <input
            type="search"
            className="form-control w-auto"
            placeholder="Search..."
            onChange={handleSearch}
          />
        </div>

        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <div className="white_card_body">
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
                            <b>Sport Name</b>
                          </th>
                          <th scope="col">
                            <b>Event Name</b>
                          </th>
                          <th scope="col">
                            <b>Market Id</b>
                          </th>
                          <th scope="col">
                            <b>Market Name</b>
                          </th>
                          <th scope="col">
                            <b>Result</b>
                          </th>
                          <th scope="col">
                            <b>Profit & Loss</b>
                          </th>
                          <th scope="col">
                            <b>Commission</b>
                          </th>
                          <th scope="col">
                            <b>Settle Time</b>
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
          </li>
          <li className="list-group-item">
            {/* Pagination */}
            {data?.data?.length > 0 && (
              <Pagination
                currentPage={data.currentPage}
                totalPages={data.totalPages}
                handlePageChange={data.handlePageChange}
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

export default ProfitAndLossRunner;
