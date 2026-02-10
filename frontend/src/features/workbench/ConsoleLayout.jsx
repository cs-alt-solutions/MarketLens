import React, { useState } from 'react';
import './ConsoleLayout.css'; 
import { MarketRadar } from './MarketRadar';
import { ProfitMatrix } from './ProfitMatrix';
import { InventoryManager } from './InventoryManager';
import { Workshop } from './Workshop';
// NEW IMPORTS
import { Radar, WorkshopIcon, Box, Finance, Menu, ChevronLeft } from '../../components/Icons';

export const ConsoleLayout = () => {
  // Defaulting to 'radar' (Market Pulse)
  const [activeView, setActiveView] = useState('radar'); 
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="console-container">
      
      {/* --- LEFT NAVIGATION RAIL --- */}
      <div className={`console-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        
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
            onClick={() => setActiveView('radar')}
            title="Market Pulse"
          >
            <Radar />
            <span className="nav-text">Market Pulse</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'workshop' ? 'active' : ''}`}
            onClick={() => setActiveView('workshop')}
            title="Workshop"
          >
            <WorkshopIcon />
            <span className="nav-text">Workshop</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveView('inventory')}
            title="Inventory"
          >
            <Box />
            <span className="nav-text">Inventory</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveView('matrix')}
            title="Profit Matrix"
          >
            <Finance />
            <span className="nav-text">Profit Matrix</span>
          </div>
        </div>

      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="console-main">
        {activeView === 'radar' && <MarketRadar />}
        {activeView === 'workshop' && <Workshop />}
        {activeView === 'inventory' && <InventoryManager />}
        {activeView === 'matrix' && <ProfitMatrix />}
      </div>
    </div>
  );
};