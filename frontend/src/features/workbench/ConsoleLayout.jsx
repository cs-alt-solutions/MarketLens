import React, { useState } from 'react';
import './ConsoleLayout.css'; 
import { MarketRadar } from './MarketRadar';
import { ProfitMatrix } from './ProfitMatrix';
import { InventoryManager } from './InventoryManager';
import { Workshop } from './Workshop';
import { Radar, WorkshopIcon, Box, Finance, Menu, ChevronLeft } from '../../components/Icons';

export const ConsoleLayout = () => {
  // Defaulting to 'radar' (Market Pulse)
  const [activeView, setActiveView] = useState('radar'); 
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // State to track if the sub-view needs full width (e.g. Workshop Studio)
  const [isFullWidthMode, setIsFullWidthMode] = useState(false);

  // Helper to determine sidebar state: Manual Collapse OR Auto-Collapse (Focus Mode)
  const sidebarCollapsed = isCollapsed || isFullWidthMode;

  return (
    <div className="console-container">
      
      {/* --- LEFT NAVIGATION RAIL --- */}
      {/* FIXED: Now uses isFullWidthMode to auto-collapse the sidebar in Studio Mode */}
      <div className={`console-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        
        {/* Header & Toggle */}
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
        
        {/* Nav Links */}
        <div className="nav-group">
          <div className="section-label">Main Modules</div>
          
          <div 
            className={`nav-link ${activeView === 'radar' ? 'active' : ''}`}
            onClick={() => { setActiveView('radar'); setIsFullWidthMode(false); }}
            title="Market Pulse"
          >
            <Radar />
            <span className="nav-text">Market Pulse</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'workshop' ? 'active' : ''}`}
            onClick={() => { setActiveView('workshop'); setIsFullWidthMode(false); }}
            title="Workshop"
          >
            <WorkshopIcon />
            <span className="nav-text">Workshop</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'inventory' ? 'active' : ''}`}
            onClick={() => { setActiveView('inventory'); setIsFullWidthMode(false); }}
            title="Inventory"
          >
            <Box />
            <span className="nav-text">Inventory</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'matrix' ? 'active' : ''}`}
            onClick={() => { setActiveView('matrix'); setIsFullWidthMode(false); }}
            title="Profit Matrix"
          >
            <Finance />
            <span className="nav-text">Profit Matrix</span>
          </div>
        </div>

      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="console-main">
        {/* Pass the setFullWidth setter to Workshop so it can request full space when entering a project */}
        {activeView === 'radar' && <MarketRadar />}
        {activeView === 'workshop' && <Workshop onRequestFullWidth={setIsFullWidthMode} />}
        {activeView === 'inventory' && <InventoryManager />}
        {activeView === 'matrix' && <ProfitMatrix />}
      </div>
    </div>
  );
};