/* src/components/charts/RevenueChart.jsx */
import React, { useMemo } from 'react';
import './RevenueChart.css';
import { useFinancialStats } from '../../context/FinancialContext';
import { formatCurrency } from '../../utils/formatters';

export const RevenueChart = () => {
  const { transactions = [], monthlyBurn = 0 } = useFinancialStats();

  const { days, ceiling, yLabels, hasData } = useMemo(() => {
    // 1. Generate Timeline (Last 7 Days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push({
        dateObj: d,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: 0,
        expenses: 0
      });
    }

    // 2. Map Transactions
    transactions.forEach(tx => {
      const txDate = new Date(tx.created_at || tx.date);
      const dayMatch = last7Days.find(d => 
        d.dateObj.getDate() === txDate.getDate() && 
        d.dateObj.getMonth() === txDate.getMonth() &&
        d.dateObj.getFullYear() === txDate.getFullYear()
      );

      if (dayMatch) {
        if (tx.type === 'SALE' || tx.type === 'INCOME') {
          dayMatch.sales += Math.abs(tx.amount || 0);
        } else if (tx.type === 'EXPENSE') {
          dayMatch.expenses += Math.abs(tx.amount || 0);
        }
      }
    });

    // 3. Dynamic Ceiling Calculation & Data Check
    let maxVal = Math.max(monthlyBurn, 10);
    let dataCheck = false; // 🚀 Let's check if the week is actually empty!

    last7Days.forEach(d => {
      if (d.sales > 0 || d.expenses > 0) dataCheck = true;
      if (d.sales > maxVal) maxVal = d.sales;
      if (d.expenses > maxVal) maxVal = d.expenses;
    });
    
    const finalCeiling = maxVal * 1.15; // 15% breathing room at the top
    const generatedYLabels = [finalCeiling, finalCeiling * 0.75, finalCeiling * 0.5, finalCeiling * 0.25, 0];

    return { days: last7Days, ceiling: finalCeiling, yLabels: generatedYLabels, hasData: dataCheck };
  }, [transactions, monthlyBurn]);

  // 🚀 SVG Canvas Setup
  const viewBoxWidth = 800;
  const viewBoxHeight = 300;

  // Helper to map a data value to an X,Y coordinate on the SVG canvas
  const getCoordinates = (index, value) => {
    const x = (index / (days.length - 1)) * viewBoxWidth;
    
    // 🚀 THE FIX: We offset the floor by 3 pixels so the $0 line doesn't hide behind the bottom border!
    const y = (viewBoxHeight - 3) - ((value / ceiling) * (viewBoxHeight - 15));
    
    return { x, y };
  };

  // Generate SVG Path Strings
  const salesPoints = days.map((d, i) => `${getCoordinates(i, d.sales).x},${getCoordinates(i, d.sales).y}`).join(' ');
  const expensesPoints = days.map((d, i) => `${getCoordinates(i, d.expenses).x},${getCoordinates(i, d.expenses).y}`).join(' ');

  // Generate Area Polygons (closes the shape at the bottom of the graph for the gradient fill)
  const salesPolygon = `${salesPoints} ${viewBoxWidth},${viewBoxHeight} 0,${viewBoxHeight}`;
  const expensesPolygon = `${expensesPoints} ${viewBoxWidth},${viewBoxHeight} 0,${viewBoxHeight}`;

  const burnY = (viewBoxHeight - 3) - ((monthlyBurn / ceiling) * (viewBoxHeight - 15));

  return (
    <div className="finance-chart-wrapper">
      
      {/* Legend Area */}
      <div className="chart-legend flex-end gap-20 mb-15">
         <div className="flex-center gap-10 font-small font-mono text-muted">
            <span className="legend-dot bg-neon-teal"></span> SALES
         </div>
         <div className="flex-center gap-10 font-small font-mono text-muted">
            <span className="legend-dot bg-neon-orange"></span> EXPENSES
         </div>
         <div className="flex-center gap-10 font-small font-mono text-muted">
            <span className="legend-line bg-neon-red"></span> BURN RATE
         </div>
      </div>

      <div className="finance-chart-core">
        
        {/* Y-Axis Metrics */}
        <div className="finance-y-axis">
          {yLabels.map((val, i) => (
            <div key={i} className="y-axis-tick font-mono font-small text-muted">
              {formatCurrency(val)}
            </div>
          ))}
        </div>

        {/* Plot Area */}
        <div className="finance-plot-area">
          
          {/* Structural Grid Lines */}
          <div className="finance-grid-lines">
            <div className="finance-grid-line"></div>
            <div className="finance-grid-line"></div>
            <div className="finance-grid-line"></div>
            <div className="finance-grid-line"></div>
            <div className="finance-grid-line base"></div>
          </div>

          {/* 🚀 SAFETY NET: Shows when there is literally zero data for the week */}
          {!hasData && (
              <div className="absolute w-full h-full flex-center z-layer-top" style={{ pointerEvents: 'none' }}>
                  <span className="font-mono text-muted font-small" style={{ opacity: 0.5, letterSpacing: '2px' }}>
                      [ NO TRANSACTIONS IN LAST 7 DAYS ]
                  </span>
              </div>
          )}

          {/* THE SVG AREA CHART */}
          <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="finance-svg-overlay" preserveAspectRatio="none">
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--neon-teal)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--neon-teal)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="expensesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--neon-orange)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--neon-orange)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Burn Rate Threshold Line */}
            {monthlyBurn > 0 && (
                <line x1="0" y1={burnY} x2={viewBoxWidth} y2={burnY} className="svg-burn-line">
                   <title>Monthly Burn Rate: {formatCurrency(monthlyBurn)}</title>
                </line>
            )}

            {/* Glowing Gradient Areas */}
            <polygon points={salesPolygon} fill="url(#salesGrad)" />
            <polygon points={expensesPolygon} fill="url(#expensesGrad)" />

            {/* Crisp Neon Lines */}
            <polyline points={salesPoints} fill="none" stroke="var(--neon-teal)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            <polyline points={expensesPoints} fill="none" stroke="var(--neon-orange)" strokeWidth="3" vectorEffect="non-scaling-stroke" />

            {/* Interactive Data Points (Dots) */}
            {days.map((d, i) => {
              const sCoord = getCoordinates(i, d.sales);
              const eCoord = getCoordinates(i, d.expenses);
              return (
                <React.Fragment key={i}>
                  <circle cx={sCoord.x} cy={sCoord.y} r="4" className="chart-data-point point-sales" vectorEffect="non-scaling-stroke">
                     <title>{d.label} Sales: {formatCurrency(d.sales)}</title>
                  </circle>
                  <circle cx={eCoord.x} cy={eCoord.y} r="4" className="chart-data-point point-expenses" vectorEffect="non-scaling-stroke">
                     <title>{d.label} Expenses: {formatCurrency(d.expenses)}</title>
                  </circle>
                </React.Fragment>
              );
            })}
          </svg>

          {/* X-Axis Labels */}
          <div className="finance-x-axis">
             {days.map((day, idx) => (
                <div 
                  key={idx} 
                  className="finance-x-label font-mono font-small text-muted"
                  style={{ left: `${(idx / (days.length - 1)) * 100}%` }}
                >
                  {day.label}
                </div>
             ))}
          </div>

        </div>
      </div>
    </div>
  );
};