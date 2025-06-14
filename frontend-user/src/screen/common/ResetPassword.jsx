import React, { useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import Logo from "../../asset/Logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../../contextApi/context";
import strings from "../../utils/constant/stringConstant";
import { ResetUserPassword } from "../../utils/apiService";
import { ResetPasswordSchema } from "../../utils/schema";
import { customErrorHandler } from "../../utils/helper";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const ResetPassword = () => {
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location?.state || {};
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      userName: state?.userName,
      confirmPassword: "",
      oldPassword: state?.password,
      newPassword: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: function (values) {
      handelresetPassword(values);
    },
  });

  async function handelresetPassword(values) {
    try {
      const response = await ResetUserPassword(values, true);
      if (response && response.success) {
        navigate("/home");
      }
    } catch (error) {
      toast.error(customErrorHandler(error));
    }
  }
  return (
    <div className="container">
      <div className="logo-container">
        <img 
          src={Logo}
          alt="Logo"
          className="logo border"
          style={{ height: "150px",background:"orange" }}
        />
      </div>
      <div className="row justify-content-center align-items-center h-100 mt-5">
        <div className="col-md-6">
          <div className="card shadow p-3 mb-5 bg-white rounded">
            <div className="card-body">
              <h5 className="card-title text-center text-uppercase fw-bold">
                Change Password
              </h5>
              <form onSubmit={formik.handleSubmit}>
                <div className="form-group position-relative">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${
                        formik.touched.newPassword && formik.errors.newPassword
                          ? "is-invalid"
                          : ""
                      }`}
                      id="newPassword"
                      name="newPassword"
                      placeholder="Enter New Password"
                      value={formik.values.newPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEye/> : <FaEyeSlash />}
                    </button>
                  </div>
                  {formik.touched.newPassword && formik.errors.newPassword && (
                    <div className="invalid-feedback d-block">
                      {formik.errors.newPassword}
                    </div>
                  )}
                </div>
                <div className="form-group position-relative">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={`form-control ${
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                          ? "is-invalid"
                          : ""
                      }`}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm New Password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <div className="text-danger">
                        {formik.errors.confirmPassword}
                      </div>
                    )}
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  RESET PASSWORD
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
