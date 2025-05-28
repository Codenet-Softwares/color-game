import React, { useState } from "react";
import "./Login.css";
import AccountServices from "../../../Services/AccountServices";
import { useAuth } from "../../../Utils/Auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { customErrorHandler } from "../../../Utils/helper.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    let validationErrors = {};

    if (!userName) validationErrors.userName = "Username Is Required";
    if (!password) validationErrors.password = "Password Is Required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    auth.showLoader();
    const data = { userName, password };
    AccountServices.Login(data)
      .then((res) => {
        if(res?.data?.data?.isReset){
          navigate("/reset-password", { state:  {password,userName}});
          return
        }
      
        sessionStorage.setItem("user", res.data.data.accessToken);
        toast.success("Login Successful.");

        auth.login();

        navigate("/welcome");
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
        setUserName("");
        setPassword("");
      })
      .finally(() => {
        auth.hideLoader();
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title text-uppercase">Colorgame Admin</h2>
        <h6 className="fw-bold text-center" style={{ color: "#3E5879" }}>
          Hi! Admin, Please Enter Your Login Credentials!
        </h6>
        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <input
            type="text"
            placeholder="Enter your Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="login-input mt-3"
          />
          <p className="text-danger">{errors.userName || "\u00A0"}</p> 

          {/* Password Input with Eye Icon */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <p className="text-danger">{errors.password || "\u00A0"}</p>

          {/* Submit Button */}
          <button type="submit" className="login-button fw-bold text-uppercase">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
