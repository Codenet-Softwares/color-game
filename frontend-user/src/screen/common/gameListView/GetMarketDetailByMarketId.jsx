import React, { useEffect, useState } from "react";
import {
  userBidding,
  userWallet,
  user_getMarketWithRunnerData_api,
} from "../../../utils/apiService";
import { getMarketWithRunnerDataInitialState } from "../../../utils/getInitiateState";
import { useLocation } from "react-router-dom";
import biddingButton from "../../../utils/constant/biddingButton";
import { useAppContext } from "../../../contextApi/context";
import strings from "../../../utils/constant/stringConstant";
import { toast } from "react-toastify";
import CountdownTimer from "../../../globlaCommon/CountdownTimer";
import AppDrawer from "../appDrawer";
import Layout from "../../layout/layout";
import moment from "moment";
import updateMarketEventEmitter from "../updateMarketEvent";
import updateLotteryMarketEventEmitter from "../updateLotteryMarketEventEmitter";

const GetMarketDetailByMarketId = () => {
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
  const marketIdFromUrl = useLocation().pathname.split("/")[4];

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

  // color game cron ......
  useEffect(() => {
    console.log("[SSE] Connecting to market updates...");

    const eventSource = updateMarketEventEmitter();

    eventSource.onmessage = function (event) {
      const updates = JSON.parse(event.data);
      console.log("[SSE] Update received:", updates);

      if (updates?.length) {
        updates.forEach((market) => {
          if (market.isActive) {
            console.log(`[SSE] Market Active: ${market.marketName}`);
            setIsActive(true);
            toast.success(`${market.marketName} is now Active`);
          } else {
            console.log(`[SSE] Market Suspended: ${market.marketName}`);
            setIsActive(false);
            toast.info(`${market.marketName} has been Suspended`);
          }
        });
      }
    };

    eventSource.onerror = (err) => {
      console.error("[SSE] Connection error:", err);
      eventSource.close();
    };

    return () => {
      console.log("[SSE] Cleaning up EventSource...");
      eventSource.close();
    };
  }, []);

  // lottery cron ......

  // useEffect(() => {
  //   console.log("[SSE] Connecting to market updates... lottery");

  //   const eventSource = updateLotteryMarketEventEmitter();
  //   console.log("eventSource", eventSource)
  //   eventSource.onmessage = function (event) {
  //     const updates = JSON.parse(event.data);
  //     console.log("[SSE] lottery Update received:", updates);

  //     if (updates?.length) {
  //       updates.forEach((market) => {
  //         if (market.isActive) {
  //           console.log(`[SSE] lottery Market Active: ${market.marketName}`);
  //           setIsActive(true);
  //           toast.success(`${market.marketName} is now Active`);
  //         } else {
  //           console.log(`[SSE] lottery Market Suspended: ${market.marketName}`);
  //           setIsActive(false);
  //           toast.info(`${market.marketName} has been Suspended`);
  //         }
  //       });
  //     }
  //   };

  //   eventSource.onerror = (err) => {
  //     console.error("[SSE] Connection error:", err);
  //     eventSource.close();
  //   };

  //   return () => {
  //     console.log("[SSE] Cleaning up EventSource...");
  //     eventSource.close();
  //   };
  // }, []);

  useEffect(() => {
    user_getMarketsWithRunnerData();
  }, [marketIdFromUrl]);

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
  return (
    <>
      <Layout />
      <div
        className={`global-margin-top${store.user.isLogin ? "-logged" : ""}`}
      >
        <AppDrawer showCarousel={true} isMobile={false} isHomePage={true}>
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
                  className="fw-bold fs-3 text-danger"
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
                                    <span
                                      className="text-success fw-bold a"
                                      mx-2
                                    >
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
                                    <span
                                      className="text-success fw-bold d"
                                      mx-2
                                    >
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
                        <div className="row py-1 px-0 m-0">
                          {handleBidding()}
                        </div>
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
        </AppDrawer>
      </div>
    </>
  );
};

export default GetMarketDetailByMarketId;
