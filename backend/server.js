import dotenv from 'dotenv';
import mysql from 'mysql2';
import express from 'express';
import bodyParser from 'body-parser';
import { AdminRoute } from './routes/admin.route.js';
import { UserRoute } from './routes/user.route.js';
import { GameRoute } from './routes/game.route.js';
import { SliderRoute } from './routes/slider.route.js';
import cors from 'cors';
import { AnnouncementRoute } from './routes/announcement.route.js';
import sequelize from './db.js';
import Game from './models/game.model.js';
import Market from './models/market.model.js';
import Runner from './models/runner.model.js';
import { authRoute } from './routes/auth.route.js';
import CurrentOrder from './models/currentOrder.model.js';
import BetHistory from './models/betHistory.model.js';
import MarketBalance from './models/marketBalance.js';
import { InactiveGameRoute } from './routes/inactiveGame.route.js';
import InactiveGame from './models/inactiveGame.model.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { externalApisRoute } from './routes/externalApis.route.js';
import { checkAndManageIndexes } from './helper/indexManager.js';
import { lotteryRoute } from './routes/lotteryGame.route.js';
import { voidGameRoute } from './routes/voidGame.route.js';
import { DeleteRoutes } from './routes/delete.route.js';
import { MarketDeleteApprovalRoute } from './routes/marketApproval.route.js';
import { updateColorGame } from './helper/cgCron.js';

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env' });
}

console.log('Running in environment:', process.env.NODE_ENV);


dotenv.config();
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = process.env.FRONTEND_URI.split(',');
app.use(cors({ origin: allowedOrigins }));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.log('Error to connecting Database: ' + err.message);
  } else {
    console.log('Database connection successfully');
    connection.release();
  }
});

app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.send('Production environment is running.');
  } else {
    res.send('Development environment is running.');
  }
});

AdminRoute(app);
authRoute(app);
UserRoute(app);
GameRoute(app);
AnnouncementRoute(app);
SliderRoute(app);
InactiveGameRoute(app);
externalApisRoute(app);
lotteryRoute(app)
voidGameRoute(app);
DeleteRoutes(app);
MarketDeleteApprovalRoute(app);

Game.hasMany(Market, { foreignKey: 'gameId', sourceKey: 'gameId' });
Market.belongsTo(Game, { foreignKey: 'gameId', targetKey: 'gameId' });

Market.hasMany(Runner, { foreignKey: 'marketId', sourceKey: 'marketId' });
Runner.belongsTo(Market, { foreignKey: 'marketId', targetKey: 'marketId' });

CurrentOrder.belongsTo(Market, { foreignKey: 'marketId', targetKey: 'marketId', as: 'market' });
BetHistory.belongsTo(Market, { foreignKey: 'marketId', targetKey: 'marketId', as: 'market' });

Market.hasMany(MarketBalance, { foreignKey: 'marketId', sourceKey: 'marketId' });
MarketBalance.belongsTo(Market, { foreignKey: 'marketId', targetKey: 'marketId' });

InactiveGame.belongsTo(Game, { foreignKey: 'gameId' });
Game.hasMany(InactiveGame, { foreignKey: 'gameId' });

InactiveGame.belongsTo(Market, { foreignKey: 'marketId' });
Market.hasMany(InactiveGame, { foreignKey: 'marketId' });

InactiveGame.belongsTo(Runner, { foreignKey: 'runnerId' });
Runner.hasMany(InactiveGame, { foreignKey: 'runnerId' });

checkAndManageIndexes('game');
checkAndManageIndexes('runner');
checkAndManageIndexes('market');


sequelize
  .sync({ alter: false })
  .then(() => {
    console.log('Database & tables created!');
    app.listen(process.env.PORT, () => {
      console.log(`App is running on - http://localhost:${process.env.PORT || 7000}`);
    });
    
    setInterval(updateColorGame, 1000);
    
  })
  .catch((err) => {
    console.error('Unable to create tables:', err);
  });
