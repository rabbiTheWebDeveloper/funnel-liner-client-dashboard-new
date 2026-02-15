import React from 'react';
import styles from './progressbar.module.css';

const ProgressCircle = ({ percentage }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const progress = circumference - (percentage / 100) * circumference;

    return (

        <div className={styles.ProgressCircleMain}>

            <svg className={styles.progressCircle} viewBox="0 0 100 100">
                <circle
                    className={styles.circleBackground}
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#ecdeff"
                    strokeWidth="8"
                />
                <circle
                    className={styles.circleProgress}
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#6B2CD1" /* Replace with your desired color */
                    strokeWidth="8"
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: progress,
                    }}
                />
            </svg>

        </div>

    );
};

export default ProgressCircle;
