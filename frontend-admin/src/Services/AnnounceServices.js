/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
const API_HOST = process.env.REACT_APP_API_HOST;

class AnnounceServices {
    announceCreate(data, user) {
        return axios({
          method: "POST",
          url: API_HOST + `/api/admin/announcements-create`,
          data: data,
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      }


      UpdateAnnounce(data,user,announceId) {
        console.log('=====> announce id',announceId)
        return axios({
          method: "PUT",
          url: API_HOST + `/api/admin/update-announcement/${announceId}`,
          data: data,
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      }



     LatestAnnounce(user,announceId) {
        return axios({
          method: "GET",
          url: API_HOST + `/api/admin/announcements-latest/${announceId}`,
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      }
 
}

export default new AnnounceServices();
