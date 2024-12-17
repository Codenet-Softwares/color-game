import React, { useEffect, useState } from "react";

import Layout from "../layout/layout";
import AppDrawer from "../common/appDrawer";
import { activityLog } from "../../utils/apiService";

const ActivityLog = () => {
    const [data, SetData] = useState({});
    

  const fetchActivityLog = async () => {
    const response = await activityLog();
    SetData(response.data);
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
        <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
          <div className="row justify-content-center w-100">
            <div className="col-12 col-md-10 col-lg-8 col-xl-6">
              <div className="card rounded">
                <div
                  className="card-header text-white p-2 "
                  style={{ backgroundColor: "rgb(23, 101, 119)" }}
                >
                  <b>&nbsp;&nbsp;Activity Log</b>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item p-3">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr className="table-active">
                            <th scope="col" className="text-center">
                              Date & Time
                            </th>
                            <th scope="col" className="text-center">
                              Status
                            </th>
                            <th scope="col" className="text-center">
                              IP
                            </th>
                            <th scope="col" className="text-center">
                              ISP
                            </th>
                            <th scope="col" className="text-center">
                              City/State/Country
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                         
                            <tr>
                              <td
                                scope="row"
                                className="text-center text-truncate"
                              >
                                {formatDate(data.loginDateTime)}
                              </td>
                              <td className="text-center text-truncate">
                                {data?.loginStatus}
                              </td>
                              <td className="text-center text-truncate">
                                {data?.ip?.iP}
                              </td>
                              <td className="text-center text-truncate">
                                {"NDS"}
                              </td>
                              <td className="text-center text-truncate">
                                {"NDS"}
                              </td>
                            </tr>
                         
                        </tbody>
                      </table>
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
