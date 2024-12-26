const eventSource = new EventSource("http://localhost:7000/events");

const updateMarketEventEmitter = () => {
    console.log("updatemarketEventemitter");
    return eventSource;
  eventSource.onmessage = function (event) {
    return JSON.parse(event.data);
  };
  eventSource.onerror = (err) => {
    console.error("EventSource failed:", err);
    eventSource.close();
  };
};
export default updateMarketEventEmitter;
