import React, { useState, useEffect } from "react";
import moment from "moment";

const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);
    return () => clearTimeout(timer);
  });

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div className={`countdown-timer text-danger`} style={{ fontSize: "12px" }}>
      <div className=" d-flex fw-bold ">
        <div className="">
          <div className="countdown-timer__item">
            <span className="countdown-timer__time">{days}</span>
            <span className="countdown-timer__label">Days : </span>
          </div>
        </div>
        <div className="">
          <div className="countdown-timer__item">
            <span className="countdown-timer__time ">{hours}</span>
            <span className="countdown-timer__label ">Hrs : </span>
          </div>
        </div>
        <div className="">
          <div className="countdown-timer__item">
            <span className="countdown-timer__time">{minutes} </span>
            <span className="countdown-timer__label">Mins : </span>
          </div>
        </div>
        <div className="">
          <div className="countdown-timer__item">
            <span className="countdown-timer__time"> {seconds}</span>
            <span className="countdown-timer__label">Secs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const calculateTimeLeft = (endDate) => {
  const differenceInMilliseconds = moment.utc(endDate).diff(moment.utc());
  const difference = moment.duration(differenceInMilliseconds);
  let timeLeft = {};

  if (differenceInMilliseconds > 0) {
    timeLeft = {
      days: difference.days(),
      hours: difference.hours(),
      minutes: difference.minutes(),
      seconds: difference.seconds(),
    };
  }

  return timeLeft;
};

export default CountdownTimer;
