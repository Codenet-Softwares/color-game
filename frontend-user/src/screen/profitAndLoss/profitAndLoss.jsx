import React, { useEffect, useState } from "react";
import AppDrawer from "../common/appDrawer";
import Layout from "../layout/layout";
import { getprofitLossDataState } from "../../utils/getInitiateState";
import ProfitLoss from "./ProfitLoss";
import { getProfitLossGame } from "../../utils/apiService";
import { toast } from "react-toastify";
import { customErrorHandler } from "../../utils/helper";

const ProfitAndLoss = () => {
  const [profitLossData, SetProfitLossData] = useState(
    getprofitLossDataState()
  );

  const formatDate = (dateString) => {
    // Parse the date string to create a Date object
    const date = new Date(dateString);

    // Extract the year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, "0");

    // Format the date as "YYYY-MM-DD"
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    getProfitLossGameWise();
  }, [
    profitLossData.startDate,
    profitLossData.endDate,
    profitLossData.currentPage,
    profitLossData.itemPerPage,
    // profitLossData.searchItem,
    profitLossData.dataSource,
  ]);

  // Debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (profitLossData.searchItem.trim() !== "") {
        getProfitLossGameWise();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [profitLossData.searchItem]);

  // For Game wise Profit Loss Data to show
  async function getProfitLossGameWise() {
    try {
      // Make the API call
      const response = await getProfitLossGame({
        fromDate: profitLossData.startDate,
        toDate: profitLossData.endDate,
        page: profitLossData.currentPage,
        limit: profitLossData.itemPerPage,
        searchName: profitLossData.searchItem,
        dataSource: profitLossData.dataSource,
      });

      // Update state with the response data
      SetProfitLossData((prevState) => ({
        ...prevState,
        dataGameWise: response?.data,
        totalPages: response?.pagination?.totalPages,
        totalData: response?.pagination?.totalItems,
        isLoading: true,
      }));
    } catch (error) {
      // Handle any errors during the API call
      toast.error(customErrorHandler(error));
    } finally {
      SetProfitLossData((prev) => ({ ...prev, isLoading: false }));
    }
  }

  const handleDateForProfitLoss = () => {
    const start = new Date(profitLossData.backupStartDate);
    const end = new Date(profitLossData.backupEndDate);

    if (end < start) {
      toast.warn("End date cannot be earlier than start date.");
      return;
    }

    SetProfitLossData((prevState) => ({
      ...prevState,
      startDate: formatDate(start),
      endDate: formatDate(end),
    }));
  };

  const handlePageChange = (page) => {
    SetProfitLossData((prevState) => ({
      ...prevState,
      currentPage: page,
    }));
  };
  return (
    <div data-aos="zoom-in">
      <AppDrawer showCarousel={false}>
        <Layout />
        <div  style={{  paddingTop:"20px"}}>
          <ProfitLoss
            dataGameWise={profitLossData.dataGameWise}
            startDate={profitLossData.backupStartDate}
            endDate={profitLossData.backupEndDate}
            setStartDate={(date) =>
              SetProfitLossData((prevState) => ({
                ...prevState,
                backupStartDate: date,
              }))
            }
            setEndDate={(date) =>
              SetProfitLossData((prevState) => ({
                ...prevState,
                backupEndDate: date,
              }))
            }
            currentPage={profitLossData.currentPage}
            totalData={profitLossData.totalData}
            totalPages={profitLossData.totalPages}
            handlePageChange={handlePageChange}
            SetProfitLossData={SetProfitLossData}
            handleDateForProfitLoss={handleDateForProfitLoss}
            profitLossData={profitLossData}
          />
        </div>
      </AppDrawer>
    </div>
  );
};
export default ProfitAndLoss;
