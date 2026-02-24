/* src/components/charts/RevenueChart.jsx */
import React, { useMemo } from 'react';
import './RevenueChart.css';
import { RevenueChartIcon } from '../Icons';
import { useFinancialStats } from '../../context/FinancialContext';

export const RevenueChart = () => {
  const { totalRev = 0, totalCost = 0, margin = 0, monthlyBurn = 0 } = useFinancialStats();

  const lines = useMemo(() => {
    const getStableNoise = (index, seed) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };

    const generateCurve = (currentValue, volatility, seed) => {
      const pts = [];
      let val = currentValue * 0.4; 
      for (let i = 0; i < 7; i++) {
        if (i === 6) {
          val = currentValue; 
        } else {
          const noise = getStableNoise(i, seed);
          val += ((currentValue - val) / (6 - i)) + (noise * volatility - (volatility / 2));
        }
        pts.push(Math.max(0, val));
      }
      return pts;
    };

    const sales = generateCurve(totalRev, totalRev * 0.1, 1);
    const expenses = generateCurve(totalCost, totalCost * 0.1, 2);
    const marginLine = generateCurve(margin, 5, 3);
    const burn = Array(7).fill(monthlyBurn); 

    // --- ENHANCED SCALING LOGIC ---
    // Instead of one maxVal, we find the range for each line to ensure they all "fit" the window
    const getPoints = (data, dataMax) => {
      // Use the global max or the local max to ensure visibility
      const ceiling = Math.max(totalRev, totalCost, margin, monthlyBurn, 100);
      return data.map((val, i) => {
        const x = (i / 6) * 100;
        // We use a 10% bottom buffer so lines don't sit exactly on the bottom edge
        const y = 90 - ((val / ceiling) * 80); 
        return `${x},${y}`;
      }).join(' ');
    };

    return [
      { label: 'SALES', color: 'var(--neon-teal)', points: getPoints(sales) },
      { label: 'EXPENSES', color: 'var(--neon-orange)', points: getPoints(expenses) },
      { label: 'MARGIN', color: 'var(--neon-purple)', points: getPoints(marginLine) },
      { label: 'BURN RATE', color: 'var(--neon-red)', points: getPoints(burn) }
    ];
  }, [totalRev, totalCost, margin, monthlyBurn]);

  return (
    <div className="revenue-chart-container">
      <div className="flex-end gap-20 mb-15">
        {lines.map(l => (
          <div key={l.label} className="flex-center gap-10 font-small font-mono text-muted">
            <span style={{ 
              width: 10, 
              height: 10, 
              backgroundColor: l.color, 
              borderRadius: '50%', 
              boxShadow: `0 0 8px ${l.color}` 
            }}></span>
            {l.label}
          </div>
        ))}
      </div>
      
      <RevenueChartIcon lines={lines} />
    </div>
  );
};