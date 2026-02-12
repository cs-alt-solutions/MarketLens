import React from 'react';
import './StampHeader.css';

export const StampHeader = ({ status, label }) => {
  return (
    <div className="stamp-header-container">
      <div className={`stamp-header-body ${status.toLowerCase()}`}>
        {label}
      </div>
      <div className="stamp-header-line" />
    </div>
  );
};