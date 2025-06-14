import React from "react";
import { Formik, Form } from "formik";
import ReusableDropdown from "../../../globlaCommon/ReusableDropdown";
import lotteryValidationSchema from "../../../schema/lotteryValidationSchema";
import { getInitialFormValues } from "../../../utils/getInitiateState";
import moment from "moment";
import "./LotteryUserPurchase.css";
import useLotteryData from "../../customHook/useLotteryData";
import CountdownTimerLotto from "../../../globlaCommon/CountdownTimerLotto";
import SearchResultsNew from "./SearchResultsNew";
// import { capitalizeEachWord } from "../../../utils/helper";

const LotteryUserPurchase = ({ MarketId }) => {
  const { lotteryData, handleSubmit, handleBuy, handleBack, DROPDOWN_FIELDS } =
    useLotteryData(MarketId);
  return (
    <div className="outer-container">
      {lotteryData?.searchResult &&
      lotteryData?.searchResult?.tickets?.length > 0 ? (
        <div className="inner-container border rounded shadow mx-auto  p-3 d-flex flex-column justify-content-center align-items-center ">
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
            className={`form-container ${
              lotteryData.isSuspend ? "blurred" : ""
            }`}
          >
            {/* Price Display - Always Visible  on top left */}
            <div className="price-pill fw-semibold ">
              PRICE: <strong>{lotteryData.price}</strong>
            </div>

            <h4>
              <span
                className="market-name text-wrap"
                style={{
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {lotteryData.marketName}
              </span>
              <div className="time-display-container ">
                <div className="time-box">
                  <div className="time-title text-white ">Start Time:</div>
                  <div className="time-value text-white me-5">
                    {moment
                      .utc(lotteryData.startTimeForShowCountdown)
                      .format("DD MMM YYYY, hh:mm A")}
                  </div>

                  <div className="time-title text-white">End Time:</div>
                  <div className="time-value text-white">
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
                    className="text-uppercase text-white submit-btn"
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