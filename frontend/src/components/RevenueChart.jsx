import React from 'react';
import './RevenueChart.css';

export const RevenueChart = () => {
  const data = [20, 45, 30, 60, 55, 80, 75];
  const max = Math.max(...data);
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (val / max) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="revenue-chart-container">
      <svg className="revenue-chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="revenue-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--neon-teal)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--neon-teal)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M0,100 ${points} 100,100`} fill="url(#revenue-grad)" />
        <polyline 
            className="chart-line-animate"
            points={points} 
            fill="none" 
            stroke="var(--neon-teal)" 
            strokeWidth="2" 
        />
      </svg>
    </div>
  );
};