import React, { useEffect, useState } from "react";

import Layout from "../layout/layout";
import AppDrawer from "../common/appDrawer";
import { activityLog } from "../../utils/apiService";

const ActivityLog = () => {
  const isLocalhost = window.location.hostname === "localhost";
  const [data, SetData] = useState({});

  const fetchActivityLog = async () => {
    const response = await activityLog();
    SetData(response?.data);
  };

  useEffect(() => {
    fetchActivityLog();
  }, []);

  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }
  return (
    <>
      <AppDrawer showCarousel={false}>
        <Layout />
        <div
          className="container-fluid d-flex justify-content-center align-items-center min-vh-100"
          style={{
            background: "#E6F7FF",
          }}
        >
          <div className="row justify-content-center w-100">
            <div className="col-12 col-md-10 col-lg-8 col-xl-6">
              <div className="card rounded">
                <div
                  className="card-header text-white p-2 text-uppercase text-center"
                  style={{ backgroundColor: "#18ADC5" }}
                >
                  <b>&nbsp;&nbsp;Activity Log</b>
                </div>
                <ul className="list-group list-group-flush text-center">
                  <li className="list-group-item p-3  ">
                    <div className="row mb-2 border-bottom border-1">
                      <div className="col-5 fw-bold">Date & Time:</div>
                      <div className="col-7">
                        {formatDate(data?.loginDateTime)}
                      </div>
                    </div>
                    <div className="row mb-2 border-bottom border-1">
                      <div className="col-5 fw-bold">Status:</div>
                      <div className="col-7">{data?.loginStatus}</div>
                    </div>
                    <div className="row mb-2 border-bottom border-1">
                      <div className="col-5 fw-bold">IP:</div>
                      <div className="col-7">{data?.ip?.iP}</div>
                    </div>
                    <div className="row mb-2 border-bottom border-1">
                      <div className="col-5 fw-bold">ISP:</div>
                      <div className="col-7">
                        {isLocalhost ? "NDA" : data?.ip?.isp}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-5 fw-bold">City/State/Country:</div>
                      <div className="col-7">
                        {isLocalhost ? "NDA" : data?.ip?.region} /{" "}
                        {isLocalhost ? "NDA" : data?.ip?.country}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </AppDrawer>
    </>
  );
};

export default ActivityLog;
