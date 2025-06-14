import { authorize } from '../middleware/auth.js';
import dotenv from 'dotenv';
import customErrorHandler from '../middleware/customErrorHandler.js';
import {
  createAdmin,
  //checkMarketStatus,
  deposit,
  getAllUsers,
  afterWining,
  updateByAdmin,
  buildRootPath,
  revokeWinningAnnouncement,
  liveUsersBet,
  getUsersLiveBetGames,
  getBetsAfterWin,
  getBetMarketsAfterWin,
  createSubAdmin,
  approveResult,
  getResultRequests,
  getSubAdminResultHistory,
  deleteBetAfterWin,
  afterWinVoidMarket,
  winningData,
  getDetailsWinningData,
  getSubAdmins,
  getSubAdminHistory,
  getSubadminResult,
  liveUsersBetHistory,
  getBetsAfterWinHistory,
  getDetailsWinningBet,
  inActiveMarketStatus,
  deleteSubAdmin,
  createTitleTextNotification,
  updateHotGameStatus,
  updateRunner,
} from '../controller/admin.controller.js';
import { depositSchema, exUpdateBalanceSchema, winningSchema, suspendedMarketSchema, adminCreateValidate, validateRevokeWinningAnnouncement, validateLiveUsersBet, validateLiveGames, validateBetsAfterWin, validateSubAdmin, validateApproveResult, validatesDeleteBetAfterWin, validateAfterWinVoidMarket, validateDeleteSubAdmin, validateTitleText, validateHotGame, validUpdate } from '../schema/commonSchema.js';
import { string, subAdminPermissions } from '../constructor/string.js';

dotenv.config();

export const AdminRoute = (app) => {
  // done
  app.post('/api/admin-create', adminCreateValidate, customErrorHandler, createAdmin);

  // done
  app.post('/api/create-subAdmin', validateSubAdmin, customErrorHandler, authorize([string.Admin]), createSubAdmin);

  app.delete('/api/subAdmin-delete/:adminId', validateDeleteSubAdmin, customErrorHandler, authorize([string.Admin]), deleteSubAdmin);

  // done
  app.get('/api/get-sub-admins', authorize([string.Admin]), getSubAdmins);

  app.put(
    '/api/update-inActive-market-status/:marketId',
    suspendedMarketSchema,
    customErrorHandler,
    authorize([string.Admin]),
    inActiveMarketStatus,
  );
  // done
  app.get('/api/all-user', getAllUsers);
  // done
  app.post('/api/deposit-amount', depositSchema, customErrorHandler, authorize([string.Admin]), deposit);

  app.post('/api/afterWining', winningSchema, customErrorHandler, authorize([string.subAdmin], [subAdminPermissions.resultAnnouncement]), afterWining);

  app.post('/api/extrnal/balance-update', exUpdateBalanceSchema, customErrorHandler, updateByAdmin);

  app.post('/api/root-path/:action', buildRootPath);

  app.post('/api/revoke-winning-announcement', validateRevokeWinningAnnouncement, customErrorHandler, revokeWinningAnnouncement);

  app.get('/api/live-users-bet/:marketId', validateLiveUsersBet, customErrorHandler, authorize([string.Admin]), liveUsersBet);

  app.get('/api/live-users-bet-games', validateLiveGames, customErrorHandler, authorize([string.Admin]), getUsersLiveBetGames);

  app.get('/api/get-bets-afterWin/:marketId', validateBetsAfterWin, customErrorHandler, authorize([string.Admin]), getBetsAfterWin);

  app.get('/api/get-bet-markets-afterWin', authorize([string.Admin]), getBetMarketsAfterWin);

  app.post("/api/admin/approve-result", validateApproveResult, customErrorHandler, authorize([string.Admin]), approveResult);

  app.get('/api/get-result-requests', authorize([string.Admin]), getResultRequests);

  app.get('/api/subAdmin/result-histories', authorize([string.Admin, string.subAdmin]), getSubAdminResultHistory);

  app.get('/api/get-after-winning-data', authorize([string.Admin]), winningData);

  app.get('/api/getDetails-winning-data/:marketId', validateBetsAfterWin, customErrorHandler, authorize([string.Admin]), getDetailsWinningData);

  app.post('/api/delete-bet-after-win', validatesDeleteBetAfterWin, customErrorHandler, authorize([string.Admin]), deleteBetAfterWin);

  app.post('/api/void-market-after-win', validateAfterWinVoidMarket, customErrorHandler, authorize([string.Admin]), afterWinVoidMarket);

  app.get('/api/subAdmin/get-subAdmin-history', authorize([string.subAdmin]), getSubAdminHistory)

  app.get('/api/subAdmin/get-result', authorize([string.subAdmin]), getSubadminResult)

  app.get('/api/live-users-bet-history/:marketId/:userId', validateLiveUsersBet, customErrorHandler, authorize([string.Admin]), liveUsersBetHistory);

  app.get('/api/get-bets-afterWin-history/:marketId/:userId', validateBetsAfterWin, customErrorHandler, authorize([string.Admin]), getBetsAfterWinHistory);

  app.get('/api/get-Details-winning-bet/:marketId/:userId', validateBetsAfterWin, customErrorHandler, authorize([string.Admin]), getDetailsWinningBet);

  app.post('/api/create-notification-colorgame', validateTitleText, customErrorHandler, authorize([string.Admin]), createTitleTextNotification);

    app.put('/api/update-hotGame-status', validateHotGame, customErrorHandler, authorize([string.Admin]), updateHotGameStatus);

    app.put('/api/subadmin/edit-runner',validUpdate, customErrorHandler, authorize([string.subAdmin]), updateRunner)
};

