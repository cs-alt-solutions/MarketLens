/* src/components/charts/RevenueChart.jsx */
import React from 'react';
import './RevenueChart.css';
import { RevenueChartIcon } from '../Icons';

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
      <RevenueChartIcon points={points} />
    </div>
  );
};