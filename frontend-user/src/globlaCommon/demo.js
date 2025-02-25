import React, { useEffect, useState, useCallback } from "react";
import { Formik, Form } from "formik";
import ReusableDropdown from "../../globlaCommon/ReusableDropdown";
import { LotteryRange, SearchLotteryTicketUser } from "../../utils/apiService";
import { generateLotteryOptions } from "../../utils/helper";
import lotteryValidationSchema from "../../schema/lotteryValidationSchema";
import { getInitialFormValues, getInitialLotteryData } from "../../utils/getInitiateState";
import SearchResultsNew from "./SearchResultsNew";
import "./LotteryUserPurchase.css";
import moment from "moment";
import CountdownTimer from "../../globlaCommon/CountdownTimer";

const LotteryUserPurchase = ({ MarketId }) => {
  const [lotteryData, setLotteryData] = useState(getInitialLotteryData());

  const fetchLotteryData = useCallback(async () => {
    const response = await LotteryRange();
    const marketData = response?.data?.find((market) => market.marketId === MarketId);

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
      } = marketData;
      const { groupOptions, seriesOptions, numberOptions } = generateLotteryOptions(
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
        isActive,
      }));
    }
  }, [MarketId]);

  useEffect(() => {
    setLotteryData(getInitialLotteryData());
    fetchLotteryData();
  }, [MarketId]);

  const handleSubmit = useCallback(async (values, { setSubmitting, resetForm }) => {
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
      searchResult: response?.data || null,
    }));

    resetForm();
    setSubmitting(false);
    setLotteryData((prevData) => ({
      ...prevData,
      refreshKey: prevData.refreshKey + 1,
    }));
  }, [MarketId]);

  const handleBack = () => {
    setLotteryData((prevData) => ({
      ...prevData,
      searchResult: null,
    }));
  };

  const DROPDOWN_FIELDS = [
    { label: "Sem Value", stateKey: "semValues", field: "selectedSem" },
    { label: "Group", stateKey: "groups", field: "selectedGroup" },
    { label: "Series", stateKey: "series", field: "selectedSeries" },
    { label: "Number", stateKey: "numbers", field: "selectedNumber" },
  ];

  return (
    <div className="outer-container">
      <div className={`form-wrapper ${!lotteryData.isActive ? "blurred" : ""}`}>
        <div className="form-container">
          <h4>
            Lottery User Purchase - <span style={{ color: "#4682B4" }}>{lotteryData.marketName}</span>
          </h4>
          {lotteryData.isActive && new Date(moment(lotteryData.startTimeForShowCountdown).local().subtract(5, "hours").subtract(30, "minutes").subtract(45, "seconds").toDate()) < new Date() && (
            <CountdownTimer endDate={lotteryData.endTimeForShowCountdown} fontSize={"16px"} />
          )}
          <Formik
            key={lotteryData.refreshKey}
            initialValues={getInitialFormValues()}
            enableReinitialize
            validationSchema={lotteryValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, errors, touched, isSubmitting }) => (
              <Form>
                {DROPDOWN_FIELDS.map(({ label, stateKey, field }) => (
                  <div key={field} className="mb-3">
                    <ReusableDropdown
                      name={label}
                      options={lotteryData[stateKey]}
                      onSelect={(value) => setFieldValue(field, value || null)}
                      error={errors[field]}
                      touched={touched[field]}
                    />
                  </div>
                ))}
                <button type="submit" className="btn text-uppercase text-white submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Search"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      {!lotteryData.isActive && (
        <div className="suspended-overlay">
          <div className="suspended-message">
            <h3>Lottery Market Suspended</h3>
            <p>The lottery market is currently unavailable.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LotteryUserPurchase;
