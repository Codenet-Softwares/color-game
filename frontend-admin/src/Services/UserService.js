import axios from "axios";
const API_HOST = process.env.REACT_APP_API_HOST;

class UserService {
  GetViewUser(user) {
    return axios({
      method: "get",
      url: API_HOST + "/api/All-User",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  AddUserBalance(user, data) {
    return axios({
      method: "post",
      data: data,
      url: API_HOST + "/api/sendBalance-user",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }


 userUpdate(data, user,userId) {
    return axios({
      method: "PUT",
      url: API_HOST + `/api/users-update/${userId}`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
}

export default new UserService();
