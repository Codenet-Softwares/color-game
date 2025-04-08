import React, { useState } from "react";
import { CreateSubAdminSchema } from "../Utils/schema";
import { getCreateSubAdmin } from "../Utils/intialState";
import { useFormik } from "formik";
import { resultAnnouncement } from "../Utils/constant";
import AccountServices from "../Services/AccountServices";
import { useAuth } from "../Utils/Auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { customErrorHandler } from "../Utils/helper";
const CreateSubAdmin = () => {
  const auth = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: {
      ...getCreateSubAdmin(),
      permissions: [resultAnnouncement],
    },
    validationSchema: CreateSubAdminSchema,
    onSubmit: async (values) => {
      auth.showLoader();
      try {
        const response = await AccountServices.createSubAdmin(
          values,
          auth.user
        );

        // Check if the success property is at the top level
        if (response.success) {
          toast.success(response.message); // Show success toaster message
          resetForm();
        } else if (response.data && response.data.success) {
          toast.success(response.data.message); // Show success toaster message
          resetForm();
        }
        // Handle unexpected response structure
        else {
          toast.error(
            response.message ||
              response.data?.message ||
              "Failed to create sub-admin"
          ); // Handle unexpected response
        }
      } catch (error) {
        toast.error(customErrorHandler(error)); // Show error toaster message
      } finally {
        auth.hideLoader();
      }
    },
  });

  return (
    <div className="container " style={{ marginTop: "100px" }}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div
              className="card-header text-white p-3 text-center"
              style={{ backgroundColor: "#3E5879" }}
            >
              <b className="text-uppercase">CREATE Sub-Admin</b>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Username Field */}
                <div className="mb-3">
                  <label htmlFor="userName" className="form-label fw-bold">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Username"
                    name="userName"
                    value={values.userName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.userName && touched.userName && (
                    <p className="text-danger fw-bold">{errors.userName}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-bold">
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className="form-control"
                      placeholder="Enter Password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p className="text-danger fw-bold">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="d-grid">
                  <button className="btn btn-primary" type="submit">
                    Add Sub-Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSubAdmin;
