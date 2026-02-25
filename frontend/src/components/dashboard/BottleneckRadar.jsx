import React from 'react';
import { DASHBOARD_STRINGS } from '../../data/glossary';

export default function BottleneckRadar() {
  return (
    <div className="dashboard-panel panel-urgent">
      <h3 className="panel-header text-warning">{DASHBOARD_STRINGS.bottleneckRadar}</h3>
      <div className="action-list">
        {/* Mock Data - Wire to state later */}
        <div className="action-item">
          <div>
            <strong>Midnight Lavender Artisan</strong>
            <div className="hud-label">Cannot fulfill 3 pending orders</div>
          </div>
          <span className="text-warning font-bold">OUT OF: 8oz Amber Jar</span>
        </div>
      </div>
    </div>
  );
}