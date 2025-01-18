import React from "react";
import "./welcomePage.css";
import { useAuth } from "../../Utils/Auth";

const WelcomePage = () => {
 const auth=useAuth()
console.log("auth",auth)
  return (
    <div>
      <div className="WelcomePage">
        <header className="App-header">
          <h1 className="animated-header fw-bold">Welcome to Color Game Application</h1>
          <h5 className="text-dark fw-bolder mt-4">
            Manage your transactions efficiently and effectively.
          </h5>
        </header>
        <section className="welcome-message fw-bolder">
          <h2 fw-bold>Welcome, {auth?.user?.userName}!</h2>
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
        {/* <section className="cta">
          <button>Get Started</button>
        </section> */}
      </div>
    </div>
  );
};

export default WelcomePage;
