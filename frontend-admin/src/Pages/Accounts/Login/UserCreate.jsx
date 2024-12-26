import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../Utils/Auth";
import AccountServices from "../../../Services/AccountServices";
import { toast } from "react-toastify";

const UserCreate = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      firstName: firstName,
      lastName: lastName,
      userName: username,
      phoneNumber: mobileNo,
      password: password,
    };

    AccountServices.UserCreate(data, auth.user)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };
  return (
    <div className="main_content_iner overly_inner ">
      <div className="container-fluid p-0 mt-5">
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8">
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
                        placeholder="Username"
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
                        type="number"
                        placeholder="Mobile Number"
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="common_input mb_15"></div>
                  </div>
                  <div className="col-lg-6 ">
                    <div className="common_input mb_15">
                      <input
                        type="text"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="common_input mb_15"></div>
                  </div>
                  <div class="col-12">
                    <div class="create_report_btn mt_30">
                      <a
                        href="#"
                        class="btn_1 radius_btn d-block text-center"
                        onClick={handleSubmit}
                      >
                        Add User
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-2"></div>
        </div>
      </div>
    </div>
  );
};
export default UserCreate;
