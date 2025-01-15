import React, { useState, useEffect } from "react";
import moment from "moment";

const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);
    return () => clearTimeout(timer);
  }, [endDate]);

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div className="countdown-timer text-danger" style={{ fontSize: "12px" }}>
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
  // Subtract 5 hours and 30 minutes from the endDate
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
