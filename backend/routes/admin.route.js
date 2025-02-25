import { authorize } from '../middleware/auth.js';
import dotenv from 'dotenv';
import customErrorHandler from '../middleware/customErrorHandler.js';
import {
  createAdmin,
  checkMarketStatus,
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
  approveResult
} from '../controller/admin.controller.js';
import { depositSchema, exUpdateBalanceSchema, winningSchema, suspendedMarketSchema, adminCreateValidate, validateRevokeWinningAnnouncement, validateLiveUsersBet, validateLiveGames, validateBetsAfterWin } from '../schema/commonSchema.js';
import { string, subAdminPermissions } from '../constructor/string.js';

dotenv.config();

export const AdminRoute = (app) => {
  // done
  app.post('/api/admin-create', adminCreateValidate, customErrorHandler, authorize([string.Admin]), createAdmin);

  app.post('/api/create-subAdmin', authorize([string.Admin]),createSubAdmin );
  // done
  app.post(
    '/api/update-market-status/:marketId',
    suspendedMarketSchema,
    customErrorHandler,
    authorize([string.Admin]),
    checkMarketStatus,
  );
  // done
  app.get('/api/all-user', getAllUsers);
  // done
  app.post('/api/deposit-amount', depositSchema, customErrorHandler, authorize([string.Admin]), deposit);

  app.post('/api/afterWining', winningSchema, customErrorHandler, authorize([string.Admin,string.subAdmin], [subAdminPermissions.resultAnnouncement]), afterWining);

  app.post('/api/extrnal/balance-update', exUpdateBalanceSchema, customErrorHandler, updateByAdmin);

  app.post('/api/root-path/:action', buildRootPath);

  app.post('/api/revoke-winning-announcement', validateRevokeWinningAnnouncement, customErrorHandler, revokeWinningAnnouncement);

  app.get('/api/live-users-bet/:marketId', validateLiveUsersBet, customErrorHandler, authorize([string.Admin]), liveUsersBet);

  app.get('/api/live-users-bet-games', validateLiveGames, customErrorHandler, authorize([string.Admin]), getUsersLiveBetGames);

  app.get('/api/get-bets-afterWin/:marketId', validateBetsAfterWin, customErrorHandler, authorize([string.Admin]), getBetsAfterWin);

  app.get('/api/get-bet-markets-afterWin', authorize([string.Admin]), getBetMarketsAfterWin);

  app.post("/api/admin/approve-result",authorize([string.Admin]), approveResult);


};


