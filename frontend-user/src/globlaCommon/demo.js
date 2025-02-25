useEffect(() => {
  const eventSource = updateLotteryMarketEventEmitter();
  eventSource.onmessage = function (event) {
    const updates = JSON.parse(event.data);

    if (updates?.length) {
      updates.forEach((market) => {
        setLotteryData((prevData) => ({
          ...prevData,
          isSuspend: !market.isActive, // Update isSuspend dynamically
        }));

        if (market.isActive) {
          toast.success(`${market.marketName} is now Active`);
        } else {
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
    eventSource.close();
  };
}, []);
