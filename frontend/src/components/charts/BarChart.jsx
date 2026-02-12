/* src/components/charts/BarChart.jsx */
import React from 'react';
import './BarChart.css';

export const BarChart = ({ data, maxVal, height = 150, colorVar = '--neon-teal' }) => {
  // data = [{ label: 'A', value: 10 }, { label: 'B', value: 20 }]
  const barWidth = 100 / (data.length * 1.5); 
  const gap = barWidth / 2;

  return (
    <div className="bar-chart-container" style={{ height: `${height}px` }}>
        <svg className="bar-chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            {data.map((item, i) => {
                const barHeight = (item.value / maxVal) * 100;
                const x = (i * (barWidth + gap)) + gap/2;
                return (
                    <g key={i} className="bar-group">
                        <rect 
                            x={`${x}%`} 
                            y={`${100 - barHeight}%`} 
                            width={`${barWidth}%`} 
                            height={`${barHeight}%`} 
                            className="bar-rect"
                            style={{ fill: `var(${colorVar})` }}
                        />
                        <text 
                            x={`${x + barWidth/2}%`} 
                            y="95%" 
                            className="bar-label"
                            textAnchor="middle"
                        >
                            {item.label}
                        </text>
                    </g>
                );
            })}
        </svg>
    </div>
  );
};