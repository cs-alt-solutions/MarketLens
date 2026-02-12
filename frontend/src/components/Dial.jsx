/* src/components/Dial.jsx */
import React from 'react';
import './Dial.css';

export const Dial = ({ value, label, colorVar }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="dial-wrapper">
      <div className="dial-svg-container">
        <svg className="dial-svg">
          <circle className="dial-bg-circle" cx="40" cy="40" r={radius} />
          <circle 
            className="dial-progress-circle" 
            cx="40" cy="40" r={radius} 
            style={{ 
              strokeDasharray: circumference, 
              strokeDashoffset: offset, 
              stroke: `var(${colorVar})` 
            }}
          />
        </svg>
        <div className="dial-value-text">{value}%</div>
      </div>
      <span className="label-industrial no-margin">{label}</span>
    </div>
  );
};