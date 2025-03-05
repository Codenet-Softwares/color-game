import * as Yup from "yup";

export const CreateSubAdminSchema = Yup.object().shape({
    userName: Yup.string()
        .min(2, "User Name must be at least 2 characters")
        .max(25, "User Name must not exceed 25 characters")
        .matches(/^\S*$/, "User Name must not contain spaces")
        .required("User Name is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});