/* src/features/workbench/components/TopEarners.jsx */
import React from 'react';
import { formatCurrency } from '../../../utils/formatters';

export const TopEarners = ({ projects }) => {
  // Calculate revenue per project and sort them
  const earners = projects
    .filter(p => (p.soldQty || 0) > 0)
    .map(p => ({
      ...p,
      revenue: (p.soldQty || 0) * (p.retailPrice || 0),
      margin: p.economics?.marginPercent || 0
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5); // Keep it to the Top 5

  return (
    <div className="flex-col h-full w-full">
      <span className="label-industrial text-accent mb-15">VELOCITY LEADERBOARD</span>
      {earners.length === 0 ? (
        <div className="text-muted font-small italic">No sales data yet. Launch a Spark!</div>
      ) : (
        <div className="flex-col gap-10">
          {earners.map((p, i) => (
            <div key={p.id} className="flex-between bg-row-odd p-15 border-radius-2 border-left-teal transition-hover">
              <div className="flex-col overflow-hidden pr-10">
                <span className="text-main font-bold text-small truncate">{i + 1}. {p.title}</span>
                <span className="text-muted font-mono font-tiny mt-5">{p.margin}% MARGIN</span>
              </div>
              <span className="text-neon-teal font-mono font-bold">{formatCurrency(p.revenue)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};