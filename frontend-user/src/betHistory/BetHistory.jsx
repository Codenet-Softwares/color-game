import React, { useEffect, useState } from "react";
import { getBetHistory } from "../utils/getInitiateState";
import {
  getDataFromHistoryLandingPage,
  getOpenBetsGame,
  user_getBackLayData_api,
  user_getBetHistory_api,
  user_getLotteryBetHistory_api,
} from "../utils/apiService";
import History from "./components/history/History";
import OpenBets from "./components/openBets/OpenBets";
import AppDrawer from "../screen/common/appDrawer";
import Layout from "../screen/layout/layout";
import { formatDate } from "../utils/helper";

const BetHistory = () => {
  const [betHistoryData, setBetHistoryData] = useState(getBetHistory());

  const handleBetHistorySelectionMenu = (e) => {
    const { name, value } = e.target;

    setBetHistoryData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePageChange = (pageNumber) => {
    setBetHistoryData((prev) => ({
      ...prev,
      currentPage: pageNumber,
    }));
  };

  const handleDateValue = (name, value) => {
    setBetHistoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const renderNoDataFound = () => {
    return (
      <div class="alert alert-danger text-center mt-2" role="alert">
        No data found
      </div>
    );
  };

  const openBetsGame = async () => {
    const response = await getOpenBetsGame();
    if (response?.data) {
      setBetHistoryData((prev) => ({
        ...prev,
        openBetGameNames: response.data,
      }));
    }
  };

  async function handleGetSelectData() {
    const response = await getDataFromHistoryLandingPage();
    if (response?.data) {
      setBetHistoryData((prev) => ({
        ...prev,
        gameSelectionData: response.data,
      }));
    }
  }

  useEffect(() => {
    handleGetSelectData();
    openBetsGame();
  }, []);

  async function handleGetHistory() {
    const response = await user_getBetHistory_api({
      gameId: betHistoryData.selectGame,
      pageNumber: betHistoryData.currentPage,
      dataLimit: betHistoryData.totalEntries,
      startDate: formatDate(betHistoryData.startDate),
      endDate: formatDate(betHistoryData.endDate),
      dataSource: betHistoryData.dataSource,
      type: betHistoryData.selectMenu,
    });

    if (response?.data) {
      setBetHistoryData((prev) => ({
        ...prev,
        history: response.data,
        totalPages: response?.pagination?.totalPages || 0,
        totalData: response?.pagination?.totalItems || 0,
        gameType: "Colorgame",
      }));
    } else {
      //add loading part //
    }
  }

  async function getHistoryForLotteryBetHistory() {
    const response = await user_getLotteryBetHistory_api({
      gameId: betHistoryData.selectGame,
      pageNumber: betHistoryData.currentPage,
      dataLimit: betHistoryData.totalEntries,
      startDate: formatDate(betHistoryData.startDate),
      endDate: formatDate(betHistoryData.endDate),
      dataSource: betHistoryData.dataSource,
      type: betHistoryData.selectMenu,
    });

    if (response?.data) {
      setBetHistoryData((prev) => ({
        ...prev,
        history: response.data,
        totalPages: response?.pagination?.totalPages || 0,
        totalData: response?.pagination?.totalItems || 0,
        gameType: "Lottery",
      }));
    } else {
      //add loading part //
    }
  }

  async function handleGetData() {
    const response = await user_getBackLayData_api({
      marketId: betHistoryData?.selectColorGame,
    });
    if (response?.data) {
      setBetHistoryData((prev) => ({
        ...prev,
        openBet: response.data,
      }));
    }
  }

  useEffect(() => {
    if (betHistoryData?.selectColorGame != "") {
      handleGetData();
    }
  }, [betHistoryData?.selectColorGame]);

  useEffect(() => {
    if(betHistoryData.selectGame===!""){
    if (betHistoryData.selectGame === "lottery") {
      getHistoryForLotteryBetHistory();
    } else {
      handleGetHistory();
    }}
  }, [
    betHistoryData.currentPage,
    betHistoryData.totalItems,
    betHistoryData.totalEntries,
  ]);

  return (
    <AppDrawer showCarousel={false}>
      <Layout />
      <div className="row">
        <div className="col-lg-12">
          <History
            betHistoryData={betHistoryData}
            getHistoryForLotteryBetHistory={getHistoryForLotteryBetHistory}
            handleGetHistory={handleGetHistory}
            handleBetHistorySelectionMenu={handleBetHistorySelectionMenu}
            renderNoDataFound={renderNoDataFound}
            handlePageChange={handlePageChange}
            handleDateValue={handleDateValue}
          />
        </div>

        {/* <div className="col-lg-3">
          <OpenBets
            betHistoryData={betHistoryData}
            handleBetHistorySelectionMenu={handleBetHistorySelectionMenu}
          />
        </div> */}
      </div>
    </AppDrawer>
  );
};

export default BetHistory;
