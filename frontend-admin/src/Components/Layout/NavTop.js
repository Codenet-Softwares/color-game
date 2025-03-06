import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../Utils/Auth";
import AccountServices from "../../Services/AccountServices";
import { FaEye, FaEyeSlash, FaRegUserCircle } from "react-icons/fa";

const NavTop = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  useEffect(() => {
    let logoutPerformed = false;
    const handleUnauthorized = (error) => {
      if (!logoutPerformed && error.response && error.response.status === 423) {
        logoutPerformed = true;
        auth.logout();
        toast.error("User Account Is Locked");
        navigate("/");
      }
    };

    // const interceptor = axios.interceptors.response.use(
    //   (response) => response,
    //   (error) => {
    //     handleUnauthorized(error);
    //     return Promise.reject(error);
    //   }
    // );

    return () => {
      // axios.interceptors.response.eject(interceptor);
    };
  }, [auth, navigate]);

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out of this site?"
    );
    if (confirmed) {
      auth.logout();
      toast.success("Logout successful");
      navigate("/");
    }
  };
  useEffect(() => {
    if (isModalOpen) {
      const firstInput = document.getElementById("oldPassword");
      if (firstInput) firstInput.focus();
    }
  }, [isModalOpen]);

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

  const handleResetPassword = async () => {
    if (!validateForm()) return;
    const data = {
      userName: auth.user.userName,
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    try {
      const response = await AccountServices.ResetPassword(data, auth.user);
      toast.success("Password reset successful");
      auth.logout();
      toast.info(
        "You have been logged out for security reasons. Please log in again."
      );
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <section className="main_content dashboard_part large_header_bg">
      <div className="container-fluid g-0">
        <div className="row">
          <div className="col-lg-12 p-0 ">
            <div className="header_iner d-flex justify-content-between align-items-center p-4">
              <div className="sidebar_icon d-lg-none">
                <i className="ti-menu"></i>
              </div>
              {/* <div className="line_icon open_miniSide d-none d-lg-block">
                <img src="../../../../../../img/line_img.png" alt="" />
              </div> */}
              <div> </div>
              {/* <h3 className="text-decoration-none fw-bolder text-uppercase" style={{color:"#3E5879"}}>Admin</h3> */}
              <div class="text">WELCOME TO COLORGAME ADMIN</div>
              <div className="header_right d-flex justify-content-center align-items-center">
                <div className="mx-4"></div>
                <div className="profile_info">
                  <img src="../../../../../../img/client_img.png" alt="#" />
                  <div className="profile_info_iner">
                    <div className="profile_author_name">
                      {/* <p>{auth.user.roles[0].role} </p> */}
                      <h5>{auth.user.userName}</h5>
                    </div>

                    <div className="profile_info_details">
                      {auth.user.roles === "admin" && <a style={{ cursor: "pointer" }} onClick={openModal}>
                        <b className="text-primary">Reset Password</b>
                      </a>}

                      <a style={{ cursor: "pointer" }} onClick={handleLogout}>
                        <b className="text-danger">Logout</b>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Layout />

      {/* Modal for Reset Password */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1040,
          }}
        >
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1050,
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 6px rgba(155, 50, 50, 0.1)",
              width: "450px",
            }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold text-uppercase">Reset Password</h5>
                  <button type="button" className="close" onClick={closeModal}>
                    &times;
                  </button>
                </div>
                <div className="modal-body mt-3">
                  <div className="form-group">
                    <label htmlFor="oldPassword">Old Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="oldPassword"
                      className={`form-control ${errors.oldPassword ? "border-danger" : ""
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
                        top: "30px",
                        right: "10px",
                      }}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                    <p className="text-danger mb-0">
                      {errors.oldPassword || "\u00A0"}
                    </p>
                  </div>
                  <div className="form-group" style={{ position: "relative" }}>
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      className={`form-control ${errors.newPassword ? "border-danger" : ""
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
                        top: "27px",
                        right: "10px",
                        cursor: "pointer",
                      }}
                    >
                      {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                    <p className="text-danger mb-0">
                      {errors.newPassword || "\u00A0"}
                    </p>
                  </div>
                  <div className="form-group" style={{ position: "relative" }}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      className={`form-control ${errors.confirmPassword ? "border-danger" : ""
                        }`}
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                    />
                    <span
                      className="eye-icon"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      style={{
                        position: "absolute",
                        top: "27px",
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
                  <button
                    type="button"
                    className="btn btn-secondary me-3"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleResetPassword}
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NavTop;
