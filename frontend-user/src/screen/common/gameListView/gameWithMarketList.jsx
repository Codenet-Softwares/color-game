import { useEffect, useState } from "react";
import "../common.css";
import {
  userBidding,
  userWallet,
  user_getAllGamesWithMarketData_api,
  user_getGameWithMarketData_api,
  user_getMarketWithRunnerData_api,
} from "../../../utils/apiService";
import {
  getGameWithMarketDataInitialState,
  getMarketWithRunnerDataInitialState,
} from "../../../utils/getInitiateState";
import { useLocation } from "react-router-dom";
import biddingButton from "../../../utils/constant/biddingButton";
import { useAppContext } from "../../../contextApi/context";
import strings from "../../../utils/constant/stringConstant";
import { toast } from "react-toastify";
import Login from "../../loginModal/loginModal";
import CountdownTimer from "../../../globlaCommon/CountdownTimer";
import updateMarketEventEmitter from "../updateMarketEvent";
function GameWithMarketList({ isSingleMarket }) {
  const [user_allGamesWithMarketData, setUser_allGamesWithMarketData] =
    useState([]);
  const [user_gameWithMarketData, setUser_gameWithMarketData] = useState(
    getGameWithMarketDataInitialState()
  );
  const [user_marketWithRunnerData, setUser_marketWithRunnerData] = useState(
    getMarketWithRunnerDataInitialState()
  );
  const [preExposure, setPreExposure] = useState(0);
  const [newToBeDecided, setNewToBeDecided] = useState(0);
  const [exposureAndWallet, setExposureAndWallet] = useState({
    exposure: null,
    wallet: null,
  });

  const { store, dispatch } = useAppContext();
  console.log("store", store);
  const [gameId, setGameId] = useState("");
  const [bidding, setBidding] = useState({ rate: "", amount: 0 });
  const [loginModal, setLoginModal] = useState(false);
  const [toggle, setToggle] = useState({
    toggleOpen: false,
    indexNo: "",
    mode: "",
    stateindex: 0,
    runnerName: "",
  });
  const arr = [];
  const arr1 = [];
  const [isActive, setIsActive] = useState(true);

  const gameIdFromUrl = useLocation().pathname.split("/")[3];
  const marketIdFromUrl = useLocation().pathname.split("/")[4];

  // const gameIdFromUrl = useLocation()?.pathname?.split('-')[1]?.split('/')[1];

  console.log("data to send", gameIdFromUrl, marketIdFromUrl);

  useEffect(() => {
    if (user_marketWithRunnerData?.runners?.length) {
      for (let i = 0; i < user_marketWithRunnerData.runners.length; i++) {
        arr.push(user_marketWithRunnerData.runners[i].runnerName.bal);
      }
    }
  }, [bidding.amount]);

  useEffect(() => {
    let currentExposure = null;
    store.user.wallet?.marketListExposure.forEach((entry) => {
      currentExposure += Object.values(entry)[0];
    });

    setExposureAndWallet({
      ...exposureAndWallet,
      exposure: currentExposure,
    });
  }, [store.user.wallet?.marketListExposure]);

  console.log("Arr=>>>>", arr);
  // console.log('Store=>>>', prevExposureForCurrentMarket);
  console.log("exposureAndWallet=>>>", exposureAndWallet);
  useEffect(() => {
    handleRefreshOrGetInitialData();
  }, [gameIdFromUrl, marketIdFromUrl]);

  function handleRefreshOrGetInitialData() {
    if (marketIdFromUrl) {
      user_getMarketsWithRunnerData();
    } else if (isSingleMarket) {
      user_getGameWithMarketData();
    } else {
      user_getAllGamesWithMarketData();
    }
  }

  //SSE EVENT
  useEffect(() => {
    const eventSource = updateMarketEventEmitter();
    eventSource.onmessage = function (event) {
      const update = JSON.parse(event.data);
      if (update?.length) {
        setIsActive(false);
        update?.forEach((market) => {
          toast.info(`${market.marketName} has been Suspended`);
        });
      }
    };
    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };
  }, []);

  const handleBiddingAmount = (name, value) => {
    setBidding((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleToggle = (runnerid, rate, value, id) => {
    if (toggle.toggleOpen || toggle.indexNo !== runnerid) {
      setToggle({
        toggleOpen: false,
        indexNo: runnerid,
        mode: value,
      });
      handleBiddingAmount("rate", rate);

      handleRunnerId(id);
    } else if (toggle.indexNo === runnerid && toggle.mode !== value) {
      setToggle({
        toggleOpen: false,
        indexNo: runnerid,
        mode: value,
      });

      handleBiddingAmount("rate", rate);

      handleRunnerId(id);
    } else if (toggle.indexNo === runnerid && toggle.mode === value) {
      setToggle({
        toggleOpen: true,
        indexNo: runnerid,
        mode: value,
      });

      handleBiddingAmount("rate", rate);

      handleRunnerId(id);
    } else {
      setToggle({
        toggleOpen: true,
        indexNo: runnerid,
        mode: value,
      });

      handleBiddingAmount("rate", rate);

      handleRunnerId(id);
    }
  };

  const handleCancel = () => {
    handleBiddingAmount("rate", "");
    handleBiddingAmount("amount", 0);
    setToggle({ toggleOpen: true });
  };

  const handleGameId = (id) => {
    dispatch({
      type: strings.placeBidding,
      payload: { gameId: id },
    });
  };

  const handleRunnerId = (id) => {
    dispatch({
      type: strings.placeBidding,
      payload: { runnerId: id },
    });
  };

  const handleMarketId = (id) => {
    dispatch({
      type: strings.placeBidding,
      payload: { marketId: id },
    });
  };

  // const Number(runnerData.runnerName.bal) = 0;
  // const Number(runnerData.runnerName.bal)RunnerBlue = 100;
  // const Number(runnerData.runnerName.bal)Runner2 = 100;

  function getMaxNegativeBalance(runners) {
    let maxNegativeRunner = 0;

    // Iterate through the runners
    runners.forEach((runner) => {
      if (Number(runner.runnerName.bal) < maxNegativeRunner) {
        maxNegativeRunner = Number(runner.runnerName.bal);
      }
    });
    return maxNegativeRunner;
  }

  function lowestNegativeNumber(arr) {
    let lowestNegative = Number.POSITIVE_INFINITY;
    let foundNegative = false;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] < 0 && arr[i] < lowestNegative) {
        lowestNegative = arr[i];
        foundNegative = true;
      }
    }

    return foundNegative ? lowestNegative : 0;
  }

  const winBalance =
    bidding.amount *
    (Number(bidding.rate) === 0
      ? Number(bidding.rate)
      : Number(bidding.rate) - 1);

  // Rerender When IsActive will get False
  useEffect(() => {
    user_getMarketsWithRunnerData();
  }, [isActive]);

  async function user_getMarketsWithRunnerData() {
    dispatch({
      type: strings.isLoading,
      payload: true,
    });
    const response = await user_getMarketWithRunnerData_api({
      marketId: marketIdFromUrl,
      userId: store?.user?.userId,
    });
    dispatch({
      type: strings.isLoading,
      payload: false,
    });
    if (response) {
      console.log("problem res", response);
      const preMaxExposure = getMaxNegativeBalance(response.data.runners);
      setPreExposure(preMaxExposure);
      setUser_marketWithRunnerData(response.data);
      setIsActive(response.data.isActive);
    }
  }

  async function user_getAllGamesWithMarketData() {
    const response = await user_getAllGamesWithMarketData_api();
    if (response) {
      setUser_allGamesWithMarketData(response.data);
    }
  }

  async function user_getGameWithMarketData() {
    const response = await user_getGameWithMarketData_api({
      gameId: gameIdFromUrl,
    });
    if (response) {
      setUser_gameWithMarketData(response.data);
    }
  }

  const handleUserBidding = async (index, amount, mode) => {
    console.log("12345", index, amount, mode);
    let difference = 0;
    let bal = 0;

    for (let i = 0; i < arr.length; i++) {
      if (mode === "back") {
        if (index === i) {
          arr[i] = arr[i] + winBalance;
        } else {
          arr[i] = arr[i] - amount;
        }
      } else {
        if (index === i) {
          arr[i] = arr[i] - winBalance;
        } else {
          arr[i] = arr[i] + amount;
        }
      }
    }

    const highestNegetive = lowestNegativeNumber(arr);

    if (Math.abs(preExposure) >= Math.abs(highestNegetive)) {
      difference = Math.abs(preExposure) - Math.abs(highestNegetive);
      bal = store.user.wallet.balance + difference;
    } else {
      difference = Math.abs(highestNegetive) - Math.abs(preExposure);
      bal = store.user.wallet.balance - difference;
    }

    if (!store.user.isLogin) {
      setLoginModal(true);
      return;
    }

    // Amount validation with minimum bet condition
    if (
      bidding.amount == 0 ||
      bidding.amount < 0 ||
      bidding.amount === "" ||
      bidding.amount < 100
    ) {
      if (bidding.amount === 0) {
        toast.error("Amount cannot be zero");
        return;
      } else if (bidding.amount < 0) {
        toast.error("Amount should be a positive value.");
        return;
      } else if (bidding.amount === "") {
        toast.error("Amount cannot be empty.");
        return;
      } else if (bidding.amount < 100) {
        toast.error("Minimum Amount for Bet should be 100.");
        return;
      }
    }

    if (
      (bidding.amount > store.user?.wallet?.balance &&
        !(toggle.mode === "lay")) ||
      ((Number(bidding.rate) - 1) * bidding.amount >
        store.user?.wallet?.balance &&
        !(toggle.mode === "back"))
    ) {
      toast.error("Insufficient amount.");
      return;
    }

    let marketListExposureUpdated = [];
    if (
      store.user.wallet?.marketListExposure &&
      store.user.wallet?.marketListExposure.length > 0
    ) {
      marketListExposureUpdated = [...store.user.wallet?.marketListExposure];
    }

    let currentMarketExposure = {
      [store.placeBidding.marketId]: Math.abs(highestNegetive),
    };

    if (marketListExposureUpdated?.length === 0) {
      marketListExposureUpdated.push(currentMarketExposure);
    } else {
      let flag = true;
      marketListExposureUpdated.forEach((entry) => {
        if (entry[store.placeBidding.marketId]) {
          entry[store.placeBidding.marketId] = Math.abs(highestNegetive);
          flag = false;
        }
      });

      if (flag) {
        marketListExposureUpdated.push(currentMarketExposure);
      }
    }

    const values = {
      userId: store.user.userId,
      gameId: store.placeBidding.gameId,
      marketId: store.placeBidding.marketId,
      runnerId: store.placeBidding.runnerId,
      value: bidding.amount,
      bidType: toggle.mode,
      exposure: Math.abs(highestNegetive),
      wallet: bal,
      marketListExposure: marketListExposureUpdated ?? [],
    };

    dispatch({
      type: strings.isLoading,
      payload: true,
    });

    const response = await userBidding(values, true);

    dispatch({
      type: strings.isLoading,
      payload: false,
    });

    if (response) {
      (async () => {
        dispatch({
          type: strings.isLoading,
          payload: true,
        });
        const response = await userWallet(store.user.userId, true, dispatch);
        dispatch({
          type: strings.isLoading,
          payload: false,
        });
        if (response) {
          dispatch({
            type: strings.UserWallet,
            payload: {
              ...response.data,
            },
          });
          toast.info(`Wallet updated: ${response.message}`);
        } else {
          toast.error(`Wallet update failed: ${response.message}`);
        }
      })();
    }

    handleCancel();
    handleRefreshOrGetInitialData();
  };

  

  

  function getBody() {
    return (
      <>
        {marketIdFromUrl
          ? getMarketDetailByMarketId()
          : marketIdFromUrl
          ? getSingleMarket()
          : getWholeMarket()}
        <Login showLogin={loginModal} setShowLogin={setLoginModal} />
      </>
    );
  }

  return getBody();
}

export default GameWithMarketList;
