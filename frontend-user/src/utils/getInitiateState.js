export function getUserInitialState(body = {}) {
  return {
    accessToken: body.accessToken ?? "",
    isLogin: body.isLogin ?? false,
    userName: body.userName ?? "",
    email: body.email ?? "",
    userId: body.userId ?? "",
    wallet: {
      balance: body?.wallet?.balance ?? 0,
      exposure: body?.wallet?.exposure ?? 0,
      walletId: body?.wallet?.walletId ?? "",
      profit_loss: body.profit_loss ?? "",
      marketListExposure: body?.wallet?.marketListExposure ?? [],
    },
  };
}

export function getGameWithMarketDataInitialState(body = {}) {
  return {
    isBlink: false,
    gameId: "",
    gameName: "",
    Description: "",
    markets: [],
  };
}

export function getUserWalletInitialState(body = {}) {
  return {
    balance: body.balance ?? 0,
    exposure: body.exposure ?? 0,
    walletId: body.walletId ?? "",
  };
}

export function getMarketWithRunnerDataInitialState(body = {}) {
  return {
    marketId: "",
    marketName: "",
    participants: null,
    timeSpan: "",
    status: null,
    runners: [
      {
        runnerName: {
          runnerId: "",
          name: "",
        },
        rate: [
          {
            back: null,
            lay: null,
            _id: "",
          },
        ],
        _id: "",
      },
    ],
    _id: "",
  };
}

export function getAllGameDataInitialState(body = {}) {
  return [
    {
      gameId: "",
      gameName: "",
      Description: "",
      isBlink: false,
      _id: "",
      markets: [
        {
          marketId: "",
          marketName: "",
          participants: null,
          status: false,
          _id: "",
          runners: [
            {
              runnerName: {
                runnerId: "",
                name: "",
              },
              rate: [
                {
                  back: null,
                  lay: null,
                  _id: "",
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}

export function getUserPlaceBidding(body = {}) {
  return {
    gameId: body.gameId ?? "",
    marketId: body.marketId ?? "",
    runnerId: body.runnerId ?? "",
  };
}

export function getbiddingInitialState(body = {}) {
  return {
    rate: "",
    amount: "",
  };
}

export function getprofitLossDataState(body = {}) {
  return {
    dataGameWise: [],
    dataMarketWise: [],
    dataHistory: [],
    totalPages: 0,
    totalData: 0,
    currentPage: 1,
    itemPerPage: 10,
    endDate: "",
    startDate: "",
    searchItem: "",
    dataSource: "live",
    backupStartDate: null,
    backupEndDate: null,
  };
}

export function getprofitLossEventDataState(body = {}) {
  return {
    data: [],
    totalPages: 0,
    totalData: 0,
    currentPage: 1,
    itemPerPage: 10,
    searchItem: "",
  };
}

export function getprofitLossRunnerDataState(body = {}) {
  return {
    data: [],
    totalPages: 0,
    totalData: 0,
    currentPage: 1,
    itemPerPage: 10,
    searchItem: "",
  };
}
export function getAccountStatement(body = {}) {
  return {
    dataGameWise: [],
    dataMarketWise: [],
    dataHistory: [],
    totalPages: 0,
    totalData: 0,
    currentPage: 1,
    totalEntries: 10,
    endDate: "",
    startDate: "",
    searchItem: "",
    dataSource: "live",
  };
}

export function getUserBetHistory(body = {}) {
  return {
    data: [],
  };
}

export function getLotteryRange(body = {}) {
  return {
    group_start: null,
    group_end: null,
    series_start: "",
    series_end: "",
    number_start: "",
    number_end: "",
    isActive:null
  };
}

export function getprofitLossLotteryEventDataState(body = {}) {
  return {
    data: [],
    totalPages: 0,
    totalData: 0,
    currentPage: 1,
    itemPerPage: 10,
    searchItem: "",
  };
}

export function getUserLotteryBetHistory(body = {}) {
  return {
    data: [],
  };
}