import React, { useEffect, useState, useCallback } from "react";
import { Formik, Form } from "formik";
import ReusableDropdown from "../../globlaCommon/ReusableDropdown";
import { LotteryRange, SearchLotteryTicketUser } from "../../utils/apiService";
import { generateLotteryOptions } from "../../utils/helper";
import lotteryValidationSchema from "../../schema/lotteryValidationSchema";
import {
  getInitialFormValues,
  getInitialLotteryData,
} from "../../utils/getInitiateState";

const LotteryUserPurchase = ({ MarketId }) => {
  const [lotteryData, setLotteryData] = useState(getInitialLotteryData());

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
      }));
    }
  }, [MarketId]);

  // Reset state when MarketId changes
  useEffect(() => {
    setLotteryData(getInitialLotteryData()); // Reset search result and form state
    fetchLotteryData();
  }, [MarketId]); // Runs when MarketId changes

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
    [MarketId]
  );
  //back button after search button clicked
  const handleBack = () => {
    setLotteryData((prevData) => ({
      ...prevData,
      searchResult: null, // Reset search result to go back
    }));
  };
  const DROPDOWN_FIELDS = [
    { label: "Sem Value", stateKey: "semValues", field: "selectedSem" },
    { label: "Group", stateKey: "groups", field: "selectedGroup" },
    { label: "Series", stateKey: "series", field: "selectedSeries" },
    { label: "Number", stateKey: "numbers", field: "selectedNumber" },
  ];
  return (
    <div className="mt-5">
      <h3>
        Lottery User Purchase -{" "}
        <span style={{ color: "#4682B4" }}>{lotteryData.marketName}</span>
      </h3>
      {lotteryData?.searchResult && lotteryData?.searchResult ? (
        <div className="card p-4 shadow mt-4">
          <h4>Search Results</h4>
          <p>
            <strong>Generate ID:</strong> {lotteryData.searchResult.generateId}
          </p>
          <p>
            <strong>Price:</strong> ${lotteryData.searchResult.price}
          </p>
          <p>
            <strong>Sem:</strong> {lotteryData.searchResult.sem}
          </p>
          <h5>Tickets</h5>
          <ul>
            {lotteryData.searchResult.tickets.map((ticket, index) => (
              <li key={index}>{ticket}</li>
            ))}
          </ul>
          <button className="btn btn-secondary mt-3" onClick={handleBack}>
            Back to Search
          </button>
        </div>
      ) : (
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

              <button
                type="submit"
                className="btn btn-primary mt-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Search"}
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default LotteryUserPurchase;
