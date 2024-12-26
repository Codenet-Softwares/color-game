import React, { useState, useEffect } from "react";

const CountDownTimerLottery = ({ endDateTime }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date(); // Current local time
      const endDate = new Date(endDateTime); // UTC date
      const difference = endDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer); // Clean up the interval on component unmount
  }, [endDateTime]);

  return (
    <div>
      <h2 className="fw-bold" style={{ color: "red" }}>
        Time Left:
      </h2>
      <p>
        {timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.minutes}{" "}
        minutes, {timeLeft.seconds} seconds
      </p>
    </div>
  );
};

export default CountDownTimerLottery;
