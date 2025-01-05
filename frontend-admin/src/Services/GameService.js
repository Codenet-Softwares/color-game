import axios from "axios";
const API_HOST = process.env.REACT_APP_API_HOST;

class GameService {
  gameNameCreate(data, user) {
    return axios({
      method: "POST",
      url: API_HOST + "/api/create-games",
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  marketNameCreate(data, gameName, user) {
    return axios({
      method: "POST",
      url: API_HOST + `/api/create-markets/${gameName}`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  GameInfo(user, page, pageSize, search) {
    return axios({
      method: "GET",
      url: `${API_HOST}/api/All-Games?page=${page}&pageSize=${pageSize}&search=${search}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  getGameMarketPlace(user, id, page, pageSize, search) {
    return axios({
      method: "GET",
      url: `${API_HOST}/api/All-Markets/${id}?page=${page}&pageSize=${pageSize}&search=${search}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  rateCreate(data, runnerName, user) {
    return axios({
      method: "POST",
      url: API_HOST + `/api/create-Rate/${runnerName}`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  Update(data, user, gameName, marketName, runnerName) {
    return axios({
      method: "POST",
      url: API_HOST + `/api/update/${gameName}/${marketName}/${runnerName}`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  gameUpdate(data, user) {
    return axios({
      method: "PUT",
      url: API_HOST + `/api/update/game`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  marketUpdate(data, user) {
    return axios({
      method: "PUT",
      url: API_HOST + `/api/update/market`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  runnerUpdate(data, user) {
    return axios({
      method: "PUT",
      url: API_HOST + `/api/update/runner`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  rateUpdate(data, user) {
    return axios({
      method: "PUT",
      url: API_HOST + `/api/update/rate`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  suspensedMarket(data, id, user) {
    return axios({
      method: "POST",
      url: API_HOST + `/api/update-market-status/${id}`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  DeleteGame(user, gameId) {
    return axios({
      method: "DELETE",
      url: API_HOST + `/api/game-delete/${gameId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
  getToPathname(mode, user, action) {
    console.log("action", action);
    return axios({
      method: "POST",
      url: API_HOST + `/api/root-path/${mode}?id=${action}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  voidMarket(data, user) {
    return axios({
      method: "POST",
      url: API_HOST + `/api/void-market`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  voidMarketList(user, page, pageSize, search) {
    return axios({
      method: "GET",
      url: `${API_HOST}/api/get-Void-markets?page=${page}&pageSize=${pageSize}&search=${search}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
   
  liveBetGame(user,page,pageSize, search){
    return axios({
      method: "GET",
      url:`${API_HOST}/api/live-users-bet-games?page=${page}&pageSize=${pageSize}&search=${search}`,
      headers:{
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

userLiveBetGame(user, marketId, page, pageSize, search) {
    return axios({
      method: "GET",
      url: `${API_HOST}/api/live-users-bet/${marketId}?page=${page}&pageSize=${pageSize}&search=${search}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

DeleteMarket(user, userId,  marketId, runnerId, betId) {
  return axios({
    method: "DELETE",
    url: `${API_HOST}/api/delete-markets`,
    data: {
      marketId: marketId,
      runnerId: runnerId,
      userId: userId,
      betId: betId,
    },
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
}

betHistory(user,page,pageSize,search){
return axios({
  method:"GET",
  url:`${API_HOST}/api/get-bet-markets-afterWin?page=${page}&pageSize=${pageSize}&search=${search}`,
  headers:{
    Authorization:`Bearer ${user.token}`,
  },
});
}

winBetHistory(user, marketId, page, pageSize, search){
return axios({
  method:"GET",
  url: `${API_HOST}/api/get-bets-afterWin/${marketId}?page=${page}&pageSize=${pageSize}&search=${search}`,
  headers:{
    Authorization:`Bearer ${user.token}`,
  },
});
}

trashLiveBetHistory(user,page, pageSize,search){
return axios({
  method:"GET",
  url:`${API_HOST}/api/get-market?page=${page}&pageSize=${pageSize}&search=${search}`,
  headers:{
    Authorization:`Bearer ${user.token}`,
  },
});
}

getBetTrash(user, marketId, page, pageSize) {
  return axios({
    method: "GET",
    url: `${API_HOST}/api/get-bet-trash/${marketId}?page=${page}&pageSize=${pageSize}`,
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
}
// DeleteMarket(user, userId,  marketId, runnerId, betId) {
//   return axios({
//     method: "DELETE",
//     url: `${API_HOST}/api/delete-markets`,
//     data: {
//       marketId: marketId,
//       runnerId: runnerId,
//       userId: userId,
//       betId: betId,
//     },
//     headers: {
//       Authorization: `Bearer ${user.token}`,
//     },
//   });
// }
deleteTrashMarket(user, trashMarketId) {
  return axios({
    method: "DELETE",
    url: `${API_HOST}/api/delete-market-trash/${trashMarketId}`,
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
}


}

export default new GameService();