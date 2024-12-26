import React from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import Logo from "../../asset/Logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../../contextApi/context";
import strings from "../../utils/constant/stringConstant";
import { ResetUserPassword } from "../../utils/apiService";
import { ResetPasswordSchema } from "../../utils/schema";


const ResetPassword = () => {
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location?.state || {}; 
console.log("location-state", state);
  const formik = useFormik({
    initialValues: {
      userName:state?.userName,
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
    console.log("====>>> ONCLICK OF BUTTON", values);

    try {
      const response = await ResetUserPassword(values, true);
      console.log("Response from reset password API:", response);
      if (response && response.success) {
        navigate("/home");
        toast.success("Password changed successfully!");
      } else {
        toast.error(
          response.message || "Failed to change password. Please try again."
        );
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred. Please try again.");
    }
  }
  return (
    <div className="container h-175">
      <div className="logo-container">
        <img
          src={Logo}
          alt="Logo"
          className="logo"
          style={{ height: "150px" }}
        />
      </div>
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-md-6">
          <div className="card shadow p-3 mb-5 bg-white rounded">
            <div className="card-body">
              <h5 className="card-title text-center">Change Password</h5>
              <form onSubmit={formik.handleSubmit}>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
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
                  {formik.touched.newPassword && formik.errors.newPassword ? (
                    <div className="invalid-feedback">
                      {formik.errors.newPassword}
                    </div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
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
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <div className="text-danger">
                        {formik.errors.confirmPassword}
                      </div>
                    )}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                >
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
