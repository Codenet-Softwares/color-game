import React, { useEffect, useState } from "react";
import AppDrawer from "../common/appDrawer";

import { Link, useParams } from "react-router-dom";
import Layout from "../layout/layout";
import {
  profitAndLossMarket_Api,
  profitAndLossRunner_Api,
} from "../../utils/apiService";
import Pagination from "../common/Pagination";
import { useAppContext } from "../../contextApi/context";
import strings from "../../utils/constant/stringConstant";

const GameNameList = () => {
 
  const { gameId } = useParams();
  const { dispatch } = useAppContext();

  const [totalEntries, setTotalEntries] = useState(5);
   //first table
   const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
  });
  
  const [runnerGameData, setRunnerGameData] = useState([]);
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 1);
  const [dateValue, setDateValue] = useState({
    startDate: defaultStartDate,
    endDate: new Date(),
  });

    //start index and end index 
    let startIndex = Math.min((pagination.currentPage - 1) * totalEntries + 1);
    let endIndex = Math.min(
      pagination.currentPage * totalEntries,
      pagination.totalItems
    );
 
    // format data 
  function formatDate(dateString) {
    let date = new Date(dateString);
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

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

  useEffect(() => {
      handleUserProfit();
  }, [pagination.currentPage, pagination.totalItems, totalEntries]);

  const handleUserProfit = async () => {
 
    dispatch({
      type: strings.isLoading,
      payload: true,
    });
    
    const response = await profitAndLossMarket_Api ({
      gameId: gameId,
      startDate: formatDate(dateValue.startDate),
      endDate: formatDate(dateValue.endDate),
      pageNumber: pagination.currentPage ,
      dataLimit: totalEntries,
    }, true);
   console.log("response line 89",response);
   setRunnerGameData(response.data);
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

  console.log("++++++++>line number 50",runnerGameData);


    const GetGameNameTableList = ({
      handleMarketClick,
      // for pagination table 1
      totalEntries,
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

        {runnerGameData.length > 0 ? (
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
            <table className="table table-bordered">
              <thead style={{ textAlign: "center" }}>
                <tr>
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
                    MarketName
                  </th>
                  <th
                    scope="col"
                    style={{ backgroundColor: "#2CB3D1", color: "white" }}
                  >
                    ProfitLoss
                  </th>
                </tr>
              </thead>
              <tbody style={{ textAlign: "center" }}>
                {runnerGameData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.gameName}</td>
                    <td style={{ cursor: "pointer", fontWeight: "bold" }}>
                      <Link to={`/marketNameList/${item.marketId}`}>{item.marketName}</Link>
                    </td>
                    <td style={{ color: item.totalProfitLoss >= 0 ? "green" : "red" }}>{item.totalProfitLoss}</td>
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
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              handlePageChange={handlePageChange}
              startIndex={startIndex}
              endIndex={endIndex}
              totalData={pagination.totalItems}
            />
          </div>
        </div>
      ) : (
        <div
          className="alert alert-info"
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
          <GetGameNameTableList
          //  handleMarketClick={handleMarketClick}
           // for pagination
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

 
  return (
    <>
    {getBody()}
    </>
  );
};
export default GameNameList;
