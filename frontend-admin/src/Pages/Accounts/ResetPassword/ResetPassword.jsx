import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import AccountServices from "../../../Services/AccountServices";
import { useAuth } from "../../../Utils/Auth";
import { customErrorHandler } from "../../../Utils/helper";

const ResetPassword = () => {
  const auth = useAuth();
  const user = auth.user;
  const location = useLocation();

  const {password,userName} = location?.state || {}; 

  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let validationErrors = {};

    if (!newPassword) validationErrors.newPassword = "New Password Is Required";
    if (!confirmPassword) validationErrors.confirmPassword = "Confirm Password Is Required";
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords Do Not Match";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setLoading(true);
  
    const requestData = {
      userName: userName || "",
      oldPassword: password || "", 
      newPassword,
      confirmPassword,
    };
    
   
  
    AccountServices.SubAdminResetPassword(requestData, user)
      .then((response) => {
       
        if (response?.data?.success) {
          toast.success(response.data.message || "Password reset successfully!");
          navigate("/");
        } else {
          toast.error(response.data.message || "Failed to reset password.");
        }
      })
      .catch((error) => {
        toast.error(customErrorHandler(error));
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  
  
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="d-flex justify-content-center align-items-center">
          <FaUserCircle size={60} color="#3E5879" />
        </div>
        <h2 className="login-title text-uppercase mt-2">Reset Password</h2>
        <h6 className="fw-bold text-center" style={{ color: "#3E5879" }}>
          Hi! Admin, Please Reset Your Password!
        </h6>
        <form onSubmit={handleResetPassword}>
          {/* New Password Input */}
          <div className="password-wrapper mt-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="login-input"
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <p className="text-danger">{errors.newPassword || "\u00A0"}</p>

          {/* Confirm Password Input */}
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="login-input"
            />
            <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <p className="text-danger">{errors.confirmPassword || "\u00A0"}</p>

          {/* Submit Button */}
          <button
            type="submit"
            className="login-button fw-bold text-uppercase mt-3"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
