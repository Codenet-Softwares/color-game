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
  // const gameIdFromUrl = useLocation()?.pathname?.split('-')[1]?.split('/')[1];

  console.log("data to send", gameIdFromUrl);

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
  }, [gameIdFromUrl]);

  function handleRefreshOrGetInitialData() {
    if (gameIdFromUrl) {
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
      marketId: gameIdFromUrl,
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
      marketId: gameIdFromUrl,
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


  function getMarketDetailByMarketId() {
    function convertUTCtoIST(utcDateString) {
      // Create a Date object from the UTC date string
      const utcDate = new Date(utcDateString);

      // Get the IST offset (UTC+5:30)
      const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds

      // Convert UTC to IST by adding the offset
      const istDate = new Date(utcDate.getTime() + istOffset);

      return istDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    }
    const handleBidding = () => {
      const nData = biddingButton.map((list) => (
        <div className={`${list.col} p-0`}>
          <button
            className={`btn btn-sm bg-white border border-2 rounded-3 col-11`}
            onClick={() => handleBiddingAmount("amount", parseInt(list.name))}
          >
            {list.name}
          </button>
        </div>
      ));

      return nData;
    };

    console.log("first", arr);

    return (
      <>
        {/* Background: Market Data and UI */}
        <div
          className={`row p-0 m-0 position-relative ${!isActive ? "" : ""}`}
          style={{ zIndex: 1 }} // Lower z-index for background content
        >
          {/* Foreground: SUSPENDED message */}
          {!isActive && (
            <div
              className="position-absolute  d-flex justify-content-center align-items-center"
              style={{
                zIndex: 10, // Ensure this is higher than the zIndex of other content
                backgroundColor: "rgba(0, 0, 0, 0.2)", // Optional: semi-transparent background
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
              }}
            >
              <h1
                className="fw-bold fs-3 text-white"
                style={{
                  zIndex: 11,
                  width: "100% ",
                  height: "100% ",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span>SUSPENDED</span>
              </h1>
            </div>
          )}
          <div
            className="col-12 p-1 mt-2"
            style={{ backgroundColor: "#a1aed4" }}
          >
            {user_marketWithRunnerData.marketName} |{" "}
            {console.log(
              "user_marketWithRunnerData",
              user_marketWithRunnerData
            )}
            {new Date(convertUTCtoIST(user_marketWithRunnerData.endTime)) <
            new Date() ? null : (
              <>
                <CountdownTimer endDate={user_marketWithRunnerData.endTime} />
              </>
            )}
          </div>
          <div className="row py-1 px-0 m-0 ">
            <div className="col-4"></div>
            <div
              className="col-4 rounded-top-3"
              style={{ backgroundColor: "lightblue" }}
            >
              Back
            </div>
            <div
              className="col-4 rounded-top-3"
              style={{ backgroundColor: "pink" }}
            >
              Lay
            </div>
          </div>

          {user_marketWithRunnerData &&
            user_marketWithRunnerData.runners.map((runnerData, index) => {
              // Determine if current row should display
              const shouldDisplayTempLay =
                toggle.mode === "lay" &&
                toggle.indexNo === runnerData.id &&
                (winBalance !== 0 ||
                  Number(runnerData.runnerName.bal) -
                    Math.round(Math.abs(winBalance)) !==
                    0);

              const shouldDisplayTempBack =
                toggle.mode === "back" &&
                toggle.indexNo === runnerData.id &&
                (winBalance !== 0 ||
                  Number(runnerData.runnerName.bal) -
                    Math.round(Math.abs(winBalance)) !==
                    0);
              return (
                <>
                  {toggle.mode === "lay" ? (
                    <>
                      {/* Lay */}
                      <div className="row py-1 px-0 m-0 border">
                        <span
                          className={`col-4 text-dark text-decoration-none text-nowrap`}
                        >
                          {runnerData.runnerName.name}{" "}
                          <span>
                            {/* Display bidding amount if conditions met */}
                            {shouldDisplayTempLay && (
                              <>
                                {Number(runnerData.runnerName.bal) === 0 &&
                                !bidding.amount ? (
                                  ""
                                ) : Number(runnerData.runnerName.bal) > 0 ? (
                                  <span className="text-success fw-bold a" mx-2>
                                    +{Number(runnerData.runnerName.bal)}
                                  </span>
                                ) : (
                                  <>
                                    {runnerData.runnerName.bal != 0 && (
                                      <span
                                        className="text-danger fw-bold a"
                                        mx-2
                                      >
                                        {Number(runnerData.runnerName.bal)}
                                      </span>
                                    )}
                                  </>
                                )}

                                {Number(runnerData.runnerName.bal) -
                                  Math.round(Math.abs(winBalance)) >
                                0 ? (
                                  <span className=" text-success fw-bold b">
                                    {bidding.amount != 0 && (
                                      <span>
                                        (
                                        {Number(runnerData.runnerName.bal) -
                                          Math.round(Math.abs(winBalance))}
                                        ){" "}
                                      </span>
                                    )}
                                  </span>
                                ) : (
                                  <span className=" text-danger fw-bold b">
                                    {bidding.amount != 0 && (
                                      <span>
                                        (
                                        {Number(runnerData.runnerName.bal) -
                                          Math.round(Math.abs(winBalance))}
                                        )
                                      </span>
                                    )}
                                  </span>
                                )}
                              </>
                            )}
                          </span>
                          {/* Display hiii only if shouldDisplayTempLay flag is false */}
                          {!shouldDisplayTempLay && (
                            <>
                              {Number(runnerData.runnerName.bal) === 0 &&
                              !bidding.amount ? (
                                ""
                              ) : Number(runnerData.runnerName.bal) > 0 ? (
                                <span className="text-success fw-bold c" mx-2>
                                  {bidding.amount != 0 &&
                                    runnerData.runnerName.bal}
                                  (
                                  {Number(runnerData.runnerName.bal) +
                                    Math.round(bidding.amount)}
                                  ){" "}
                                </span>
                              ) : (
                                <span className="text-danger fw-bold c" mx-2>
                                  {runnerData.runnerName.bal != 0 &&
                                    bidding.amount != 0 &&
                                    runnerData.runnerName.bal}

                                  <span className="text-success d fw-bold">
                                    (
                                    {Number(runnerData.runnerName.bal) +
                                      Math.round(bidding.amount)}
                                    )
                                  </span>
                                </span>
                              )}
                            </>
                          )}
                        </span>

                        <div
                          className="col-4"
                          style={{ backgroundColor: "lightblue" }}
                          onClick={() =>
                            handleToggle(
                              runnerData.id,
                              runnerData.rate[0].back,
                              "back",
                              runnerData.runnerName.runnerId
                            )
                          }
                          key={index}
                        >
                          {runnerData.rate[0].back}
                        </div>

                        <div
                          className="col-4"
                          style={{ backgroundColor: "pink" }}
                          onClick={() =>
                            handleToggle(
                              runnerData.id,
                              runnerData.rate[0].lay,
                              "lay",
                              runnerData.runnerName.runnerId
                            )
                          }
                          key={index}
                        >
                          {runnerData.rate[0].lay}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Back */}
                      <div className="row py-1 px-0 m-0 border">
                        <span
                          className={`col-4 text-dark text-decoration-none text-nowrap`}
                        >
                          {runnerData.runnerName.name}
                          <span>
                            {/* Display bidding amount if conditions met */}
                            {shouldDisplayTempBack && (
                              <>
                                {Number(runnerData.runnerName.bal) &&
                                !bidding.amount ? (
                                  ""
                                ) : Number(runnerData.runnerName.bal) > 0 ? (
                                  <span className="text-success fw-bold d" mx-2>
                                    +{Number(runnerData.runnerName.bal)}
                                  </span>
                                ) : (
                                  <>
                                    {runnerData.runnerName.bal != 0 && (
                                      <span
                                        className="text-danger fw-bold d"
                                        mx-2
                                      >
                                        {Number(runnerData.runnerName.bal)}
                                      </span>
                                    )}
                                  </>
                                )}

                                {Number(runnerData.runnerName.bal) +
                                  Math.round(Math.abs(winBalance)) >
                                0 ? (
                                  <span className=" text-success  fw-bold">
                                    {bidding.amount != 0 && (
                                      <span>
                                        (
                                        {Number(runnerData.runnerName.bal) +
                                          Math.round(Math.abs(winBalance))}
                                        )
                                      </span>
                                    )}
                                  </span>
                                ) : (
                                  <span className=" text-danger fw-bold e">
                                    {bidding.amount != 0 && (
                                      <span>
                                        (
                                        {Number(runnerData.runnerName.bal) +
                                          Math.round(Math.abs(winBalance))}
                                        )
                                      </span>
                                    )}
                                  </span>
                                )}
                              </>
                            )}
                          </span>
                          {/* Display hiii only if shouldDisplayTempLay flag is false */}
                          {!shouldDisplayTempBack && (
                            <>
                              {Number(runnerData.runnerName.bal) === 0 &&
                              !bidding.amount ? (
                                ""
                              ) : Number(runnerData.runnerName.bal) > 0 ? (
                                <span className="text-success  fw-bold" mx-2>
                                  {bidding.amount != 0 &&
                                    runnerData.runnerName.bal}
                                  <span
                                    className={`3 text-${
                                      Number(runnerData.runnerName.bal) -
                                        Math.round(bidding.amount) >
                                      0
                                        ? "success"
                                        : "danger"
                                    } fw-bold`}
                                  >
                                    (
                                    {Number(runnerData.runnerName.bal) -
                                      Math.round(bidding.amount)}
                                    )
                                  </span>
                                </span>
                              ) : (
                                <span className="text-danger fw-bold f" mx-2>
                                  {runnerData.runnerName.bal != 0 &&
                                    bidding.amount != 0 &&
                                    runnerData.runnerName.bal}
                                  (
                                  {Number(runnerData.runnerName.bal) -
                                    Math.round(bidding.amount)}
                                  )
                                </span>
                              )}
                            </>
                          )}
                        </span>

                        <div
                          className="col-4"
                          style={{ backgroundColor: "lightblue" }}
                          onClick={() =>
                            handleToggle(
                              runnerData.id,
                              runnerData.rate[0].back,
                              "back",
                              runnerData.runnerName.runnerId
                            )
                          }
                          key={index}
                        >
                          {console.log("ASDF", runnerData)}
                          {runnerData.rate[0].back}
                        </div>

                        <div
                          className="col-4"
                          style={{ backgroundColor: "pink" }}
                          onClick={() =>
                            handleToggle(
                              runnerData.id,
                              runnerData.rate[0].lay,
                              "lay",
                              runnerData.runnerName.runnerId
                            )
                          }
                          key={index}
                        >
                          {runnerData.rate[0].lay}
                        </div>
                      </div>
                    </>
                  )}

                  {toggle.indexNo === runnerData.id && !toggle.toggleOpen && (
                    <div
                      style={{
                        background: `${
                          toggle.mode === "lay" ? "#f1e0e3" : "#c6e7ee"
                        }`,
                      }}
                    >
                      <div className="row py-1 px-0 m-0">
                        <div className="d-none d-sm-block d-md-block d-lg-block d-xl-block col-sm-2 col-md-2 col-lg-2 col-xl-2">
                          <button
                            className=" btn btn-sm bg-white border border-2 rounded-3"
                            onClick={() => handleCancel()}
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="col-6 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                          <button
                            className="col-3 rounded-start-4"
                            style={{ width: "18%", border: "0" }}
                          >
                            -
                          </button>
                          <input
                            className="col-6 "
                            type="number"
                            value={bidding.rate}
                          />
                          <button
                            className="col-3 rounded-end-3"
                            style={{ width: "18%", border: "0" }}
                          >
                            +
                          </button>
                        </div>
                        <div className="col-6 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                          <button
                            disabled={bidding.amount == 0 ? " disabled" : ""}
                            className={`col-3  rounded-start-3 `}
                            style={{ width: "18%", border: "0" }}
                            onClick={
                              bidding.amount >= 100
                                ? () =>
                                    handleBiddingAmount(
                                      "amount",
                                      Number(bidding.amount) - 100
                                    )
                                : () =>
                                    handleBiddingAmount(
                                      "amount",
                                      Number(bidding.amount) -
                                        Number(bidding.amount)
                                    )
                            }
                          >
                            -
                          </button>
                          <input
                            className="col-6"
                            type="number"
                            value={bidding.amount}
                            onChange={(e) =>
                              handleBiddingAmount("amount", e.target.value)
                            }
                          />
                          <button
                            className="col-3 rounded-end-3"
                            style={{ width: "18%", border: "0" }}
                            onClick={() =>
                              handleBiddingAmount(
                                "amount",
                                Number(bidding.amount) + 100
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                        <div className="d-none d-sm-block d-md-block d-lg-block d-xl-block col-sm-2 col-md-2 col-lg-2 col-xl-2">
                          <button
                            className="btn btn-sm bg-white border border-2 rounded-3"
                            onClick={() =>
                              handleUserBidding(
                                index,
                                bidding.amount,
                                toggle.mode
                              )
                            }
                          >
                            Place Bet
                          </button>
                        </div>
                      </div>
                      <div className="row py-1 px-0 m-0">{handleBidding()}</div>
                      <div className="row py-1 px-0 m-0">
                        <div className="d-block col-6 d-sm-none d-md-none d-lg-none d-xl-none">
                          <button
                            className=" btn btn-sm bg-white border border-2 rounded-3 col-12"
                            onClick={() => handleCancel()}
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="d-block col-6 d-sm-none d-md-none d-lg-none d-xl-none">
                          <button
                            className="btn btn-sm bg-white border border-2 rounded-3 col-12"
                            onClick={() =>
                              handleUserBidding(
                                index,
                                bidding.amount,
                                toggle.mode
                              )
                            }
                          >
                            Place Bet
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })}
        </div>
      </>
    );
  }

  function getSingleMarket() {
    return (
      <div className="row p-0 m-0">
        <div className="col-12 p-1 mt-2" style={{ backgroundColor: "#a1aed4" }}>
          {user_gameWithMarketData.gameName}
        </div>
        {user_gameWithMarketData &&
          user_gameWithMarketData.markets.map((marketData) => {
            return (
              <div className="row py-1 px-0 m-0 border">
                <a
                  className={`col-4 text-dark text-decoration-none text-nowrap`}
                  href={`/gameView/${user_gameWithMarketData?.gameName?.replace(
                    /\s/g,
                    ""
                  )}-${marketData?.marketName?.replace(/\s/g, "")}/${
                    marketData?.marketId
                  }`}
                  onClick={() => handleMarketId(marketData?.marketId)}
                >
                  <span>{marketData.timeSpan}</span> |{" "}
                  <span> {marketData.marketName}</span>
                </a>

                <div className="col-8" style={{ backgroundColor: "orange" }}>
                  col-8
                </div>
              </div>
            );
          })}
      </div>
    );
  }

  function getWholeMarket() {
    return (
      <div className="row p-0 m-0">
        {user_allGamesWithMarketData &&
          user_allGamesWithMarketData.slice(0, 3).map((gameWithMarketData) => {
            return (
              <>
                <div
                  className="col-12 p-1 mt-2"
                  style={{ backgroundColor: "#a1aed4" }}
                >
                  {gameWithMarketData.gameName}
                </div>
                {gameWithMarketData &&
                  gameWithMarketData.markets.slice(0, 2).map((marketData) => {
                    return (
                      <div
                        className="row p-0 m-0"
                        style={{ backgroundColor: "white" }}
                      >
                        <div className="row py-1 px-0 m-0 ">
                          {/* Runner Name and Balance */}
                          <span className="col-4 text-dark text-decoration-none text-nowrap">
                            {marketData?.marketName}
                          </span>

                          {/* Back and Lay Rates */}
                          <div
                            className="col-4"
                            style={{ backgroundColor: "lightblue" }}
                          >
                            {marketData?.runners[0]?.rate[0]?.back ?? "N/A"}
                          </div>

                          <div
                            className="col-4"
                            style={{ backgroundColor: "pink" }}
                          >
                            {marketData?.runners[0]?.rate[0]?.lay ?? "N/A"}
                          </div>
                        </div>
                        {/* );
                            }
                          )} */}
                      </div>
                    );
                  })}
                {gameWithMarketData.markets.length > 0 ? (
                  <a
                    className={`col-12 text-dark text-decoration-none text-nowrap`}
                    href={`/gameView/${gameWithMarketData?.gameName?.replace(
                      /\s/g,
                      ""
                    )}/${gameWithMarketData?.gameId}`}
                    style={{ textAlign: "right" }}
                    onClick={() => handleGameId(gameWithMarketData?.gameId)}
                  >
                    View more
                  </a>
                ) : (
                  <p
                    className="text-center pt-1"
                    style={{ backgroundColor: "orange" }}
                  >
                    No market
                  </p>
                )}
              </>
            );
          })}
      </div>
    );
  }

  function getBody() {
    return (
      <>
        {gameIdFromUrl
          ? getMarketDetailByMarketId()
          : isSingleMarket
          ? getSingleMarket()
          : getWholeMarket()}
        <Login showLogin={loginModal} setShowLogin={setLoginModal} />
      </>
    );
  }

  return getBody();
}

export default GameWithMarketList;
