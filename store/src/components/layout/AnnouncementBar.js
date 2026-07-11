"use client";
import React, { useState } from 'react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div style={{
      backgroundColor: 'var(--color-primary-dark)',
      color: '#fefcf9',
      padding: '8px 24px',
      fontSize: '13px',
      textAlign: 'center',
      fontWeight: '500',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      zIndex: 101,
      letterSpacing: '0.5px'
    }}>
      <span>Enjoy free shipping on all orders above ₹499!</span>
      <button 
        onClick={() => setVisible(false)}
        style={{
          color: '#fefcf9',
          position: 'absolute',
          right: '24px',
          fontSize: '16px',
          opacity: '0.8',
          cursor: 'pointer'
        }}
        aria-label="Dismiss announcement"
      >
        ×
      </button>
    </div>
  );
}
