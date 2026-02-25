import React from 'react';
import { DASHBOARD_STRINGS } from '../../data/glossary';

export default function DailyBriefing() {
  return (
    <div className="dashboard-panel">
      <h3 className="panel-header">{DASHBOARD_STRINGS.dailyBriefing}</h3>
      <div className="action-list">
        <div className="action-item">
          <span>Manufacture <strong>15</strong> Midnight Lavender Candles</span>
          <button className="btn-primary text-sm">LOG PRODUCTION</button>
        </div>
        <div className="action-item">
          <span>Restock <strong>Kraft Warning Labels</strong></span>
          <button className="btn-secondary text-sm">MARK ORDERED</button>
        </div>
      </div>
    </div>
  );
}