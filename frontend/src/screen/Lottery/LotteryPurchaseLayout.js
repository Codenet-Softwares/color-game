import React from 'react'
import { useAppContext } from '../../contextApi/context'
import LotteryPurchaseHistory from './LotteryPurchaseHistory';
import Layout from '../layout/layout';
import AppDrawer from '../common/appDrawer';
import { useParams } from 'react-router-dom';



const LotteryPurchaseLayout = () => {
    const { store } = useAppContext();
    const { marketId } = useParams()

   
 
    function ticketHistory(){
        return (
            <div className={`global-margin-top${store.user.isLogin ? '-logged' : ''} `}>
        <AppDrawer showCarousel={false} isMobile={false} isHomePage={true}>
         <LotteryPurchaseHistory MarketId = {marketId }/>
        </AppDrawer>
      </div>
          );


    }

    function getBody() {
        return (
          <>
            <Layout/>
            {ticketHistory()}
          </>
        );
      }

      return getBody();

  
}

export default LotteryPurchaseLayout