import axios from "axios";
const API_HOST = process.env.REACT_APP_API_URL;

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

  liveBetGame(user, page, pageSize, search) {
    return axios({
      method: "GET",
      url: `${API_HOST}/api/live-users-bet-games?page=${page}&pageSize=${pageSize}&search=${search}`,
      headers: {
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

  DeleteMarket(user, userId, marketId, runnerId, betId) {
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

  betHistory(user, page, pageSize, search) {
    return axios({
      method: "GET",
      url: `${API_HOST}/api/get-bet-markets-afterWin?page=${page}&pageSize=${pageSize}&search=${search}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  winBetHistory(user, marketId, page, pageSize, search) {
    return axios({
      method: "GET",
      url: `${API_HOST}/api/get-bets-afterWin/${marketId}?page=${page}&pageSize=${pageSize}&search=${search}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  trashLiveBetHistory(user, page, pageSize, search) {
    return axios({
      method: "GET",
      url: `${API_HOST}/api/get-market?page=${page}&pageSize=${pageSize}&search=${search}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
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

  deleteTrashMarket(user, trashMarketId, page, pageSize) {
    return axios({
      method: "DELETE",
      url: `${API_HOST}/api/delete-market-trash/${trashMarketId}?page=${page}&pageSize=${pageSize}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  restoreTrashMarket(user, trashMarketId) {
    return axios({
      method: "POST",
      url: API_HOST + `/api/re-store/market/${trashMarketId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  deleteGameMarket(user, approvalMarketId, page, pageSize, search) {
    return axios({
      method: "GET",
      url: `${API_HOST}/api/market-delete-approval${approvalMarketId}?page=${page}&pageSize=${pageSize}&search=${search}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  gameMarketDelete(user, approvalMarketId) {
    return axios({
      method: "POST",
      url: API_HOST + `/api/deleted-market-approval/${approvalMarketId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  restoreDeletedMarket(user, approvalMarketId) {
    return axios({
      method: "POST",
      url:
        API_HOST + `/api/restore-deleted-market-approval/${approvalMarketId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  // OUTER IMAGE SLIDER
  createSliderImage(user, data) {
    return axios({
      method: "POST",
      url: API_HOST + `/api/admin/create-slider-text-img`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  getSliderImage(user) {
    return axios({
      method: "GET",
      url: API_HOST + `/api/admin/all-slider-text-img`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  deleteCreatedImage(user, imageId) {
    return axios({
      method: "DELETE",
      url: API_HOST + `/api/delete/img/${imageId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
  activeInactiveImage(user, imageId, isActive) {
    return axios({
      method: "POST",
      url: `${API_HOST}/api/admin/active-slider/${imageId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      data: {
        isActive,
      },
    });
  }
  
  // GAME SLIDER IMAGE
  gameSliderImage(user,data){
    return axios({
      method: "POST",
      url: API_HOST + `/api/admin/create-game-img`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
  }

  getGameSliderImage(user) {
    return axios({
      method: "GET",
      url: API_HOST + `/api/admin/get-all-game-img`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
  deleteGameCreatedImage(user, imageId) {
    return axios({
      method: "DELETE",
      url: API_HOST + `/api/delete/game-img/${imageId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  activeInactiveGameImage(user, imageId, isActive) {
    return axios({
      method: "POST",
      url: `${API_HOST}/api/admin/active-game-img/${imageId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      data: {
        isActive,
      },
    });
  }

  // GIF SLIDER START
  gifSliderImage(user,data){
    return axios({
      method: "POST",
      url: API_HOST + `/api/admin/create-gif`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
  }
  getGifSlider(user) {
    return axios({
      method: "GET",
      url: API_HOST + `/api/admin/get-all-gif`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
  deleteCreateGif(user, imageId) {
    return axios({
      method: "DELETE",
      url: API_HOST + `/api/delete/gif/${imageId}`, 
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
  
  activeInactiveGameGif(user, imageId, isActive) {
    return axios({
      method: "POST",
      url: API_HOST +`/api/admin/active-gif/${imageId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      data: {
        isActive,
      },
    });
  }
  

// INNER SLIDER IMAGE  START
  innerSliderImage(user,data){
    return axios({
      method: "POST",
      url: API_HOST + `/api/admin/create-inner-img`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
  }
  getInnerSliderImage(user) {
    return axios({
      method: "GET",
      url: API_HOST + `/api/admin/get-all-inner-img`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
  deleteCreateInnerImage(user, imageId) {
    return axios({
      method: "DELETE",
      url: API_HOST + `/api/delete/inner-img/${imageId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
  InnerActiveInactiveGameImage(user, imageId, isActive) {
    return axios({
      method: "POST",
      url: `${API_HOST}/api/admin/inner-game-img/${imageId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      data: {
        isActive,
      },
    });
  }

  // OUTER announcement 
  CreateOuterAnnouncement(user,data){
    return axios({
      method: "POST",
      url: API_HOST + `/api/admin/announcements-create`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
  }

  getOuterAnnouncement(user){
    return axios({
      method: "GET",
      url: API_HOST + `/api/admin/get-admin-announcements`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
  deleteOuterAnnouncement(user, announceId) {
    return axios({
      method: "DELETE",
      url: API_HOST + `/api/admin/delete-announcements/${announceId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

   // INNER announcement 
   CreateInnerAnnouncement(user,data){
    return axios({
      method: "POST",
      url: API_HOST + `/api/admin/inner-announcements-create`,
      data: data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
  }

  getInnerAnnouncement(user){
    return axios({
      method: "GET",
      url: API_HOST + `/api/admin/get-inner-announcements`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
  deleteInnerAnnouncement(user, announceId) {
    return axios({
      method: "DELETE",
      url: API_HOST + `/api/admin/delete-inner-announcements/${announceId}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  winBetTracker(user, page, pageSize,search) {
    return axios({
      method: "GET",
      url: `${API_HOST}/api/get-after-winning-data?page=${page}&pageSize=${pageSize}&search=${search}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
  getWinBetTracker(user,marketId, page, pageSize,search) {
    return axios({
      method: "GET",
      url: `${API_HOST}/api/getDetails-winning-data/${marketId}?page=${page}&pageSize=${pageSize}&search=${search}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  AfterWinDeleteBet(user,data) {
    console.log("data",data)
    return axios({
      method: "POST",
      url: `${API_HOST}/api/delete-bet-after-win`,
      data:data,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  getSubAdminHistory(user, page, pageSize,search,status) {
    return axios({
      method: "GET",
      url: `${API_HOST}/api/subAdmin/get-subAdmin-history?page=${page}&pageSize=${pageSize}&search=${search}&status=${status || ""}`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
}

export default new GameService();
