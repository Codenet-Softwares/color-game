import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RequireAuth } from "../Utils/RequireAuth";
import Authform from "../Components/AuthForm";
import Login from "../Pages/Accounts/Login/Login";
import ErrorPage from "../ErrorPage";
import AdminLayout from "../Components/Layout/AdminLayout";
import UserCreate from "../Pages/Accounts/Login/UserCreate";
import GameMarket from "../Components/Game/GameMarket";
import MarketPlace from "../Components/Game/MarketPlace";
import RunnerView from "../Pages/Runner/RunnerView";
import ViewUserList from "../Components/User/ViewUserList";
import HomePageCarousel from "../Pages/HomePageCarousel";
import Inactive from "../Components/Inactive/Inactive";
import MarketVoidPage from "../Pages/MarketVoidPage";
import WelcomePage from "../Pages/welcomepage/WelcomePage";
import LiveBetPage from "../Pages/LiveBetPage/LiveBetPage";
import LiveUserBet from "../Pages/LiveBetPage/LiveUserBet";

const AppRoutes = () => {
  const userrole = sessionStorage.getItem("role") || "";
  return (
    <BrowserRouter>
      <Routes>
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
            path="authform"
            element={
              <RequireAuth>
                <Authform />
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
            path="userCreate"
            element={
              <RequireAuth>
                <UserCreate />
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
            path="viewUserList"
            element={
              <RequireAuth>
                <ViewUserList />
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
            path="homePageCarousel"
            element={
              <RequireAuth>
                <HomePageCarousel />
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


        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
