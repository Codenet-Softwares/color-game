import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { sequelize } from './db.js';

// Route imports
import { AdminRoute } from './routes/admin.route.js';
import { UserRoute } from './routes/user.route.js';
import { GameRoute } from './routes/game.route.js';
import { authRoute } from './routes/auth.route.js';
import { InactiveGameRoute } from './routes/inactiveGame.route.js';
import { externalApisRoute } from './routes/externalApis.route.js';
import { lotteryRoute } from './routes/lotteryGame.route.js';
import { voidGameRoute } from './routes/voidGame.route.js';
import { DeleteRoutes } from './routes/delete.route.js';
import { MarketDeleteApprovalRoute } from './routes/marketApproval.route.js';

// Model imports
import Game from './models/game.model.js';
import Market from './models/market.model.js';
import Runner from './models/runner.model.js';
import MarketBalance from './models/marketBalance.js';

// Helpers
import { checkAndManageIndexes } from './helper/indexManager.js';
import { wlExternalRoute } from './routes/wl.external.route.js';

// Env config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env' });
}
console.log('Running in environment:', process.env.NODE_ENV);

// Express app setup
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// CORS setup
const allowedOrigins = process.env.FRONTEND_URI?.split(',') || [];
app.use(cors({ origin: allowedOrigins }));

// Routes
app.get('/', (req, res) => {
  res.send(`${process.env.NODE_ENV} environment is running.`);
});
AdminRoute(app);
authRoute(app);
UserRoute(app);
GameRoute(app);
InactiveGameRoute(app);
externalApisRoute(app);
lotteryRoute(app);
voidGameRoute(app);
DeleteRoutes(app);
MarketDeleteApprovalRoute(app);
wlExternalRoute(app)

// Model Associations
Game.hasMany(Market, { foreignKey: 'gameId', sourceKey: 'gameId' });
Market.belongsTo(Game, { foreignKey: 'gameId', targetKey: 'gameId' });

Market.hasMany(Runner, { foreignKey: 'marketId', sourceKey: 'marketId' });
Runner.belongsTo(Market, { foreignKey: 'marketId', targetKey: 'marketId' });

// CurrentOrder.belongsTo(Market, { foreignKey: 'marketId', targetKey: 'marketId', as: 'market' });
// BetHistory.belongsTo(Market, { foreignKey: 'marketId', targetKey: 'marketId', as: 'market' });

Market.hasMany(MarketBalance, { foreignKey: 'marketId', sourceKey: 'marketId' });
MarketBalance.belongsTo(Market, { foreignKey: 'marketId', targetKey: 'marketId' });

// InactiveGame.belongsTo(Game, { foreignKey: 'gameId' });
// Game.hasMany(InactiveGame, { foreignKey: 'gameId' });

// InactiveGame.belongsTo(Market, { foreignKey: 'marketId' });
// Market.hasMany(InactiveGame, { foreignKey: 'marketId' });

// InactiveGame.belongsTo(Runner, { foreignKey: 'runnerId' });
// Runner.hasMany(InactiveGame, { foreignKey: 'runnerId' });

// Index Management
checkAndManageIndexes('game');
checkAndManageIndexes('runner');
checkAndManageIndexes('market');

// Sync and Start Server
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('DB Synced!');

    // Start server
    app.listen(process.env.PORT, () => {
      console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB Sync Error:', err);
  });

// Cleanup on exit
process.on('SIGINT', async () => {
  await sequelize.close();
  process.exit(0);
});
