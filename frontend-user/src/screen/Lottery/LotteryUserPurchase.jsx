import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ReusableDropdown from "../../globlaCommon/ReusableDropdown";
import { LotteryRange, PurchaseLottery, SearchLotteryTicketUser } from "../../utils/apiService";
import { generateLotteryOptions } from "../../utils/helper";
import lotteryValidationSchema from "../../schema/lotteryValidationSchema";


const LotteryUserPurchase = ({ MarketId }) => {
  const [lotteryData, setLotteryData] = useState({
    groups: [],
    series: [],
    numbers: [],
    semValues: ["5 sem", "10 sem", "25 sem", "50 sem", "100 sem", "200 sem"],
  });

  useEffect(() => {
    const fetchLotteryData = async () => {
      const response = await LotteryRange();

      const marketData = response?.data?.find((market) => market.marketId === MarketId);
      if (marketData) {
        const { group_start, group_end, series_start, series_end, number_start, number_end } =
          marketData;

        const { groupOptions, seriesOptions, numberOptions } = generateLotteryOptions(
          group_start,
          group_end,
          series_start,
          series_end,
          number_start,
          number_end
        );

        setLotteryData((prev) => ({
          ...prev,
          groups: groupOptions,
          series: seriesOptions,
          numbers: numberOptions,
        }));
      }
    };

    fetchLotteryData();
  }, [MarketId]);

  const initialValues = {
    selectedSem: "",
    selectedGroup: "",
    selectedSeries: "",
    selectedNumber: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const requestBody = {
        marketId: MarketId,
        semValue: values.selectedSem,
        group: values.selectedGroup,
        series: values.selectedSeries,
        number: values.selectedNumber,
      };

      const response = await SearchLotteryTicketUser(requestBody);
      console.log("Purchase successful:", response.data);
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-5">
      <h3>Lottery User Purchase</h3>

      <Formik
        initialValues={initialValues}
        // validationSchema={lotteryValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            {[
              { label: "Sem Value", options: lotteryData.semValues, key: "selectedSem" },
              { label: "Group", options: lotteryData.groups, key: "selectedGroup" },
              { label: "Series", options: lotteryData.series, key: "selectedSeries" },
              { label: "Number", options: lotteryData.numbers, key: "selectedNumber" },
            ].map(({ label, options, key }) => (
              <div key={key} className="mb-3">
                <ReusableDropdown
                  label={label}
                  options={options}
                  onSelect={(value) => setFieldValue(key, value)}
                />
                <ErrorMessage name={key} component="div" className="text-danger" />
              </div>
            ))}

            <button type="submit" className="btn btn-primary mt-3" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Purchase Lottery"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LotteryUserPurchase;
