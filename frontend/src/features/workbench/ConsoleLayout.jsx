import React, { useState } from 'react';
import './ConsoleLayout.css'; // You already uploaded this file!
import { WorkbenchBoard } from './WorkbenchBoard';
import { MarketRadar } from './MarketRadar';
import { ProfitMatrix } from './ProfitMatrix';

export const ConsoleLayout = () => {
  const [activeView, setActiveView] = useState('radar'); // Default to Radar

  return (
    <div className="console-container">
      {/* --- SIDEBAR --- */}
      <div className="console-sidebar">
        <h3 className="section-title">MARKETLENS v1.0</h3>
        
        <div 
          className={`nav-link ${activeView === 'radar' ? 'active' : ''}`}
          onClick={() => setActiveView('radar')}
        >
          <span className="nav-icon">📡</span> Market Radar
        </div>

        <div 
          className={`nav-link ${activeView === 'workspace' ? 'active' : ''}`}
          onClick={() => setActiveView('workspace')}
        >
          <span className="nav-icon">🧪</span> My Workspace
        </div>

        <div 
          className={`nav-link ${activeView === 'matrix' ? 'active' : ''}`}
          onClick={() => setActiveView('matrix')}
        >
          <span className="nav-icon">💰</span> Profit Matrix
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="console-main">
        {activeView === 'radar' && <MarketRadar />}
        {activeView === 'workspace' && <WorkbenchBoard />}
        {activeView === 'matrix' && <ProfitMatrix />}
      </div>
    </div>
  );
};