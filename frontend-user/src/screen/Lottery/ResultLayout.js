import React from 'react'
import AppDrawer from '../common/appDrawer';
import { useAppContext } from '../../contextApi/context';
// import LotteryResult from './LotteryResult';

import Layout from '../layout/layout';
import NewResult from './NewResult';

const ResultLayout = () => {

    const { store } = useAppContext();
 
    function WinningDeclare(){
        return (
            <div className={`global-margin-top${store.user.isLogin ? '-logged' : ''} `}>
        <AppDrawer showCarousel={false} isMobile={false} isHomePage={true}>
         {/* <LotteryResult/> */}
         <NewResult />
        </AppDrawer>
      </div>
          );


    }

    function getBody() {
        return (
          <>
            <Layout/>
            {WinningDeclare()}
          </>
        );
      }
 
      return getBody();
}

export default ResultLayout