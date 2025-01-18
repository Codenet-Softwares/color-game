const originalUrl = process.env.REACT_APP_API_LOTTERY_URL;
const newUrl = originalUrl.replace("/api", "");
const lotteryEventSource = new EventSource(`${newUrl}/lottery-events`);

const updateLotteryMarketEventEmitter = () => {
    console.log("updatemarketEventemitte......loytteryr");
    return lotteryEventSource;
    eventSource.onmessage = function (event) {
        return JSON.parse(event.data);
    };
    eventSource.onerror = (err) => {
        console.error("EventSource failed:", err);
        eventSource.close();
    };
};

export default updateLotteryMarketEventEmitter;
