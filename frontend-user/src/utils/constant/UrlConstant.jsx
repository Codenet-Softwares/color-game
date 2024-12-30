// import strings from "./stringConstant";

class UrlConstant {
  constructor() {}

  // url_dev = "https://cg.server.dummydoma.in/api";
  url_dev = "http://localhost:7000/api";

  // user api
  user = "user";
  login = `${this.url_dev}/${this.user}-login`;
  userLogout = `${this.url_dev}/${this.user}-logout`; // added logout api
  userGames = `${this.url_dev}/${this.user}-games`;
  userAllGamesDetails = `${this.url_dev}/${this.user}-all-gameData`;
  userGameDetailById = `${this.url_dev}/${this.user}-filter-gameData`;
  userMarketDetailById = `${this.url_dev}/${this.user}-filter-marketData`;
  changePassword = `${this.url_dev}/${this.user}/resetpassword`;
  userBetHistoryById = `${this.url_dev}/${this.user}-betHistory`;
  userGetOpenBet = `${this.url_dev}/${this.user}-current-market`;
  userBackLayData = `${this.url_dev}/${this.user}-currentOrderHistory`;
  getDataFromHistoryLandingPage = `${this.url_dev}/${this.user}-betHistory-games`;
  betHistory = `${this.url_dev}/${this.user}-betHistory`;
  userWallet = `${this.url_dev}/${this.user}/view-wallet`;
  userBidding = `${this.url_dev}/user-bidding`;
  profitAndLoss = `${this.url_dev}/profit_loss`;
  profitAndLossMarket = `${this.url_dev}/profit_loss_market`;
  profitAndLossRunner = `${this.url_dev}/profit_loss_runner`;
  user_carrouselImageDynamic = `${this.url_dev}/admin/slider-text-img`;
  resetPassword = `${this.url_dev}/reset-password`;
  getLotteries = `${this.url_dev}/get-lottery-game`;
  purchaseTicket = `${this.url_dev}/purchase-lottery`;
  historyTicket = `${this.url_dev}/purchase-history`;
  alertPromptAmount = `${this.url_dev}/${this.user}-lotteryAmount`;
  getProfitLossGame = `${this.url_dev}/profit_loss`;
  getProfitLossRunner = `${this.url_dev}/profit_loss_runner`;
  getProfitLossEvent = `${this.url_dev}/profit_loss_market`;
  getAccountStatement = `${this.url_dev}/${this.user}-account-statement`;
  getUserBetList = `${this.url_dev}/get-user-betList`;
  getOpenBetsGame = `${this.url_dev}/${this.user}-currentOrder-games`;
  activityLog = `${this.url_dev}/user-activitylog`;
  searchTicketUser = `${this.url_dev}/search-ticket`;
  lotteryRange = `${this.url_dev}/get-range`;
  buyTicketUser = `${this.url_dev}/purchase-lottery`;
  userPurchaseHIstory = `${this.url_dev}/purchase-history`;

  getLotteryMarketsApi = `${this.url_dev}/${this.user}-getAllMarket`;

  getPrizeResult = `${this.url_dev}/prize-results`;
  userLotteryBetHistoryById = `${this.url_dev}/lottery-bet-history`;
  getProfitLossLotteryEvent = `${this.url_dev}/lottery-profit-loss`;
  getUserLotteryBetList = `${this.url_dev}/lottery-betHistory-profitLoss`;
  getResultMarkets= `${this.url_dev}/${this.user}/markets-dateWise`;
  GetResult=`${this.url_dev}/${this.user}-lottery-results`; 
  getPurchaseMarketTime = `${this.url_dev}/${this.user}/getMarkets`; 
  getUpdateMarketStatus = `${this.url_dev}/update-market-status`;
}

const urls = new UrlConstant();
export default urls;
