import React from "react";
import "./welcomePage.css";
import { useAuth } from "../../Utils/Auth";

const WelcomePage = () => {
 const auth=useAuth()
console.log("auth",auth)
  return (
    <div>
      <div className="WelcomePage">
        <img src="../../../../../../img/welcome_img3.jpg" alt="" className="welcome-img"/>

          <h1 className="animated-header">Welcome to Color Game Application</h1>
          <p className="text-dark">
            Manage your transactions efficiently and effectively.
          </p>
        <section className="welcome-message">
          <h2>Welcome, {auth?.user?.userName}!</h2>
          <p>We're glad to have you back. Here’s what you can do today:</p>
        </section>
        <section className="features">
          <h2>Key Features</h2>
          <div className="features-list">
            <div className="feature-item">
              <i className="icon fa fa-chart-line"></i>
              <p>Transaction Tracking</p>
            </div>
            <div className="feature-item">
              <i className="icon fa fa-users"></i>
              <p>Customer Management</p>
            </div>
            <div className="feature-item">
              <i className="icon fa fa-chart-pie"></i>
              <p>Detailed Analytics</p>
            </div>
            <div className="feature-item">
              <i className="icon fa fa-lock"></i>
              <p>Secure and Reliable</p>
            </div>
          </div>
        </section>
        <section className="cta">
          <button>Get Started</button>
        </section>
      </div>
    </div>
  );
};

export default WelcomePage;
