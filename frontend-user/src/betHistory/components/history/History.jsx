import React from "react";
import { Pagination } from "react-bootstrap";
import FilterBlock from "./components/FilterBlock";
import Table from "./components/Table";

const History = ({
  handleGetHistory,
  getHistoryForLotteryBetHistory,
  betHistoryData,
  handleBetHistorySelectionMenu,
  renderNoDataFound,
  handlePageChange,
  handleDateValue,
  setBetHistoryData,
}) => {
  return (
    <div>
      <FilterBlock
        getHistoryForLotteryBetHistory={getHistoryForLotteryBetHistory}
        handleGetHistory={handleGetHistory}
        betHistoryData={betHistoryData}
        handleBetHistorySelectionMenu={handleBetHistorySelectionMenu}
        handleDateValue={handleDateValue}
      />

      <Table
        betHistoryData={betHistoryData}
        renderNoDataFound={renderNoDataFound}
        handleBetHistorySelectionMenu={handleBetHistorySelectionMenu}
        handlePageChange={handlePageChange}
        setBetHistoryData={setBetHistoryData}
      />
    </div>
  );
};

export default History;
