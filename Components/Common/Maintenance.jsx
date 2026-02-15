import React, { useState, useEffect } from 'react';

const Maintenance = ({ targetDateTime }) => {
  const calculateCountdown = () => {
    const now = new Date();
    const targetDate = new Date(targetDateTime);
    const diff = targetDate.getTime() - now.getTime();
    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  };

  const [countdown, setCountdown] = useState(calculateCountdown());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prevCountdown => {
        const { hours, minutes, seconds } = prevCountdown;
        if (hours === 0 && minutes === 0 && seconds === 0) {
          clearInterval(interval); // Stop the interval
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        if (seconds === 0) {
          if (minutes === 0) {
            if (hours === 0) {
              clearInterval(interval); // Stop the interval
              return { hours: 0, minutes: 0, seconds: 0 };
            }
            return { hours: hours - 1, minutes: 59, seconds: 59 };
          } else {
            return { hours, minutes: minutes - 1, seconds: 59 };
          }
        } else {
          return { hours, minutes, seconds: seconds - 1 };
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDateTime]);

  const formatTime = time => {
    return time < 10 ? `0${time}` : time;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Under Maintenance</h1>
      <p style={styles.message}>
        We are currently undergoing maintenance. Please check back later.
      </p>
      <p style={styles.countdown}>Estimated time remaining:</p>
      <h1 style={styles.heading2}>
        {formatTime(countdown.hours)}:{formatTime(countdown.minutes)}:
        {formatTime(countdown.seconds)}
      </h1>
      {/* <img src="/construction.gif" alt="Maintenance" style={styles.image} /> */}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px'
  },
  heading: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  heading2: {
    fontSize: '58px',
    fontWeight: 'bold',
    marginBottom: '20px'
    // color : '#EADCFE'
  },
  message: {
    fontSize: '18px',
    marginBottom: '20px'
  },
  countdown: {
    fontSize: '16px',
    marginBottom: '20px'
  },
  image: {
    maxWidth: '100%',
    height: 'auto'
  }
};

export default Maintenance;
