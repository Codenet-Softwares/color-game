
const lotteryEventSource = new EventSource("http://localhost:8080/lottery-events");

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
