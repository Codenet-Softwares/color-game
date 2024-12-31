import { authorize } from '../middleware/auth.js';
import dotenv from 'dotenv';
import customErrorHandler from '../middleware/customErrorHandler.js';
import {
  createAdmin,
  checkMarketStatus,
  deposit,
  sendBalance,
  getAllUsers,
  afterWining,
  updateByAdmin,
  buildRootPath,
  revokeWinningAnnouncement,
  liveUsersBet,
  getUsersLiveBetGames,
  getBetsAfterWin
} from '../controller/admin.controller.js';
import { depositSchema, exUpdateBalanceSchema, winningSchema, suspendedMarketSchema, adminCreateValidate, validateSendBalance, validateRevokeWinningAnnouncement, validateLiveUsersBet, validateLiveGames, validateBetsAfterWin } from '../schema/commonSchema.js';
import { string } from '../constructor/string.js';

dotenv.config();

export const AdminRoute = (app) => {
  // done
  app.post('/api/admin-create', adminCreateValidate, customErrorHandler, authorize([string.Admin]), createAdmin);

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
  // done
  app.post('/api/sendBalance-user', validateSendBalance, customErrorHandler, sendBalance); // this api not use in frontend side 

  app.post('/api/afterWining', winningSchema, customErrorHandler, authorize([string.Admin]), afterWining);

  app.post('/api/extrnal/balance-update', exUpdateBalanceSchema, customErrorHandler, updateByAdmin);

  app.post('/api/root-path/:action', buildRootPath);

  app.post('/api/revoke-winning-announcement', validateRevokeWinningAnnouncement, customErrorHandler, revokeWinningAnnouncement);

  app.get('/api/live-users-bet/:marketId', validateLiveUsersBet, customErrorHandler, authorize([string.Admin]), liveUsersBet);

  app.get('/api/live-users-bet-games', validateLiveGames, customErrorHandler, authorize([string.Admin]), getUsersLiveBetGames);

  app.get('/api/get-bets-afterWin/:marketId', validateBetsAfterWin, customErrorHandler, authorize([string.Admin]), getBetsAfterWin);

};


