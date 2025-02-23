import * as Yup from "yup";

const lotteryValidationSchema = Yup.object().shape({
  selectedSem: Yup.string().required("Sem value is required"),
  selectedGroup: Yup.string().required("Group is required"),
  selectedSeries: Yup.string().required("Series is required"),
  selectedNumber: Yup.string().required("Number is required"),
});

export default lotteryValidationSchema;
