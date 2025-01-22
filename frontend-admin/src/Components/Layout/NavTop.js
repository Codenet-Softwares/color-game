import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../Utils/Auth";
import AccountServices from "../../Services/AccountServices"; 

const NavTop = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState(""); 

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
  
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!oldPassword) {
      toast.error("Old password is required");
      return;
    }

    const data = {
      userName: auth.user.userName,
      oldPassword: oldPassword,  
      newPassword: newPassword
    };
    try {
      const response = await AccountServices.ResetPassword(data, auth.user);
      toast.success("Password reset successful");
  
      auth.logout();
      toast.info("You have been logged out for security reasons. Please log in again.");
    } catch (error) {
      toast.error("Error resetting password: " + error.message);
    }
  };
  
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
                      <a style={{ cursor: "pointer" }} onClick={openModal}>
                        <b className="text-primary">Reset Password</b>
                      </a>
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
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reset Password</h5>
                <button type="button" className="close" onClick={closeModal}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="oldPassword">Old Password</label>
                  <input
                    type="password"
                    id="oldPassword"
                    className="form-control"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleResetPassword}>
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NavTop;
