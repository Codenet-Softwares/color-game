import React from "react";
import "./welcomePage.css";
import { useAuth } from "../../Utils/Auth";

const WelcomePage = () => {
  const auth = useAuth();
  console.log("auth", auth);
  return (
    <div>
      <div className="WelcomePage w-100" style={{}}>
        {/* <img src="../../../../../../../img/colorGame_image1.png" className="w-100" style={{}} /> */}
        {/* <img src="https://www.istockphoto.com/vector/abstract-illuminated-blue-circle-shape-of-particles-array-on-dark-background-gm1159366405-316983061?utm_source=pixabay&utm_medium=affiliate&utm_campaign=ADP_illustration_sponsored_ratiochange&utm_content=https%3A%2F%2Fpixabay.com%2Fillustrations%2Fbullet-abstract-template-lines-1023985%2F&utm_term=kugel+abstrakt" alt="" /> */}
         <header className="App-header">
         <div class="text__animation bg-image--1 fullscreen">
		<h3 class="title">Welcome To Colorgame Admin Panel</h3>
	</div>
        </header> 
        <section className="welcome-message">
          <h1>Welcome, {auth?.user?.userName}!</h1>
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
        <div className="u-marquee svg-background app-footer__marquee ">
  <div class="noise"></div>
  <div class="u-marquee__content">COLOR GAME <span class="divider">COLOR GAME</span> COLOR GAME</div>
  <div aria-hidden="true" class="u-marquee__content">COLOR GAME <span class="divider"></span> COLOR GAME</div>
  {/* <span class="divider">-</span> */}
  <div aria-hidden="true" class="u-marquee__content">COLOR GAME <span class="divider">-</span> COLOR GAME</div>
</div>

<div class="grid">
  <div class="grid-lines"></div>
  <div class="grid-lines"></div>
  <div class="grid-lines"></div>
  <div class="grid-lines"></div>
</div>
      </div>
    </div>
  );
};

export default WelcomePage;
