import React from 'react';
import './gameView.css';
import Layout from '../layout/layout';
import AppDrawer from '../common/appDrawer';
import { useAppContext } from '../../contextApi/context';
import GameWithMarketList from '../common/gameListView/gameWithMarketList';

const GameView = () => {
  const { store } = useAppContext();

  function gamePage() {
    return (
      <div className={`global-margin-top${store.user.isLogin ? '-logged' : ''}`}>
        <AppDrawer showCarousel={true} isMobile={false} isHomePage={true}>
          <GameWithMarketList isSingleMarket={true} />
        </AppDrawer>
      </div>
    );
  }

  function getBody() {
    return (
      <>
        <Layout />
        {gamePage()}
      </>
    );
  }

  return getBody();
};

export default GameView;
