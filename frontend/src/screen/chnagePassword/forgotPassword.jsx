import React, { useState } from "react";
import AppDrawer from "../common/appDrawer";
import Layout from "../layout/layout";
import { useFormik } from "formik";
import { useAppContext } from "../../contextApi/context";
import { changePassword } from "../../utils/apiService";
import validationSchema from "../../schema/validationSchema";
import strings from "../../utils/constant/stringConstant";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { store, dispatch } = useAppContext();
  const [resetPassword, setResetPassword] = useState(setInitialValues());

  console.log("===========>ID", store);

  function setInitialValues() {
    return {
      oldPassword: "",
      password: "",
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
        <form className="form-card">
          <h2>Change Password</h2>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Old Password</label>
            <input
              type="password"
              className="form-control"
              name="oldPassword"
              placeholder="Old Password"
              value={values.oldPassword}
              onChange={handleChange}
            />
            {errors.oldPassword && touched.oldPassword && (
              <span className="error-message">{errors.oldPassword}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">New Password</label>
            <input
              type="password"
              className="form-control"
              name="newPassword"
              placeholder="New Password"
              value={values.newPassword}
              onChange={handleChange}
            />
            {errors.newPassword && touched.newPassword && (
              <span className="error-message">{errors.newPassword}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={values.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
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
