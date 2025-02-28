import React, { useState, useEffect } from "react";
import moment from "moment";
import "./CountdownTimerLotto.css";
const CountdownTimerLotto = ({ endDate, fontSize, onExpire }) => {
      const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));
        useEffect(() => {
          const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft(endDate));
          }, 1000);
          return () => clearInterval(interval);
        }, [endDate, onExpire]);
      
        const { days, hours, minutes, seconds } = timeLeft;
  return (
    <div className="countdown-container bg-dark mb-3 ">
    <span className="countdown-timer-lotto-cuxtomx__time  ">{days}</span>
    <span className="countdown-timer-lotto-cuxtomx__label fw-semibold text-danger">Days</span>

    <span className="countdown-timer-lotto-cuxtomx__colon  ">:</span>

    <span className="countdown-timer-lotto-cuxtomx__time">{hours}</span>
    <span className="countdown-timer-lotto-cuxtomx__label fw-semibold text-danger">Hrs</span>

    <span className="countdown-timer-lotto-cuxtomx__colon">:</span>

    <span className="countdown-timer-lotto-cuxtomx__time">{minutes}</span>
    <span className="countdown-timer-lotto-cuxtomx__label fw-semibold text-danger">Mins</span>

    <span className="countdown-timer-lotto-cuxtomx__colon">:</span>

    <span className="countdown-timer-lotto-cuxtomx__time">{seconds}</span>
    <span className="countdown-timer-lotto-cuxtomx__label fw-semibold text-danger">Secs</span>
  </div>
  )
}


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

export default CountdownTimerLotto