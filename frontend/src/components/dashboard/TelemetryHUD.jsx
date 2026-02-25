import React from 'react';
import { DASHBOARD_STRINGS } from '../../data/glossary';

export default function TelemetryHUD({ sales, expenses, profit }) {
  // In a real scenario, deltas are calculated from historical data
  return (
    <div className="hud-container">
      <div className="hud-card">
        <div className="hud-label">Total Sales</div>
        <div className="hud-value">{sales}</div>
        <div className="hud-delta-positive">↑ 12% vs Last Wk</div>
      </div>
      <div className="hud-card">
        <div className="hud-label">Total Expenses</div>
        <div className="hud-value">{expenses}</div>
        <div className="hud-delta-negative">↓ 3% vs Last Wk</div>
      </div>
      <div className="hud-card">
        <div className="hud-label">Net Profit</div>
        <div className="hud-value">{profit}</div>
        <div className="hud-delta-positive">↑ 15% vs Last Wk</div>
      </div>
    </div>
  );
}