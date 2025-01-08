import React, { useState } from "react";
import "./Login.css";
import AccountServices from "../../../Services/AccountServices";
import { useAuth } from "../../../Utils/Auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { customErrorHandler } from "../../../Utils/helper.js";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const error = [];
    if (!userName) error.push("userName");
    if (!password) error.push("password");

    if (error.length) return toast.error(`${error.join(", ")} is required`);
    const data = { userName: userName, password: password };
    AccountServices.Login(data)
      .then((res) => {
        console.log("first", res);
        sessionStorage.setItem("user", res.data.data.accessToken);
        // sessionStorage.setItem("role", res.data.token.role);
        toast.success("Login Successful.");
        auth.login();
        navigate("/welcome");
      })
      .catch((err) => {
        console.log(err);
        toast.error(customErrorHandler(err));
        setUserName("");
        setPassword("");
      });
  };

  return (
    <div className="login-background">
      <div className="login-box">
        <h2 className="login-title text-uppercase">Log in</h2>
        <form>
          <input
            type="text"
            placeholder="Enter your Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="login-input text-center"
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input text-center"
          />
          <button onClick={handleSubmit} className="login-button text-uppercase mt-4">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
