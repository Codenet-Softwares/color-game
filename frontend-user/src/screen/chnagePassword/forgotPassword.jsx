import React, { useState } from "react";
import AppDrawer from "../common/appDrawer";
import Layout from "../layout/layout";
import { useFormik } from "formik";
import { useAppContext } from "../../contextApi/context";
import { changePassword } from "../../utils/apiService";
import validationSchema from "../../schema/validationSchema";
import strings from "../../utils/constant/stringConstant";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash,FaRegUserCircle  } from "react-icons/fa";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { store, dispatch } = useAppContext();
  const [resetPassword, setResetPassword] = useState(setInitialValues());
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  function setInitialValues() {
    return {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      userId: store.user?.UserId,
    };
  }

  const { values, errors, touched, handleChange, handleSubmit } = useFormik({
    initialValues: resetPassword,
    validationSchema: validationSchema,
    onSubmit: function (values, action) {
      handelresetPassword(values);
    },
  });

  async function handelresetPassword(values) {
    values.password = values.newPassword;

    delete values.newPassword;
    const response = await changePassword(values, true);
    if (response) {
      setResetPassword(values);
      dispatch({
        type: strings.LOG_OUT,
        payload: { isLogin: false },
      });

      navigate("/");
    }
  }

  function changePasswords() {
    return (
      <div className="global-margin-top-logged">
        <form className="form-card shadow-lg " style={{ marginTop: "150px" }}>
          <div className="text-center mb-3 text-primary mt-3" >
        <FaRegUserCircle  size={60}/>
          </div>
            
          <h4 className="text-uppercase text-center text-primary">
            Reset Password
          </h4>
          <div className="form-group1 mt-4 position-relative">
            <label htmlFor="exampleInputPassword1">Old Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className={`form-control ${errors.oldPassword ? "border-danger" : ""}`}
              name="oldPassword"
              placeholder="Enter Old Password"
              value={values.oldPassword}
              onChange={handleChange}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", top: "30px", right: "10px" }}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
            <small className="text-danger mb-0">
              {errors.oldPassword && touched.oldPassword
                ? errors.oldPassword
                : "\u00A0"}
            </small>
          </div>
          <div className="form-group1  position-relative">
            <label htmlFor="exampleInputPassword1">New Password</label>
            <input
              type={showNewPassword ? "text" : "password"}
              className={`form-control ${errors.newPassword ? "border-danger" : ""}`}
              name="newPassword"
              placeholder="Enter New Password"
              value={values.newPassword}
              onChange={handleChange}
            />
            <span
              className="eye-icon"
              onClick={() => setShowNewPassword(!showNewPassword)}
              style={{
                position: "absolute",
                top: "27px",
                right: "10px",
                cursor: "pointer",
              }}
            >
              {showNewPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
            <small className="text-danger mb-0">
              {errors.newPassword && touched.newPassword
                ? errors.newPassword
                : "\u00A0"}
            </small>
          </div>
          <div className="form-group1  position-relative">
            <label htmlFor="exampleInputPassword1">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className={`form-control ${errors.confirmPassword ? "border-danger" : ""}`}
              name="confirmPassword"
              placeholder="Enter Confirm Password"
              value={values.confirmPassword}
              onChange={handleChange}
            />
            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: "absolute",
                top: "27px",
                right: "10px",
                cursor: "pointer",
              }}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
            <small className="text-danger mb-1">
              {errors.confirmPassword && touched.confirmPassword
                ? errors.confirmPassword
                : "\u00A0"}
            </small>
          </div>

          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={handleSubmit}
              style={{
              backgroundColor:"#8c9aa2"
              }}
          >
            Change Password
          </button>
        </form>
      </div>
    );
  }
  return (
    <>
      <AppDrawer showCarousel={false}>
        <Layout />
        {changePasswords()}
      </AppDrawer>
    </>
  );
};

export default ForgotPassword;
