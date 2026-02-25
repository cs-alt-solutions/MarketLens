import React from 'react';
import { DASHBOARD_STRINGS } from '../../data/glossary';

export default function DraftRunway() {
  return (
    <div className="dashboard-panel">
      <h3 className="panel-header">{DASHBOARD_STRINGS.draftRunway}</h3>
      <div className="action-list">
        <div className="action-item">
          <span>Citrus Sunburst Travel Tin</span>
          <span className="text-cyan text-sm font-bold">{DASHBOARD_STRINGS.runwaySOP}</span>
        </div>
        <div className="action-item">
          <span>Untitled Build (ID: A9A7)</span>
          <span className="text-sm font-bold">{DASHBOARD_STRINGS.runwayIdea}</span>
        </div>
      </div>
    </div>
  );
}