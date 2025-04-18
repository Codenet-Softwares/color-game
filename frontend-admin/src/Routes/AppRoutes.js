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
import BetHistoryPage from "../Pages/BetHistory/BetHistoryPage";
import UserBetHistory from "../Pages/BetHistory/UserBetHistory";
import DeleteBetHistory from "../Pages/BetHistory/DeleteBetHistory";
import DeleteMarket from "../Components/Game/DeleteMarket";
import CreateImage from "../Pages/AddImages/SliderImages/CreateImage";
import SliderImageDelete from "../Pages/AddImages/SliderImages/SliderImageDelete";
import CreateGameImage from "../Pages/AddImages/AddGameImageSlider/CreateGameImage";
import UpdateGameSlider from "../Pages/AddImages/AddGameImageSlider/UpdateGameSlider";
import AddGameGif from "../Pages/AddImages/AddGameGIFimage/AddGameGif";
import UpdateGifSlider from "../Pages/AddImages/AddGameGIFimage/UpdateGifSlider";
import CreateInnerImage from "../Pages/AddImages/AddInnerImage/CreateInnerImage";
import UpdateInnerImage from "../Pages/AddImages/AddInnerImage/UpdateInnerImage";
import InnerAnnouncement from "../Pages/Announcements/InnerAnnouncement";
import OuterAnnouncement from "../Pages/Announcements/OuterAnnouncement";
import UpdateOuterAnnouncement from "../Pages/Announcements/UpdateOuterAnnouncement";
import UpdateInnerAnnouncement from "../Pages/Announcements/UpdateInnerAnnouncement";
import CreateSubAdmin from "../Components/CreateSubAdmin";
import ViewWinningRequest from "../Components/ViewWinningRequest";
import ViewWinningHistory from "../Components/ViewWinningHistory";
import ViewSubAdmin from "../Components/ViewSubAdmin";
import WinTracker from "../Components/WinTracker";
import BetWinTracker from "../Components/BetWinTracker";
import SubAdminView from "../Components/SubAdmin/SubAdminView";
import SubAdminWinResult from "../Components/SubAdmin/SubAdminWinResult";
import ResetPassword from "../Pages/Accounts/ResetPassword/ResetPassword";

const AppRoutes = () => {
  const userrole = sessionStorage.getItem("role") || "";
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="reset-password"
          element={
          
              <ResetPassword/>
           
          }
        />
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
            path="deleteMarket"
            element={
              <RequireAuth>
                <DeleteMarket />
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
            path="create-image"
            element={
              <RequireAuth>
                <CreateImage />
              </RequireAuth>
            }
          />
          <Route
            path="slider-image-delete"
            element={
              <RequireAuth>
                <SliderImageDelete />
              </RequireAuth>
            }
          />
          <Route
            path="GameImage-slider"
            element={
              <RequireAuth>
                <CreateGameImage />
              </RequireAuth>
            }
          />
          <Route
            path="UpdateGameImage-slider"
            element={
              <RequireAuth>
                <UpdateGameSlider />
              </RequireAuth>
            }
          />
          <Route
            path="create-game-GIF"
            element={
              <RequireAuth>
                <AddGameGif />
              </RequireAuth>
            }
          />
          <Route
            path="update-game-GIF"
            element={
              <RequireAuth>
                <UpdateGifSlider />
              </RequireAuth>
            }
          />
          <Route
            path="create-inner-image"
            element={
              <RequireAuth>
                <CreateInnerImage />
              </RequireAuth>
            }
          />
          <Route
            path="update-inner-image"
            element={
              <RequireAuth>
                <UpdateInnerImage />
              </RequireAuth>
            }
          />
          <Route
            path="outer-announcement"
            element={
              <RequireAuth>
                <OuterAnnouncement />
              </RequireAuth>
            }
          />
          <Route
            path="update-outer-announcement"
            element={
              <RequireAuth>
                <UpdateOuterAnnouncement />
              </RequireAuth>
            }
          />
          <Route
            path="inner-announcement"
            element={
              <RequireAuth>
                <InnerAnnouncement />
              </RequireAuth>
            }
          />
          <Route
            path="update-inner-announcement"
            element={
              <RequireAuth>
                <UpdateInnerAnnouncement />
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
