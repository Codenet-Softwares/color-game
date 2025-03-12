import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import updateLotteryMarketEventEmitter from "../common/updateLotteryMarketEventEmitter";
import { getInitialLotteryData } from "../../utils/getInitiateState";
import { generateLotteryOptions } from "../../utils/helper";
import {
  LotteryRange,
  SearchLotteryTicketUser,
  PurhaseLotteryTicketUser,
} from "../../utils/apiService";
import { useAppContext } from "../../contextApi/context";

const useLotteryData = (MarketId) => {
  const { updateWalletAndExposure } = useAppContext(); // Get update function from context for wallet and exposure
  const [lotteryData, setLotteryData] = useState(getInitialLotteryData());

  //all input boxes with dropdown defined here
  const DROPDOWN_FIELDS = [
    { label: "Sem Value", stateKey: "semValues", field: "selectedSem" },
    { label: "Group", stateKey: "groups", field: "selectedGroup" },
    { label: "Series", stateKey: "series", field: "selectedSeries" },
    { label: "Number", stateKey: "numbers", field: "selectedNumber" },
  ];

  // FETCHING ALL THE DROPDOWN DATA WITH RESPECT TO EACH MARKETID ONLY
  const fetchLotteryData = useCallback(async () => {
    const response = await LotteryRange();

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
  }, [MarketId, lotteryData.isUpdate]);

  // THE EVENT MESSAGE FOR SSE(SERVER SIDE EVENT)
  useEffect(() => {
    const eventSource = new EventSource("https://lottery.server.dummydoma.in/lottery-events");
    eventSource.onmessage = function (event) {
      try {
        const updates = JSON.parse(event.data);
        console.log("Parsed updates:", updates);

        if (updates?.length) {
          updates.forEach((market) => {
            setLotteryData((prevData) => ({
              ...prevData,
              isSuspend: !market.isActive, // Update isSuspend dynamically
              isUpdate: market.updatedAt,
            }));

            if (market.isActive) {
              toast.success(`${market.marketName} is now Active`);
            } else {
              toast.info(`${market.marketName} has been Suspended`);
            }
          });
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    eventSource.onerror = () => {
      console.error("SSE connection lost. Trying to reconnect...");
      setTimeout(() => {
        window.location.reload();
      }, 5000);
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

    //  Update wallet & exposure after purchase
    updateWalletAndExposure();

    // Reset back to form after purchase
    setLotteryData((prevData) => ({
      ...prevData,
      searchResult: null,
    }));
  }, [lotteryData, MarketId]);

  //back button after search button clicked
  const handleBack = () => {
    setLotteryData((prevData) => ({
      ...prevData,
      searchResult: null,
    }));
  };

  return {
    lotteryData,
    fetchLotteryData,
    handleSubmit,
    handleBuy,
    handleBack,
    DROPDOWN_FIELDS,
  };
};

export default useLotteryData;
