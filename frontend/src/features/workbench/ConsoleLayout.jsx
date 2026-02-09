import React, { useState } from 'react';
import './ConsoleLayout.css'; 
import { WorkbenchBoard } from './WorkbenchBoard';
import { MarketRadar } from './MarketRadar';
import { ProfitMatrix } from './ProfitMatrix';

// --- 2D WIREFRAME ICONS (SVG) ---
const Icons = {
  Radar: () => (
    <svg className="nav-icon" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
      <line x1="12" y1="2" x2="12" y2="12" />
    </svg>
  ),
  Workshop: () => (
    <svg className="nav-icon" viewBox="0 0 24 24">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  Finance: () => (
    <svg className="nav-icon" viewBox="0 0 24 24">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Menu: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
};

export const ConsoleLayout = () => {
  const [activeView, setActiveView] = useState('radar');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="console-container">
      
      {/* --- LEFT NAVIGATION RAIL --- */}
      <div className={`console-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        
        {/* Header & Toggle */}
        <div className="sidebar-header">
          <div className="app-title">
            <span>MARKETLENS v1.0</span>
          </div>
          <button 
            className="toggle-btn" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <Icons.Menu /> : <Icons.ChevronLeft />}
          </button>
        </div>
        
        {/* Nav Links */}
        <div className="nav-group">
          <div className="section-label">Main Modules</div>
          
          <div 
            className={`nav-link ${activeView === 'radar' ? 'active' : ''}`}
            onClick={() => setActiveView('radar')}
            title="Vibe Check"
          >
            <Icons.Radar />
            <span className="nav-text">Vibe Check</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'workspace' ? 'active' : ''}`}
            onClick={() => setActiveView('workspace')}
            title="The Workshop"
          >
            <Icons.Workshop />
            <span className="nav-text">The Workshop</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveView('matrix')}
            title="The Bottom Line"
          >
            <Icons.Finance />
            <span className="nav-text">The Bottom Line</span>
          </div>
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