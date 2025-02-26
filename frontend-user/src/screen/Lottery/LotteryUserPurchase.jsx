import React, { useCallback, useState } from "react";
import { Formik, Form } from "formik";
import ReusableDropdown from "../../globlaCommon/ReusableDropdown";
import { SearchLotteryTicketUser } from "../../utils/apiService";
import lotteryValidationSchema from "../../schema/lotteryValidationSchema";
import { getInitialFormValues } from "../../utils/getInitiateState";
import SearchResultsNew from "./SearchResultsNew";
import CountdownTimer from "../../globlaCommon/CountdownTimer";
import moment from "moment";
import "./LotteryUserPurchase.css";
import useLotteryData from "../customHook/useLotteryData";

const LotteryUserPurchase = ({ MarketId }) => {
  const { lotteryData, setLotteryData } = useLotteryData(MarketId);
  console.log("line15", lotteryData);

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

  //back button after search button clicked
  const handleBack = () => {
    setLotteryData((prevData) => ({
      ...prevData,
      searchResult: null, // Reset search result to go back
    }));
  };

  //all input boxes with dropdown defined here
  const DROPDOWN_FIELDS = [
    { label: "Sem Value", stateKey: "semValues", field: "selectedSem" },
    { label: "Group", stateKey: "groups", field: "selectedGroup" },
    { label: "Series", stateKey: "series", field: "selectedSeries" },
    { label: "Number", stateKey: "numbers", field: "selectedNumber" },
  ];

  return (
    <div className="outer-container">
      {lotteryData?.searchResult &&
      lotteryData?.searchResult.tickets.length > 0 ? (
        <div className="inner-container border rounded shadow mx-auto p-3 d-flex flex-column justify-content-center align-items-center ">
          <SearchResultsNew lotteryData={lotteryData} handleBack={handleBack} />
        </div>
      ) : (
        <div className="form-wrapper position-relative">
          {/*The starting of overlay suspended message coming over the form after market gets suspended*/}
          {lotteryData.isSuspend && (
            <div className="suspended-overlay">
              <div className="suspended-message">
                <h3>Lottery Market Suspended</h3>
                <p>The lottery market is currently unavailable.</p>
              </div>
            </div>
          )}
          {/*The ending of overlay suspended message coming over the form after market gets suspended*/}
          <div className="form-container text-uppercase">
            <h4>
              <span style={{ color: "#4682B4" }}>{lotteryData.marketName}</span>
            </h4>
            <div className="d-flex justify-content-center">
              {new Date(
                moment(lotteryData.startTimeForShowCountdown)
                  .local()
                  .subtract(5, "hours")
                  .subtract(30, "minutes")
                  .subtract(45, "seconds")
                  .toDate()
              ) < new Date() && (
                <CountdownTimer
                  endDate={lotteryData.endTimeForShowCountdown}
                  fontSize={"16px"}
                />
              )}
            </div>

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
                        onSelect={(value) =>
                          setFieldValue(field, value || null)
                        }
                        error={errors[field]}
                        touched={touched[field]}
                      />
                    </div>
                  ))}

                  <button
                    type="submit"
                    className="btn text-uppercase text-white submit-btn"
                    disabled={isSubmitting || lotteryData.isSuspend}
                  >
                    {isSubmitting ? "Processing..." : "Search"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default LotteryUserPurchase;
