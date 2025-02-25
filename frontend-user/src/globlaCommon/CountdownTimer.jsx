import React, { useState, useEffect } from "react";
import moment from "moment";

const CountdownTimer = ({ endDate, fontSize, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(endDate);
      setTimeLeft(calculateTimeLeft(endDate));
          // Check if the countdown has reached 00:00:00:00
          if (
            newTimeLeft.days === 0 &&
            newTimeLeft.hours === 0 &&
            newTimeLeft.minutes === 0 &&
            newTimeLeft.seconds === 0
          ) {
            clearInterval(interval);
            if (onExpire) {
              onExpire(); // Trigger data refetch
            }
          }
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate, onExpire]);

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div className="countdown-timer text-danger" style={{ fontSize: fontSize }}>
      <div className="d-flex fw-bold">
        <div>
          <div className="countdown-timer__item">
            <span className="countdown-timer__time">{days}</span>
            <span className="countdown-timer__label">Days : </span>
          </div>
        </div>
        <div>
          <div className="countdown-timer__item">
            <span className="countdown-timer__time">{hours}</span>
            <span className="countdown-timer__label">Hrs : </span>
          </div>
        </div>
        <div>
          <div className="countdown-timer__item">
            <span className="countdown-timer__time">{minutes}</span>
            <span className="countdown-timer__label">Mins : </span>
          </div>
        </div>
        <div>
          <div className="countdown-timer__item">
            <span className="countdown-timer__time">{seconds}</span>
            <span className="countdown-timer__label">Secs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const calculateTimeLeft = (endDate) => {
  const adjustedEndDate = moment
    .utc(endDate)
    .subtract(5, "hours")
    .subtract(30, "minutes");
  const now = moment(); // Current local time
  const differenceInMilliseconds = adjustedEndDate.diff(now);

  const difference = moment.duration(differenceInMilliseconds);
  let timeLeft = {};

  if (differenceInMilliseconds > 0) {
    timeLeft = {
      days: Math.floor(difference.asDays()),
      hours: difference.hours(),
      minutes: difference.minutes(),
      seconds: difference.seconds(),
    };
  } else {
    timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 }; // Handle expired case
  }

  return timeLeft;
};

export default CountdownTimer;