import React, { useState, useEffect } from "react";
import { useAuth } from "../../Utils/Auth";
import AccountServices from "../../Services/AccountServices";
import { FaEye, FaEyeSlash, FaRegUserCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
const SubAdminResetPassword = ({ handleClose, userName }) => {
  const auth = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    let validationErrors = {};

    if (!oldPassword) validationErrors.oldPassword = "Old password is required";

    if (!newPassword) {
      validationErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      validationErrors.newPassword = "Password must be at least 6 characters";
    } else if (newPassword === oldPassword) {
      validationErrors.newPassword =
        "New password cannot be the same as old password";
    }

    if (!confirmPassword) {
      validationErrors.confirmPassword = "Confirm password is required";
    } else if (confirmPassword !== newPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };
  const handleReset = () => {
    setOldPassword("");
    setNewPassword("");
  };
  const handleResetPassword = async () => {
    if (!validateForm()) return;
    const data = {
      userName: userName,
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    try {
      const response = await AccountServices.ResetPassword(data, auth.user);
      handleReset();
      handleClose();
      toast.success("Password reset successful");
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    }
  };
  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, oldPassword: "" }));
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, newPassword: "" }));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
  };
  return (
    <>
      <div className="modal-body mt-3">
        <div className="form-group">
          <input
            type={showPassword ? "text" : "password"}
            id="oldPassword"
            placeholder="Enter Old Password"
            className={`form-control ${
              errors.oldPassword ? "border-danger" : ""
            }`}
            value={oldPassword}
            onChange={handleOldPasswordChange}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              top: "20px",
              right: "33px",
            }}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
          <p className="text-danger mb-0">{errors.oldPassword || "\u00A0"}</p>
        </div>
        <div className="form-group" style={{ position: "relative" }}>
          <input
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            placeholder="Enter New Password"
            className={`form-control ${
              errors.newPassword ? "border-danger" : ""
            }`}
            value={newPassword}
            onChange={handleNewPasswordChange}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setShowNewPassword(!showNewPassword)}
            style={{
              position: "absolute",
              top: "5px",
              right: "10px",
              cursor: "pointer",
            }}
          >
            {showNewPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
          <p className="text-danger mb-0">{errors.newPassword || "\u00A0"}</p>
        </div>
        <div className="form-group" style={{ position: "relative" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="Enter Confirm Password"
            className={`form-control ${
              errors.confirmPassword ? "border-danger" : ""
            }`}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: "absolute",
              top: "5px",
              right: "10px",
              cursor: "pointer",
            }}
          >
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
          <p className="text-danger mb-0">
            {errors.confirmPassword || "\u00A0"}
          </p>
        </div>
      </div>
      <div className="modal-footer">
        {/* <button
          type="button"
          className="btn btn-secondary me-3"
             onClick={closeModal}
        >
          Close
        </button> */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleResetPassword}
        >
          Reset Password
        </button>
      </div>
    </>
  );
};

export default SubAdminResetPassword;
