import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contextApi/context";
import Home from "./screen/home/home";
import NotFound from "./screen/common/notFound";
import GameView from "./screen/gameView/gameView";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import RulesPage from "./screen/common/rulesPage";
import ForgotPassword from "./screen/chnagePassword/forgotPassword";
import PrivateRoute from "./globlaCommon/privateRoute";

import BetHistory from "./screen/history/BetHistory";

import Loading from "./globlaCommon/loading";
import GameNameList from "./screen/profitAndLoss/gameNameList";
import MarketNameList from "./screen/profitAndLoss/marketNameList";
import ResetPassword from "./screen/common/ResetPassword";

import LotteryCards from "./screen/Lottery/LotteryCards";

import LotteryPurchaseLayout from "./screen/Lottery/LotteryPurchaseLayout";
import ProfitAndLoss from "./screen/profitAndLoss/profitAndLoss";
import AccountStatement from "./screen/AccountStatement";
import ActivityLog from "./screen/activityLog/activityLog";
import ResultLayout from "./screen/Lottery/ResultLayout";
import LotteryPageHoc from "./screen/Lottery/lotteryPageHoc";

function App() {
  return (
    <AppProvider>
      <ToastContainer
        position="top-center"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Loading />
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/passwordReset" element={<ResetPassword />} />
          <Route path="/gameView/:gameName/:id" element={<GameView />} />
          <Route  path="/lottery/:marketId" element={<LotteryPageHoc/>} />
          <Route
            path="/LotteryPurchaseHistory"
            element={<LotteryPurchaseLayout/>}
          />

<Route
            path="/WinningResult"
            element={<ResultLayout/>}
          />

          {/* private routes */}
          <Route
            path="/forgetPassword"
            element={
              <PrivateRoute>
                <ForgotPassword />
              </PrivateRoute>
            }
          />
          <Route
            path="/rulesPage"
            element={
              <PrivateRoute>
                <RulesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/betHistory"
            element={
              <PrivateRoute>
                <BetHistory />
              </PrivateRoute>
            }
          />

          <Route
            path="/profit-loss"
            element={
              <PrivateRoute>
                <ProfitAndLoss />
              </PrivateRoute>
            }
          />
          <Route
            path="/gameNameList/:gameId"
            element={
              <PrivateRoute>
                <GameNameList />
              </PrivateRoute>
            }
          />
          <Route
            path="/marketNameList/:marketId"
            element={
              <PrivateRoute>
                <MarketNameList />
              </PrivateRoute>
            }
          />
          <Route
            path="/accountStatement"
            element={
              <PrivateRoute>
                <AccountStatement />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/activityLog"
            element={
              <PrivateRoute>
                <ActivityLog />
              </PrivateRoute>
            }
          />

          {/* not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
