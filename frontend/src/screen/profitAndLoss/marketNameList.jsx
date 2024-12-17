import React, { useEffect, useState } from "react";
import AppDrawer from "../common/appDrawer";
import Layout from "../layout/layout";
import { useParams } from "react-router-dom";
import Pagination from "../common/Pagination";
import { profitAndLossRunner_Api } from "../../utils/apiService";
import strings from "../../utils/constant/stringConstant";
import { useAppContext } from "../../contextApi/context";

const MarketNameList = () => {
  const { marketId } = useParams();
  console.log("++++++++++*******>runnerData", marketId);
  const [marketData, setMarketData] = useState([]);
  const { dispatch } = useAppContext();
  const [totalEntries, setTotalEntries] = useState(5);
     //first table
     const [pagination, setPagination] = useState({
      totalItems: 0,
      currentPage: 1,
      totalPages: 1,
    });
      //first table
  let startIndex = Math.min((pagination.currentPage - 1) * totalEntries + 1);
  let endIndex = Math.min(
    pagination.currentPage * totalEntries,
    pagination.totalItems
  );

  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 1);
  const [dateValue, setDateValue] = useState({
    startDate: defaultStartDate,
    endDate: new Date(),
  });

  const handleDateValue = (name, value) => {
    setDateValue((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

    // entries for no. of entries for pagination
    const handleEntriesChange = (event) => {
      const entries = Number(event.target.value);
      console.log("entries", entries);
      setTotalEntries(entries);
      // After updating totalItems, we need to fetch data for the first page with the new number of items
      setPagination((prevState) => ({
        ...prevState,
        currentPage: 1,
      }));
    };

      // pagination handlechange (to be solved later )
  const handlePageChange = (pageNumber) => {
    setPagination((prevState) => ({
      ...prevState,
      currentPage: pageNumber,
    }));
  };

  function formatDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    handleMarketData();
  }, [ pagination.currentPage, pagination.totalItems, totalEntries ]);

  //  check this api for third table
  const handleMarketData = async () => {

    dispatch({
      type: strings.isLoading,
      payload: true,
    });

    const response = await profitAndLossRunner_Api({
      marketId: marketId,
      startDate: formatDate(dateValue.startDate),
      endDate: formatDate(dateValue.endDate),
      pageNumber: pagination.currentPage,
      dataLimit: totalEntries,
    });
    setMarketData(response.data);
    setPagination((prevState) => ({
      ...prevState,
      totalPages: response.pagination.totalPages,
      totalItems: response.pagination.totalItems,
    }));

    dispatch({
      type: strings.isLoading,
      payload: false,
    });
  };

  const MarketNameTableList = ({
   
  // for pagination table 1
    totalEntries ,
    handleEntriesChange,
    currentPage,
    totalPages,
    handlePageChange,
    startIndex,
    endIndex,
    totalItems
  }) => {
    return (
      <>
        <div style={{ marginTop: "120px" }}>
          {marketData.length > 0 ? (
            <div className="card p-0 section" style={{ marginTop: "15px" }}>
              <div
                className="table-container overflow-x-scroll"
                style={{ overflowX: "auto", margin: "10px" }}
              >
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
                <table className="table table-bordered" style={{textAlign:"center"}}>
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        style={{ backgroundColor: "#2CB3D1", color: "white" }}
                      >
                        RunnerName
                      </th>

                      <th
                        scope="col"
                        style={{ backgroundColor: "#2CB3D1", color: "white" }}
                      >
                        MarketName
                      </th>
                      <th
                        scope="col"
                        style={{ backgroundColor: "#2CB3D1", color: "white" }}
                      >
                        GameName
                      </th>
                      <th
                        scope="col"
                        style={{ backgroundColor: "#2CB3D1", color: "white" }}
                      >
                        ProfitLoss
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{textAlign:"center"}}>
                    {marketData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.runnerName}</td>
                        <td>{item.marketName}</td>
                        <td>{item.gameName}</td>
                        <td style={{ color: item.profitLoss >= 0 ? "green" : "red"  }}>{item.profitLoss}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                style={{
                  margin: "10px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalData={totalItems}
                />
              </div>
            </div>
          ) : (
            <div
              class="alert alert-info"
              role="alert"
              style={{ textAlign: "center" }}
            >
              NO DATA FOUND !!
            </div>
          )}
        </div>
      </>
    );
  };

  const getBody = () => {
    return (
      <>
        <AppDrawer showCarousel={false}>
          <Layout />
          <MarketNameTableList
            totalEntries={totalEntries}
            handleEntriesChange={handleEntriesChange}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            handlePageChange={handlePageChange}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={pagination.totalItems}
            pagination={true}
          />
        </AppDrawer>
      </>
    );
  };
  return <>{getBody()}</>;
};

export default MarketNameList;
