import { useEffect, useState, useCallback } from "react";
import {
  LotteryRange,
  SearchLotteryTicketUser,
  PurhaseLotteryTicketUser,
} from "../../utils/apiService";
import { generateLotteryOptions } from "../../utils/helper";
import { getInitialLotteryData } from "../../utils/getInitiateState";
import updateLotteryMarketEventEmitter from "../common/updateLotteryMarketEventEmitter";
import { toast } from "react-toastify";

const useLotteryData = (MarketId) => {
  const [lotteryData, setLotteryData] = useState(getInitialLotteryData());

  // FETCHING ALL THE DROPDOWN DATA WITH RESPECT TO EACH MARKETiD ONLY
  const fetchLotteryData = useCallback(async () => {
    const response = await LotteryRange();
    console.log("line17", response);
    const marketData = response?.data?.find(
      (market) => market.marketId === MarketId
    );

    if (marketData) {
      const {
        group_start,
        group_end,
        series_start,
        series_end,
        number_start,
        number_end,
        marketName,
        start_time,
        end_time,
        isActive,
        price,
      } = marketData;

      const { groupOptions, seriesOptions, numberOptions } =
        generateLotteryOptions(
          group_start,
          group_end,
          series_start,
          series_end,
          number_start,
          number_end
        );

      setLotteryData((prevData) => ({
        ...prevData,
        groups: groupOptions,
        series: seriesOptions,
        numbers: numberOptions,
        marketName: marketName || "Unknown Market",

        endTimeForShowCountdown: end_time,
        startTimeForShowCountdown: start_time,
        isSuspend: !isActive,
        price: price,
      }));
    }
  }, [MarketId]);

  useEffect(() => {
    setLotteryData(getInitialLotteryData());
    fetchLotteryData();
  }, [MarketId]);

  // THE EVENT MESSAGE FOR  SSE(SERVER SIDE EVENT)
  useEffect(() => {
    console.log("[useEffect] Initialized: Listening for market updates...");
    const eventSource = updateLotteryMarketEventEmitter();
    console.log("EVENTsOURCE LINE62", eventSource);
    eventSource.onmessage = function (event) {
      const updates = JSON.parse(event.data);
      if (updates?.length) {
        updates.forEach((market) => {
          setLotteryData((prevData) => ({
            ...prevData,
            isSuspend: !market.isActive, // Update isSuspend dynamically
          }));

          if (market.isActive) {
            toast.success(`${market.marketName} is now Active`);
          } else {
            toast.info(`${market.marketName} has been Suspended`);
          }
        });
      }
    };

    eventSource.onerror = (err) => {
      console.error("[SSE] Connection error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // API FETCHING FOR THE SEARCH BUTTON AFTER WHICH THE SEARCHRESULTSNEW PAGE IS EXECUTED
  const handleSubmit = useCallback(
    async (values, { setSubmitting, resetForm }) => {
      const requestBody = {
        marketId: MarketId,
        sem: values.selectedSem ? parseInt(values.selectedSem) : null,
        group: values.selectedGroup,
        series: values.selectedSeries,
        number: values.selectedNumber,
      };

      const response = await SearchLotteryTicketUser(requestBody);
      console.log("Purchase successful", response);
      setLotteryData((prevData) => ({
        ...prevData,
        searchResult: response?.data || null, // Store search results
      }));

      resetForm();
      setSubmitting(false);
      setLotteryData((prevData) => ({
        ...prevData,
        refreshKey: prevData.refreshKey + 1, // Trigger refresh
      }));
    },
    [MarketId, setLotteryData]
  );

  // API FETCH FOR BUYING TICKETS FROM SEARCHRESULTSNEW PAGE
  const handleBuy = useCallback(async () => {
    if (!lotteryData?.searchResult) return;

    const body = {
      generateId: lotteryData.searchResult.generateId || "defaultId",
      lotteryPrice: lotteryData.searchResult.price || "5.00",
      marketId: MarketId || "defaultMarketId",
    };

    await PurhaseLotteryTicketUser(body);

    // Reset back to form after purchase
    setLotteryData((prevData) => ({
      ...prevData,
      searchResult: null,
    }));
  }, [lotteryData, MarketId]);
  return {
    lotteryData,
    setLotteryData,
    fetchLotteryData,
    handleSubmit,
    handleBuy,
  };
};

export default useLotteryData;
