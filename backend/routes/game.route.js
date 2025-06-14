import { string, subAdminPermissions } from '../constructor/string.js';
import {
  createGame,
  createMarket,
  getAllGames,
  getAllMarkets,
  updateGame,
  updateMarket,
  createRunner,
  createRate,
  updateRunner,
  updateRate,
  getAllRunners,
  deleteGame,
  deleteMarket,
  deleteRunner,
  gameActiveInactive,
  updateGameStatus,
  trashDeleteGame,
} from '../controller/game.controller.js';
import { authorize } from '../middleware/auth.js';
import customErrorHandler from '../middleware/customErrorHandler.js';
import {
  createdGameSchema,
  createdMarketSchema,
  updateGameSchema,
  updateMarketSchema,
  createdRateSchema,
  createdRunnerSchema,
  updateRateSchema,
  updateRunnerSchema,
  gameIdValidate,
  validateMarketId,
  validateDeleteRunner,
  gameActiveInactiveValidate,
  validateUpdateGameStatus,
} from '../schema/commonSchema.js';

export const GameRoute = (app) => {
  // done
  app.post('/api/create-games', createdGameSchema, customErrorHandler, authorize([string.Admin]), createGame);
  // done
  app.get('/api/all-games', customErrorHandler, authorize([string.Admin,string.subAdmin],[subAdminPermissions.resultAnnouncement]), getAllGames);
  // done
  app.put('/api/update/game', updateGameSchema, customErrorHandler, authorize([string.Admin]), updateGame);
  // done
  app.post(
    '/api/create-markets/:gameId',
    createdMarketSchema,
    customErrorHandler,
    authorize([string.Admin]),
    createMarket,
  );
  // done
  app.get('/api/all-markets/:gameId', customErrorHandler, authorize([string.Admin,string.subAdmin],[subAdminPermissions.resultAnnouncement]), getAllMarkets);
  // done
  app.put('/api/update/market', updateMarketSchema, customErrorHandler, authorize([string.Admin]), updateMarket);
  // done
  app.post(
    '/api/create-runners/:marketId',
    createdRunnerSchema,
    customErrorHandler,
    authorize([string.Admin]),
    createRunner,
  );
  // done
  app.put('/api/update/runner', updateRunnerSchema, customErrorHandler, authorize([string.Admin]), updateRunner);
  // done
  app.get('/api/all-runners/:marketId', customErrorHandler, authorize([string.Admin,string.subAdmin],[subAdminPermissions.resultAnnouncement]), getAllRunners);
  // done
  app.post('/api/create-Rate/:runnerId', createdRateSchema, authorize([string.Admin]), customErrorHandler, createRate);
  // done
  app.put('/api/update/rate', updateRateSchema, customErrorHandler, authorize([string.Admin]), updateRate);
  // done
  app.delete('/api/game-delete/:gameId', gameIdValidate, customErrorHandler, authorize([string.Admin]), deleteGame);

  app.delete('/api/game-delete-trash/:gameId', gameIdValidate, customErrorHandler, authorize([string.Admin]), trashDeleteGame);
  // done
  app.delete(
    '/api/market-delete/:marketId',
    validateMarketId,
    customErrorHandler,
    authorize([string.Admin]),
    deleteMarket,
  );
  // done
  app.delete(
    '/api/runner-delete/:runnerId',
    validateDeleteRunner,
    customErrorHandler,
    authorize([string.Admin]),
    deleteRunner,
  );

  app.post(
    '/api/game-active-inactive',
    gameActiveInactiveValidate,
    customErrorHandler,
    authorize([string.Admin]),
    gameActiveInactive,
  );

  app.post('/api/game-active-suspended/:gameId',validateUpdateGameStatus,customErrorHandler,authorize([string.Admin]),updateGameStatus );


};


