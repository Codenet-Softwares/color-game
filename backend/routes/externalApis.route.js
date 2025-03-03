import { user_Balance } from "../controller/admin.controller.js";
import { calculateExternalProfitLoss, liveMarketBet, getExternalUserBetHistory, marketExternalProfitLoss, runnerExternalProfitLoss, getLiveBetGames, getExternalUserBetList, liveUserBet, getExternalLotteryP_L, getVoidMarket, getRevokeMarket, getDeleteLiveMarket, revokeLiveBet, userLiveBte, getAllLotteryMarket, getExposure, deleteBetAfterWin } from "../controller/externalApis.controller.js";
import customErrorHandler from "../middleware/customErrorHandler.js";
import { authenticateAdmin } from "../middleware/lottery.auth.js";
import { authenticateSuperAdmin } from "../middleware/whiteLabelAuth.js";
import { betHistorySchema, calculateProfitLossSchema, marketProfitLossSchema, runnerProfitLossSchema, validateDeleteLiveMarket, validateGetLiveUserBet, validateMarketId, validateRevokeLiveMarket, validateRevokeMarket, validateUserLiveBet, validateVoidMarket } from "../schema/commonSchema.js";

export const externalApisRoute = (app) => {
  app.get('/api/external-user-betHistory/:userName/:gameId', betHistorySchema, customErrorHandler, authenticateSuperAdmin, getExternalUserBetHistory);

  app.get('/api/external-profit_loss/:userName', calculateProfitLossSchema, customErrorHandler, authenticateSuperAdmin, calculateExternalProfitLoss);

  app.get('/api/external-profit_loss_market/:userName/:gameId', marketProfitLossSchema, customErrorHandler, authenticateSuperAdmin, marketExternalProfitLoss);

  app.get('/api/external-profit_loss_runner/:userName/:marketId', runnerProfitLossSchema, customErrorHandler, authenticateSuperAdmin, runnerExternalProfitLoss);

  app.get('/api/user-external-liveBet/:marketId', authenticateSuperAdmin, liveMarketBet);

  app.get('/api/user-external-liveGamesBet', getLiveBetGames);

  app.get('/api/user-external-betList/:userName/:runnerId', getExternalUserBetList);

  app.get('/api/users-liveBet/:marketId', validateGetLiveUserBet, customErrorHandler, liveUserBet);

  app.get('/api/external-lottery-profit-loss/:userName', getExternalLotteryP_L);

  app.post('/api/external/void-market-lottery', validateVoidMarket, customErrorHandler, authenticateAdmin, getVoidMarket)

  app.post('/api/external/revoke-market-lottery', validateRevokeMarket, customErrorHandler, authenticateAdmin, getRevokeMarket)

  app.post('/api/external/delete-liveMarket-lottery', validateDeleteLiveMarket, customErrorHandler, authenticateAdmin, getDeleteLiveMarket)


  app.post('/api/external/revoke-liveBet-lottery', validateRevokeLiveMarket, customErrorHandler, authenticateAdmin, revokeLiveBet)

  app.get('/api/external/user-live-bet/:marketId', validateUserLiveBet, customErrorHandler, authenticateSuperAdmin, userLiveBte)

  app.get('/api/external/get-allLottery-game', getAllLotteryMarket)

  app.get('/api/external/get-user-balance/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const balance = await user_Balance(userId);
      res.json({ balance });
    } catch (error) {
      res.status(500).json({ error: `Error fetching balance: ${error.message}` });
    }
  });

  app.get('/api/external/get-exposure/:userId', getExposure)

  app.post('/api/external/delete-bet-afterWin-lottery',  deleteBetAfterWin)


}

