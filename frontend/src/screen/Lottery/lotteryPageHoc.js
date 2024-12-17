

import React from 'react'
import { useParams } from 'react-router-dom';
import LotteryCards from './LotteryCards';
  
  const LotteryPageHoc = () => {
    const { marketId } = useParams();
    console.log("marketId" , marketId)
    return  <LotteryCards key={marketId}/>
  }
  
  export default LotteryPageHoc;
  