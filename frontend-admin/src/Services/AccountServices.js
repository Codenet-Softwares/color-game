import axios from "axios";
const API_HOST = process.env.REACT_APP_API_URL;

class AccountService {
  Login(data) {
    return axios({
      method: "POST",
      url: API_HOST + "/api/admin-login",
      data: data,
    });
  }
  ResetPassword(data, user) {
    return axios({
      method: "POST",
      url: API_HOST + "/api/subAdmin-reset-password",
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  DeleteSubAdmin(user, adminId) {
    return axios({
      method: "DELETE",
      url: API_HOST + `/api/subAdmin-delete/${adminId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
  UserCreate(data, user) {
    return axios({
      method: "POST",
      url: API_HOST + "/api/user-create",
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  RunnerCreate(data, marketName, user) {
    return axios({
      method: "POST",
      url: API_HOST + `/api/create-runners/${marketName}`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  ViewRunner(user, page, pageSize, marketName, search) {
    return axios({
      method: "GET",
      url: `${API_HOST}/api/All-Runners/${marketName}?page=${page}&pageSize=${pageSize}&search=${search}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  uploadSliderImg(data, user) {
    return axios({
      method: "POST",
      url: API_HOST + `/api/admin/slider-text-img/dynamic`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  announceWin(data, user) {
    return axios({
      method: "POST",
      url: API_HOST + `/api/afterWining`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  DeleteMarket(user, marketId) {
    return axios({
      method: "DELETE",
      url: API_HOST + `/api/market-delete/${marketId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  DeleteRunner(user, runnerId) {
    return axios({
      method: "DELETE",
      url: API_HOST + `/api/runner-delete/${runnerId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  getInactiveGames(user, page, pageSize, search) {
    return axios({
      method: "GET",
      url: `${API_HOST}/api/inactive-games?page=${page}&pageSize=${pageSize}&search=${search}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  revokeAnnounceWin(data, user) {
    return axios({
      method: "POST",
      url: API_HOST + `/api/revoke-winning-announcement`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
  createSubAdmin(data, user) {
    return axios({
      method: "POST",
      url: API_HOST + `/api/create-subAdmin`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  viewWinningRequest(user, page, pageSize, search) {
    return axios({
      method: "GET",
      url:
        API_HOST +
        `/api/get-result-requests?page=${page}&pageSize=${pageSize}&search=${search}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  viewWinningRequestAccept(data, user) {
    return axios({
      method: "POST",
      url: API_HOST + `/api/admin/approve-result`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  viewWinninghistory(user, page, pageSize, search) {
    return axios({
      method: "GET",
      url:
        API_HOST +
        `/api/subAdmin/result-histories?page=${page}&pageSize=${pageSize}&search=${search}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  viewSubAdmin(user, page, pageSize, search) {
    return axios({
      method: "GET",
      url:
        API_HOST +
        `/api/get-sub-admins?page=${page}&pageSize=${pageSize}&search=${search}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  voidWinningBet(user, marketId) {
    return axios({
      method: "POST",
      url: API_HOST + `/api/void-market-after-win`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      data: {
        marketId: marketId,
      },
    });
  }

  subAdminResult(user, page, pageSize, search) {
    return axios({
      method: "GET",
      url:
        API_HOST +
        `/api/subAdmin/get-result?page=${page}&pageSize=${pageSize}&search=${search}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  SubAdminResetPassword(data, user) {
    return axios({
      method: "POST",
      url: API_HOST + "/api/login-reset-password",
      data: data,
      // headers: {
      //   Authorization: `Bearer ${user.token}`,
      // },
    });
  }

  EditRunnerRequest(data, user) {
    return axios({
      method: "PUT",
      url: API_HOST + "/api/subadmin/edit-runner",
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
}

export default new AccountService();
