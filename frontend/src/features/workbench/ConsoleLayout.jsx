import React, { useState } from 'react';
import './ConsoleLayout.css'; 
import { DashboardHome } from './DashboardHome'; // Import the new component
import { MarketRadar } from './MarketRadar';
import { ProfitMatrix } from './ProfitMatrix';
import { InventoryManager } from './InventoryManager';
import { Workshop } from './Workshop';
import { Radar, WorkshopIcon, Box, Finance, Menu, ChevronLeft } from '../../components/Icons';
import { TERMINOLOGY } from '../../utils/glossary';

// Create a Dashboard Icon (Simple Grid)
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

export const ConsoleLayout = () => {
  // CHANGED: Default view is now 'dashboard'
  const [activeView, setActiveView] = useState('dashboard'); 
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFullWidthMode, setIsFullWidthMode] = useState(false);

  const sidebarCollapsed = isCollapsed || isFullWidthMode;

  // Helper to allow dashboard widgets to switch views
  const handleNavigate = (view) => {
    setActiveView(view);
    setIsFullWidthMode(false);
  };

  return (
    <div className="console-container">
      
      {/* --- LEFT NAVIGATION RAIL --- */}
      <div className={`console-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        
        <div className="sidebar-header">
          <div className="app-title">
            <span>MARKETLENS v2.0</span>
          </div>
          <button 
            className="toggle-btn" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <Menu /> : <ChevronLeft />}
          </button>
        </div>
        
        <div className="nav-group">
          {/* CHANGED: Header label to 'MODULES' or similar from glossary */}
          <div className="section-label">{TERMINOLOGY.GENERAL.MODULES || "SECTIONS"}</div>
          
          {/* NEW: Dashboard Link */}
          <div 
            className={`nav-link ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigate('dashboard')}
            title={TERMINOLOGY.GENERAL.SYSTEMS_LABEL}
          >
            <DashboardIcon />
            <span className="nav-text">{TERMINOLOGY.GENERAL.SYSTEMS_LABEL}</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'workshop' ? 'active' : ''}`}
            onClick={() => handleNavigate('workshop')}
            title={TERMINOLOGY.WORKSHOP.HUB_HEADER}
          >
            <WorkshopIcon />
            <span className="nav-text">{TERMINOLOGY.WORKSHOP.HUB_HEADER}</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'inventory' ? 'active' : ''}`}
            onClick={() => handleNavigate('inventory')}
            title={TERMINOLOGY.INVENTORY.HEADER}
          >
            <Box />
            <span className="nav-text">{TERMINOLOGY.INVENTORY.HEADER}</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'matrix' ? 'active' : ''}`}
            onClick={() => handleNavigate('matrix')}
            title={TERMINOLOGY.FINANCE.HEADER}
          >
            <Finance />
            <span className="nav-text">{TERMINOLOGY.FINANCE.HEADER}</span>
          </div>

          {/* MOVED: Market Radar to bottom of list */}
          <div 
            className={`nav-link ${activeView === 'radar' ? 'active' : ''}`}
            onClick={() => handleNavigate('radar')}
            title={TERMINOLOGY.MARKET.HEADER}
          >
            <Radar />
            <span className="nav-text">{TERMINOLOGY.MARKET.HEADER}</span>
          </div>
        </div>

        {!sidebarCollapsed && (
          <div className="sidebar-compliance-footer">
            <p className="compliance-text">
              The term 'Etsy' is a trademark of Etsy, Inc. This application uses the Etsy API but is not endorsed or certified by Etsy, Inc.
            </p>
          </div>
        )}

      </div>

      <div className="console-main">
        {/* NEW: Route for Dashboard */}
        {activeView === 'dashboard' && <DashboardHome onNavigate={handleNavigate} />}
        {activeView === 'radar' && <MarketRadar />}
        {activeView === 'workshop' && <Workshop onRequestFullWidth={setIsFullWidthMode} />}
        {activeView === 'inventory' && <InventoryManager />}
        {activeView === 'matrix' && <ProfitMatrix />}
      </div>
    </div>
  );
};