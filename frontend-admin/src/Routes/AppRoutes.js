import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RequireAuth } from "../Utils/RequireAuth";
import Login from "../Pages/Accounts/Login/Login";
import ErrorPage from "../ErrorPage";
import AdminLayout from "../Components/Layout/AdminLayout";
import GameMarket from "../Components/Game/GameMarket";
import MarketPlace from "../Components/Game/MarketPlace";
import RunnerView from "../Pages/Runner/RunnerView";
import Inactive from "../Components/Inactive/Inactive";
import MarketVoidPage from "../Pages/MarketVoidPage";
import WelcomePage from "../Pages/welcomepage/WelcomePage";
import LiveBetPage from "../Pages/LiveBetPage/LiveBetPage";
import LiveUserBet from "../Pages/LiveBetPage/LiveUserBet";
import BetHistoryPage from "../Pages/BetHistory/BetHistoryPage";
import UserBetHistory from "../Pages/BetHistory/UserBetHistory";
import DeleteBetHistory from "../Pages/BetHistory/DeleteBetHistory";
import DeleteMarket from "../Components/Game/DeleteMarket";
import CreateSubAdmin from "../Components/CreateSubAdmin";
import ViewWinningRequest from "../Components/ViewWinningRequest";
import ViewWinningHistory from "../Components/ViewWinningHistory";
import ViewSubAdmin from "../Components/ViewSubAdmin";
import WinTracker from "../Components/WinTracker";
import BetWinTracker from "../Components/BetWinTracker";
import SubAdminView from "../Components/SubAdmin/SubAdminView";
import SubAdminWinResult from "../Components/SubAdmin/SubAdminWinResult";
import ResetPassword from "../Pages/Accounts/ResetPassword/ResetPassword";
import NotificationCreator from "../Components/manualNotification/NotificationCreator";

const AppRoutes = () => {
  const userrole = sessionStorage.getItem("role") || "";
  return (
    <BrowserRouter>
      <Routes>
        <Route path="reset-password" element={<ResetPassword />} />
        <Route index element={<Login />} />
        <Route path="*" element={<ErrorPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route
            path="welcome"
            element={
              <RequireAuth>
                <WelcomePage />
              </RequireAuth>
            }
          />

          <Route
            path="gameMarket/:marketPlace"
            element={
              <RequireAuth>
                <MarketPlace />
              </RequireAuth>
            }
          />

          <Route
            path="/notification-create"
            element={
              <RequireAuth>
                <NotificationCreator />
              </RequireAuth>
            }
          />
          <Route
            path="gameMarket/:marketPlace/:runner"
            element={
              <RequireAuth>
                <RunnerView />
              </RequireAuth>
            }
          />
          <Route
            path="gameMarket"
            element={
              <RequireAuth>
                <GameMarket />
              </RequireAuth>
            }
          />
          <Route
            path="deleteMarket"
            element={
              <RequireAuth>
                <DeleteMarket />
              </RequireAuth>
            }
          />

          <Route
            path="announcedGame"
            element={
              <RequireAuth>
                <Inactive />
              </RequireAuth>
            }
          />

          <Route
            path="voidMarket"
            element={
              <RequireAuth>
                <MarketVoidPage />
              </RequireAuth>
            }
          />
          <Route
            path="liveBet"
            element={
              <RequireAuth>
                <LiveBetPage />
              </RequireAuth>
            }
          />
          <Route
            path="/live_UserBet/:marketId"
            element={
              <RequireAuth>
                <LiveUserBet />
              </RequireAuth>
            }
          />
          <Route
            path="get-bet-markets-afterWin"
            element={
              <RequireAuth>
                <BetHistoryPage />
              </RequireAuth>
            }
          />
          <Route
            path="/get-bets-afterWin/:marketId"
            element={
              <RequireAuth>
                <UserBetHistory />
              </RequireAuth>
            }
          />
          <Route
            path="trash"
            element={
              <RequireAuth>
                <DeleteBetHistory />
              </RequireAuth>
            }
          />
          <Route
            path="create-subadmin"
            element={
              <RequireAuth>
                <CreateSubAdmin />
              </RequireAuth>
            }
          />
          <Route
            path="viewWinningRequest"
            element={
              <RequireAuth>
                <ViewWinningRequest />
              </RequireAuth>
            }
          />
          <Route
            path="viewWinningHistory"
            element={
              <RequireAuth>
                <ViewWinningHistory />
              </RequireAuth>
            }
          />
          <Route
            path="viewsubadmin"
            element={
              <RequireAuth>
                <ViewSubAdmin />
              </RequireAuth>
            }
          />
          <Route
            path="winTracker"
            element={
              <RequireAuth>
                <WinTracker />
              </RequireAuth>
            }
          />
          <Route
            path="/getDetails-winning-data/:marketId"
            element={
              <RequireAuth>
                <BetWinTracker />
              </RequireAuth>
            }
          />

          <Route
            path="/all-subAdmin-data"
            element={
              <RequireAuth>
                <SubAdminView />
              </RequireAuth>
            }
          />
          <Route
            path="/subAdmin-win-result"
            element={
              <RequireAuth>
                <SubAdminWinResult />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
