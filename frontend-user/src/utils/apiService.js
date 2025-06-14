import { useAppContext } from "../contextApi/context";
import urls from "../utils/constant/UrlConstant";
import strings from "../utils/constant/stringConstant";

import { getCallParams, getNoAuthCallParams, makeCall } from "./service";

// const { store } = useAppContext();

export async function login(body, isToast = false) {
  try {
    const callParams = getNoAuthCallParams(strings.POST, body, isToast);
    const response = await makeCall(urls.login, callParams, isToast);
    return response;
  } catch (error) {
    throw error;
  }
}

// Logout function
export async function logout(body, isToast = false) {
  try {
    const callParams = getNoAuthCallParams(strings.POST, body, isToast);
    const response = await makeCall(urls.userLogout, callParams, isToast);
    return response;
  } catch (error) {
    throw error;
  }
}

/*======================
  user api call
=======================*/
export async function user_getAllGames_api(body = {}, isToast = false) {
  try {
    const callParams = getNoAuthCallParams(strings.GET, body, isToast);
    const response = await makeCall(urls.userGames, callParams);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function user_getAllGamesWithMarketData_api(
  body = {},
  isToast = false
) {
  try {
    const callParams = getNoAuthCallParams(strings.GET, body, isToast);
    const response = await makeCall(urls.userAllGamesDetails, callParams);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function user_getGameWithMarketData_api(
  body = {},
  isToast = false
) {
  try {
    const callParams = getNoAuthCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      `${urls.userGameDetailById}/${body.gameId}`,
      callParams
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function user_getMarketWithRunnerData_api(
  body = {},
  isToast = false
) {
  try {
    const callParams = getNoAuthCallParams(strings.POST, body, isToast);
    const response = await makeCall(
      `${urls.userMarketDetailById}/${body.marketId}`,
      callParams
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function changePassword(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.POST, body, isToast);
    const response = await makeCall(urls.changePassword, callParams, isToast);

    return response;
  } catch (error) {
    throw error;
  }
}

export async function user_getBetHistory_api(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      `${urls.userBetHistoryById}/${body.gameId}?page=${body.pageNumber}&limit=${body.dataLimit}&startDate=${body.startDate}&endDate=${body.endDate}&dataType=${body.dataSource}&type=${body.type}`,
      callParams,
      isToast
    );

    return response;
  } catch (error) {
    throw error;
  }
}

// export async function user_getOpenBetmarket_api(body = {}, isToast = false) {
//   try {
//     const callParams = await getCallParams(strings.GET, body, isToast);

//     const response = await makeCall(urls.userGetOpenBet, callParams, isToast);

//     return response;
//   } catch (error) {
//     throw error;
//   }
// }

export async function user_getBackLayData_api(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      `${urls.userBackLayData}/${body.marketId}`,
      callParams,
      isToast
    );

    return response;
  } catch (error) {
    throw error;
  }
}

// dummy data api for open bet and selection
export async function getDataFromHistoryLandingPage(
  body = {},
  isToast = false
) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      urls.getDataFromHistoryLandingPage,
      callParams,
      isToast
    );

    return response;
  } catch (error) {
    throw error;
  }
}

export async function getOpenBetsGame(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(urls.getOpenBetsGame, callParams, isToast);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function userWallet(userId, isToast = false, dispatch) {
  try {
    const callParams = await getCallParams(strings.GET, isToast);
    const response = await makeCall(`${urls.userWallet}/${userId}`, callParams);

    return response;
  } catch (error) {
    throw error;
  }
}

export async function userBidding(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.POST, body, isToast);
    const response = await makeCall(urls.userBidding, callParams, isToast);

    return response;
  } catch (error) {
    throw error;
  }
}

export async function betHistory(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      `${urls.betHistory}/${body.userId}/${body.gameId}?page=${body.pageNumber}&limit=${body.dataLimit}`,
      callParams
    );

    return response;
  } catch (error) {
    throw error;
  }
}

export async function profitAndLoss_Api(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      `${urls.profitAndLoss}?startDate=${body.startDate}&endDate=${body.endDate}&page=${body.pageNumber}&limit=${body.dataLimit}`,
      callParams
      // isToast,
    );

    return response;
  } catch (error) {
    throw error;
  }
}

export async function profitAndLossMarket_Api(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      `${urls.profitAndLossMarket}/${body.gameId}?page=${body.pageNumber}&limit=${body.dataLimit}`,
      callParams
      // isToast,
    );

    return response;
  } catch (error) {
    throw error;
  }
}

export async function profitAndLossRunner_Api(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      `${urls.profitAndLossRunner}/${body.marketId}?startDate=${body.startDate}&endDate=${body.endDate}&page=${body.pageNumber}&limit=${body.dataLimit}`,
      callParams
    );

    return response;
  } catch (error) {
    throw error;
  }
}

export async function user_carrouselImageDynamic_api(
  body = {},
  isToast = false
) {
  try {
    const callParams = getNoAuthCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      urls.user_carrouselImageDynamic,
      callParams
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function ResetUserPassword(body = {}, isToast = false) {
  try {
    const callParams = getNoAuthCallParams(strings.POST, body, isToast);
    const response = await makeCall(urls.resetPassword, callParams, isToast);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getProfitLossGame(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      `${urls.getProfitLossGame}?page=${body.page}&startDate=${body.fromDate}&endDate=${body.toDate}&limit=${body.limit}&search=${body.searchName}&dataType=${body.dataSource}`,
      callParams,
      isToast
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getProfitLossRunner(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      `${urls.getProfitLossRunner}/${body.marketId}?page=${body.pageNumber}&limit=${body.dataLimit}&search=${body.searchName}`, ///&limit=${body.limit}&search=${body.searchName} ((by search sending blank server is not giving data))
      callParams,
      isToast
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getProfitLossEvent(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      `${urls.getProfitLossEvent}/${body.gameId}?page=${body.pageNumber}&limit=${body.dataLimit}&search=${body.searchName}`, ///((by search sending blank server is not giving data))
      callParams,
      isToast
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getAccountstatement_api(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      `${urls.getAccountStatement}?page=${body.pageNumber}&pageSize=${body.dataLimit}&startDate=${body.fromDate}&endDate=${body.toDate}&dataType=${body.dataSource}`,
      callParams,
      isToast
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const getUserBetHistory_api = async (body = {}, isToast = false) => {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      `${urls.getUserBetList}/${body.runnerId}?page=${body.page}&pageSize=${body.limit}`,
      callParams,
      isToast
    );
    return response;
  } catch (err) {
    throw err;
  }
};

export async function Purchase_lottery(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.POST, body, isToast);
    const response = await makeCall(urls.purchaseTicket, callParams, isToast);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function Get_Lotteries(body = {}, isToast = false) {
  try {
    const callParams = getNoAuthCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      `${urls.getLotteries}?page=${body.page}&pageSize=${body.totalPages}&totalItems=${body.totalItems}&pagelimit=${body.pageLimit}`,
      callParams,
      isToast
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function Get_Purchase_Lotteries_History(
  body = {},
  isToast = false
) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      `${urls.historyTicket}?page=${body.page}&limitPerPage=${body.limit}&totalPages=${body.totalPages}&totalData=${body.totalItems}`,

      callParams,

      isToast
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function lottery_Amount_Alert(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      `${urls.alertPromptAmount}/${body.lotteryId}`,
      callParams,
      isToast
    );
    return response;
  } catch (error) {
    console.error("Error fetching lottery amount", error);
    throw error;
  }
}

export async function activityLog(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(`${urls.activityLog}`, callParams, isToast);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function SearchLotteryTicketUser(body = {}, isToast = true) {
  try {
    const callParams = await getCallParams(strings.POST, body, isToast);
    const response = await makeCall(urls.searchTicketUser, callParams, isToast);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function LotteryRange(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(urls.lotteryRange, callParams, isToast);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function PurhaseLotteryTicketUser(body = {}, isToast = true) {
  try {
    const callParams = await getCallParams(strings.POST, body, isToast);

    const response = await makeCall(
      `${urls.buyTicketUser}/${body.marketId}`,

      callParams,
      isToast
    );

    return response;
  } catch (error) {
    throw error;
  }
}

// export async function lotteryPurchaseHIstoryUserNew(body = {}, isToast = false) {
//   try {
//     const callParams = await getCallParams(strings.POST, body, isToast);
//     const response = await makeCall(urls.userPurchaseHIstory, callParams, isToast);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// }
export async function lotteryPurchaseHIstoryUserNew(
  body = {},
  isToast = false
) {
  try {
    const callParams = await getCallParams(strings.POST, body, isToast); // Using POST method with `body`
    const response = await makeCall(
      `${urls.userPurchaseHIstory}/${body.marketId}?page=${body.page}&limitPerPage=${body.limit}&sem=${body.searchBySem}`, // Constructing URL with pagination and search term
      callParams,
      isToast
    );
    return response;
  } catch (error) {
    throw error;
  }
}

// export async function getLotteryMarketsApi(body = {}, isToast = false) {
//   try {
//     const callParams = await getCallParams(strings.GET, body, isToast);

//     const userLoggedIn = body.user.isLogin;
//     if (!userLoggedIn) {
//       console.warn("User is not logged in. Skipping API call for lottery markets.");
//       return { success: false, data: [] };
//     }

//     const response = await makeCall(urls.getLotteryMarketsApi, callParams, isToast);
//     return response;
//   } catch (error) {
//     console.error("Error fetching lottery markets:", error.message || error);
//     return { success: false, data: [], error: error.message || error };
//   }
// }

// For the time being donot chnage this api and this api is resolved for the headers error

export const getLotteryMarketsApi = async (body = {}, isToast = false) => {
  try {
    const { user } = body;
    if (!user?.isLogin || !user?.accessToken) {
      console.warn(
        "User is not logged in or access token is missing. Skipping API call for lottery markets."
      );
      return { success: false, data: [] };
    }
    const callParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
    };
    const response = await fetch(
      urls.getLotteryMarketsApi,
      callParams,
      isToast
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error in getLotteryMarketsApi:", err);
    return { success: false, error: err.message };
  }
};

export async function getWinningResult(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(urls.getPrizeResult, callParams, isToast);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function GetResultMarket(body = {}) {
  try {
    const callParams = await getCallParams(strings.GET, body);
    const response = await makeCall(
      `${urls.getResultMarkets}?date=${body.date}`,
      callParams
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function GetWiningResult(body) {
  try {
    const callParams = await getCallParams(strings.GET, body);
    const response = await makeCall(
      `${urls.GetResult}/${body.marketId}`,
      callParams
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function GetPurchaseHistoryMarketTimings(
  body = {},
  isToast = false
) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      `${urls.getPurchaseMarketTime}?date=${body.date}`,
      callParams,
      isToast
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function user_getLotteryBetHistory_api(
  body = {},
  isToast = false
) {
  try {
    const callParams = await getCallParams(strings.POST, body, isToast);
    const response = await makeCall(
      `${urls.userLotteryBetHistoryById}?page=${body.pageNumber}&limit=${body.dataLimit}&startDate=${body.startDate}&endDate=${body.endDate}&dataType=${body.dataSource}&type=${body.type}`,
      callParams,
      isToast
    );

    return response;
  } catch (error) {
    throw error;
  }
}

export async function getProfitLossLotteryEvent(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      `${urls.getProfitLossLotteryEvent}?page=${body.pageNumber}&limit=${body.dataLimit}&search=${body.searchName}`,
      callParams,
      isToast
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export const getUserLotteryBetHistory_api = async (
  body = {},
  isToast = false
) => {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(
      `${urls.getUserLotteryBetList}/${body.marketId}?page=${body.pageNumber}&limit=${body.dataLimit}&search=${body.searchName}`,
      callParams,
      isToast
    );
    return response;
  } catch (err) {
    throw err;
  }
};

export async function getUpdateMarketStatus(body, marketId, isToast = false) {
  try {
    const callParams = getNoAuthCallParams(strings.POST, body, isToast);
    const response = await makeCall(
      `${urls.getUpdateMarketStatus}/${marketId}`,
      callParams,
      isToast
    );
    debugger;
    return response;
  } catch (error) {
    throw error;
  }
}

export const getSliderImgText = async () => {
  try {
    const callParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(urls.getSliderTextImg, callParams);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error in getSliderImgText:", err);
    throw err;
  }
};

export const getGameImg = async () => {
  try {
    const callParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(urls.getGameImg, callParams);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error in getSliderImgText:", err);
    throw err;
  }
};

export const getGifImg = async () => {
  try {
    const callParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(urls.getGifImg, callParams);

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error in getSliderImgText:", err);
    throw err;
  }
};

export const getInnerImg = async () => {
  try {
    const callParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(urls.getInnerImg, callParams);

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error in getSliderImgText:", err);
    throw err;
  }
};
export const singleOuterImg = async () => {
  try {
    const callParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(urls.getSingleOuterImg, callParams);

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error in getSliderImgText:", err);
    throw err;
  }
};

export const getAnnouncement = async () => {
  try {
    const callParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(urls.getAannouncement, callParams);

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error in getSliderImgText:", err);
    throw err;
  }
};

export const getInnerAnnouncement = async () => {
  try {
    const callParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(urls.getInnerAannouncement, callParams);

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error in getSliderImgText:", err);
    throw err;
  }
};

export const getUserLotteryMarket_api = async (body = {}, isToast = false) => {
  try {
    const callParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await makeCall(urls.anonymousMarkets, callParams, isToast);
    return response;
  } catch (err) {
    throw err;
  }
};

export async function inPlayMarket_api(body = {}, isToast = false) {
  try {
    const callParams = await getCallParams(strings.GET, body, isToast);
    const response = await makeCall(urls.InplayMarket, callParams, isToast);

    return response;
  } catch (error) {
    throw error;
  }
}

export async function updateFCMToken(fcm_token, isToast = false) {
  try {
    const payload = { fcm_token: fcm_token };
    const callParams = await getCallParams(strings.POST, payload, isToast);
    const response = await makeCall(urls.updateFcm, callParams, isToast);
    return response;
  } catch (error) {
    console.error("Error updating FCM token", error);
    throw error;
  }
}

export async function getUserNotifications(isToast = false) {
  try {
    const callParams = await getCallParams(strings.GET, null, isToast);
    const response = await makeCall(urls.getFcm, callParams, isToast);
    return response;
  } catch (error) {
    console.error("Error fetching notifications", error);
    throw error;
  }
}

export async function markNotificationAsRead(body = {},isToast = false) {
  try {
    const callParams = await getCallParams(strings.PUT, body , isToast);
    const response = await makeCall(urls.getToRead, callParams, isToast);
    return response;
  } catch (err) {
    throw err;
  }
}
