const originalUrl = process.env.REACT_APP_API_LOTTERY_URL;
const newUrl = originalUrl.replace("/api", "");
const lotteryEventSource = new EventSource(`${newUrl}/lottery-events`);

const updateLotteryMarketEventEmitter = () => {
    return lotteryEventSource;
   
};

export default updateLotteryMarketEventEmitter;
