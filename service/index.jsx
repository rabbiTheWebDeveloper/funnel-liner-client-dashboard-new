// components/ToastNotification.js
import Link from 'next/link';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToastNotification = (id,message) => {
  toast(
    <Link href={`order-details?id=${id}`} style={styles.container}>
      <div style={styles.iconContainer}>
        <span style={styles.icon}>→</span>
      </div>
      <div>
        <div style={styles.title}>New Order</div>
        <div style={styles.message}>{message}</div>
      </div>
    </Link>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    background: '#1c2742',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  iconContainer: {
    marginRight: '10px',
  },
  icon: {
    background: '#f48632',
    borderRadius: '50%',
    color: 'white',
    padding: '5px',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  message: {},
};

export const ToastNotificationContainer = () => (
  <ToastContainer />
);
