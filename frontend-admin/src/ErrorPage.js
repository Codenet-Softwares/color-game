import React from 'react'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div>
      <div class="erroe_page_wrapper">
        <div class="errow_wrap">
          <div class="container text-center">
            <img src="img/bak_hovers/sad.png" alt="" />
            <div class="error_heading  text-center">
              <h3 class="headline font-danger theme_color_6">404</h3>
            </div>
            <div class="col-md-8 offset-md-2 text-center">
              <p>
                The page you are attempting to reach is currently not available.
                This may be because the page does not exist or has been moved.
              </p>
            </div>
            <div class="error_btn  text-center">
              <Link to="/welcome" class=" default_btn theme_bg_6 ">Back Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage
