import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Utils/Auth";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import "../Pages/Accounts/Login/Login.css";
const Authform = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can make your POST API call with the form data
    // For example:
    // const formData = {
    //     username,
    //     firstName,
    //     lastName,
    //     email,
    //     mobileNo,
    //     password
    // };
    // console.log(formData);
    // Make your API call here
};
  return (
    <div className="main_content_iner overly_inner ">
      <div className="container-fluid p-0 ">
        <div className="row">
          <div className="col-12">
            <div className="page_title_box d-flex flex-wrap align-items-center justify-content-between">
              <div className="page_title_left d-flex align-items-center">
                <h3 className="f_s_25 f_w_700 dark_text mr_30">Dashboard</h3>
                <ol className="breadcrumb page_bradcam mb-0">
                  <li className="breadcrumb-item">
                    <a href="javascript:void(0);">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Analytic</li>
                </ol>
              </div>
              <div className="page_title_right">
                <div className="page_date_button d-flex align-items-center">
                  <img src="img/icon/calender_icon.svg" alt="" />
                  August 1, 2020 - August 31, 2020
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="white_card card_height_100 mb_30">
              <div className="white_card_header">
                <div className="box_header m-0">
                  <div className="main-title">
                    <h3 className="m-0">Add New User </h3>
                  </div>
                </div>
              </div>
              <div className="white_card_body">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="common_input mb_15">
                      <input
                        type="text"
                        placeholder=" Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="common_input mb_15">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="common_input mb_15">
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="common_input mb_15">
                      <input
                        type="text"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="common_input mb_15">
                      <input
                        type="text"
                        placeholder="Mobile No"
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="common_input mb_15">
                      <input
                        type="text"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="create_report_btn mt_30">
                      <button type="submit" className="btn_1 full_width text-center" onSubmit={handleSubmit}> Add User </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Authform;
