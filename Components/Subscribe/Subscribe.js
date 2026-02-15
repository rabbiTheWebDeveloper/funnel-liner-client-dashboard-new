import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { nextDueDate } from "../../pages/api";
import style from "./style.module.css";

const Subscribe = ({setIsConditionTrue}) => {
  const [timerDays, setTimerDays] = useState(0);
  const [timerHours, setTimerHours] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  let interval = useRef();
  const countdownDate = new Date(nextDueDate);
  countdownDate.setDate(countdownDate.getDate() + 7); // Add 7 days
  const startTimer = () => {
    const countdownTime = countdownDate.getTime();
    interval.current = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownTime - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        // Stop Timer
        clearInterval(interval.current);
      } else {
        // Update Timer
        setTimerDays(days.toString().padStart(2, 0));
        setTimerHours(hours.toString().padStart(2, 0));
        setTimerMinutes(minutes.toString().padStart(2, 0));
        setTimerSeconds(seconds.toString().padStart(2, 0));
      }
    }, 1000);
  };

  // useEffect to start the timer when the component mounts
  useEffect(() => {
    startTimer();

    return () => {
      clearInterval(interval.current);
    };
  }, []);
  const handleIconClick = () => {
    setIsConditionTrue(false);
  };
  return (
    <>
      <div className={style.Subscribe}>
        <div className={style.left}>
          <h5>You have</h5>

          <ul>
            <li>
              <span>{timerDays}</span> Days
            </li>
            <li>
              <span>{timerHours}</span> Hours
            </li>
            <li>
              <span>{timerMinutes}</span> Mins
            </li>
            <li>
              <span>{timerSeconds}</span> Secs
            </li>
          </ul>

          <h5>
            {" "}
            left your due date ! Please pay your bill & enjoy the Powerful
            Automation Service.
          </h5>
        </div>

        <Link href="/billing?status=pay">Pay Now</Link>
        <Link href="" onClick={handleIconClick} >Skip</Link>
      </div>
    </>
  );
};

export default Subscribe;
