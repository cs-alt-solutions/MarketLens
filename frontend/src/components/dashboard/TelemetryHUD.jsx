import React from 'react';

export default function TelemetryHUD({ sales, expenses, profit }) {
  return (
    <div className="flex-between gap-20">
      <div className="panel-industrial flex-col pad-20 w-full glow-teal">
        <span className="label-industrial text-muted">Total Sales</span>
        <span className="hud-value text-teal mt-10">{sales}</span>
        <span className="text-good font-small mt-10 font-mono">↑ 12% vs Last Wk</span>
      </div>
      <div className="panel-industrial flex-col pad-20 w-full glow-orange">
        <span className="label-industrial text-muted">Total Expenses</span>
        <span className="hud-value text-orange mt-10">{expenses}</span>
        <span className="text-alert font-small mt-10 font-mono">↓ 3% vs Last Wk</span>
      </div>
      <div className="panel-industrial flex-col pad-20 w-full glow-purple">
        <span className="label-industrial text-muted">Net Profit</span>
        <span className="hud-value text-purple mt-10">{profit}</span>
        <span className="text-good font-small mt-10 font-mono">↑ 15% vs Last Wk</span>
      </div>
    </div>
  );
}