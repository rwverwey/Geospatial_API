import React from 'react';

const styles = {
  container: {
    position: 'fixed',
    bottom: '1.25rem',
    right: '1.25rem',
    background: '#2d3748',
    color: '#fff',
    padding: '0.75rem 1.25rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
    fontSize: '0.95rem',
    zIndex: 9999,
    animation: 'fadein 0.3s ease'
  }
};

const Snackbar = ({ message }) => {
  if (!message) return null;
  return <div style={styles.container}>{message}</div>;
};

export default Snackbar;
