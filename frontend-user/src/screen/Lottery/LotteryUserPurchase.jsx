import React, { useCallback, useState } from "react";
import { Formik, Form } from "formik";
import ReusableDropdown from "../../globlaCommon/ReusableDropdown";
import { PurhaseLotteryTicketUser } from "../../utils/apiService";
import lotteryValidationSchema from "../../schema/lotteryValidationSchema";
import { getInitialFormValues } from "../../utils/getInitiateState";
import SearchResultsNew from "./SearchResultsNew";
import moment from "moment";
import "./LotteryUserPurchase.css";
import useLotteryData from "../customHook/useLotteryData";
import CountdownTimerLotto from "../../globlaCommon/CountdownTimerLotto";

const LotteryUserPurchase = ({ MarketId }) => {
  const { lotteryData, setLotteryData, handleSubmit, handleBuy } =
    useLotteryData(MarketId);

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
      lotteryData?.searchResult?.tickets?.length > 0 ? (
        <div className="inner-container border rounded shadow mx-auto p-3 d-flex flex-column justify-content-center align-items-center ">
          <SearchResultsNew
            lotteryData={lotteryData}
            handleBack={handleBack}
            handleBuy={handleBuy}
          />
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

          <div
            className={`form-container text-uppercase ${
              lotteryData.isSuspend ? "blurred" : ""
            }`}
          >
            {/* Price Display - Always Visible  on top left */}
            <div className="price-pill fw-semibold ">
              PRICE: <strong>{lotteryData.price}</strong>
            </div>

            <h4>
              <span className="market-name">{lotteryData.marketName}</span>
              <div className="time-display-container">
                <div className="time-box">
                  <div className="time-title">Start Time:</div>
                  <div className="time-value text-primary">
                    {moment
                      .utc(lotteryData.startTimeForShowCountdown)
                      .format("DD MMM YYYY, hh:mm A")}
                  </div>

                  <div className="time-title">End Time:</div>
                  <div className="time-value text-danger">
                    {moment
                      .utc(lotteryData.endTimeForShowCountdown)
                      .format("DD MMM YYYY, hh:mm A")}
                  </div>
                </div>
              </div>
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
                <CountdownTimerLotto
                  endDate={lotteryData.endTimeForShowCountdown}
                  fontSize={"16px"}
                />
              )}
            </div>

            <Formik
              key={MarketId}
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
                    disabled={isSubmitting || lotteryData?.isSuspend}
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
