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
    const [isActive, setIsActive] = useState();
    const arr = [];
    const arr1 = [];

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

    console.log("=>>>", isActive);

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
        console.log("New Array", arr);
        const highestNegetive = lowestNegativeNumber(arr);

        console.log("Negetive", highestNegetive);

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
        if (bidding.amount == 0 || bidding.amount < 0 || bidding.amount == "") {
            if (bidding.amount == 0) {
                toast.error("Amount can not be zero");
                return;
            }
            toast.error("Amount fields cannot be empty.");
            return;
        }

        if (
            (bidding.amount > store.user?.wallet?.balance &&
                !(toggle.mode === "lay")) ||
            ((Number(bidding.rate) - 1) * bidding.amount >
                store.user?.wallet?.balance &&
                !(toggle.mode === "back"))
        ) {
            toast.error("insufficient amount.");
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
                    toast.info(`wallet updated ${response.message}`);
                } else {
                    toast.error(`wallet updated ${response.message}`);
                }
            })();
        }
        handleCancel();
        handleRefreshOrGetInitialData();
    };

    function getMarketDetailByMarketId() {
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
                {/* Foreground: SUSPENDED message */}
                {!isActive && (
                    <div
                        className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
                        style={{
                            zIndex: 10, // Ensure this is higher than the zIndex of other content
                            backgroundColor: "rgba(255, 255, 255, 0.9)", // Optional: semi-transparent background
                            top: 0,
                            left: 0,
                        }}
                    >
                        <h1
                            className="fw-bold fs-1 text-danger mb-5"
                            style={{ zIndex: 11 }}
                        >
                            SUSPENDED
                        </h1>
                    </div>
                )}

                {/* Background: Market Data and UI */}
                <div
                    className={`row p-0 m-0 position-relative ${!isActive ? "opacity-50" : ""
                        }`}
                    style={{ zIndex: 1 }} // Lower z-index for background content
                >
                    <div
                        className="col-12 p-1 mt-2"
                        style={{ backgroundColor: "#a1aed4" }}
                    >
                        {user_marketWithRunnerData.marketName} |{" "}
                        <span className="text-end">
                            {new Date("2024-08-13T08:00:00.000Z") < new Date() ? null : (
                                <>
                                    <CountdownTimer endDate={"2024-08-13T08:00:00.000Z"} />
                                </>
                            )}
                        </span>
                        {user_marketWithRunnerData.timeSpan}
                    </div>

                    <div className="row py-1 px-0 m-0">
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
                                                                        className={`3 text-${Number(runnerData.runnerName.bal) -
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
                                    )}-${marketData?.marketName?.replace(/\s/g, "")}/${marketData?.marketId
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
                    user_allGamesWithMarketData.map((gameWithMarketData) => {
                        return (
                            <>
                                <div
                                    className="col-12 p-1 mt-2"
                                    style={{ backgroundColor: "#a1aed4" }}
                                >
                                    {gameWithMarketData.gameName}
                                </div>
                                {gameWithMarketData &&
                                    gameWithMarketData.markets.map((marketData) => {
                                        return (
                                            <div className="row py-1 px-0 m-0 border">
                                                <div className="col-4">
                                                    <span>{marketData.timeSpan}</span> |{" "}
                                                    <span> {marketData.marketName}</span>
                                                </div>
                                                <div
                                                    className="col-8"
                                                    style={{ backgroundColor: "orange" }}
                                                >
                                                    col-8
                                                </div>
                                            </div>
                                        );
                                    })}
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
