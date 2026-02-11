import React, { useState } from 'react';
import './ConsoleLayout.css'; 
import { MarketRadar } from './MarketRadar';
import { ProfitMatrix } from './ProfitMatrix';
import { InventoryManager } from './InventoryManager';
import { Workshop } from './Workshop';
import { Radar, WorkshopIcon, Box, Finance, Menu, ChevronLeft } from '../../components/Icons';
import { TERMINOLOGY } from '../../utils/glossary';

export const ConsoleLayout = () => {
  const [activeView, setActiveView] = useState('radar'); 
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFullWidthMode, setIsFullWidthMode] = useState(false);

  const sidebarCollapsed = isCollapsed || isFullWidthMode;

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
          <div className="section-label">{TERMINOLOGY.GENERAL.SYSTEMS_LABEL}</div>
          
          <div 
            className={`nav-link ${activeView === 'radar' ? 'active' : ''}`}
            onClick={() => { setActiveView('radar'); setIsFullWidthMode(false); }}
            title={TERMINOLOGY.MARKET.HEADER}
          >
            <Radar />
            <span className="nav-text">{TERMINOLOGY.MARKET.HEADER}</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'workshop' ? 'active' : ''}`}
            onClick={() => { setActiveView('workshop'); setIsFullWidthMode(false); }}
            title={TERMINOLOGY.WORKSHOP.HUB_HEADER}
          >
            <WorkshopIcon />
            <span className="nav-text">{TERMINOLOGY.WORKSHOP.HUB_HEADER}</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'inventory' ? 'active' : ''}`}
            onClick={() => { setActiveView('inventory'); setIsFullWidthMode(false); }}
            title={TERMINOLOGY.INVENTORY.HEADER}
          >
            <Box />
            <span className="nav-text">{TERMINOLOGY.INVENTORY.HEADER}</span>
          </div>

          <div 
            className={`nav-link ${activeView === 'matrix' ? 'active' : ''}`}
            onClick={() => { setActiveView('matrix'); setIsFullWidthMode(false); }}
            title={TERMINOLOGY.FINANCE.HEADER}
          >
            <Finance />
            <span className="nav-text">{TERMINOLOGY.FINANCE.HEADER}</span>
          </div>
        </div>

        {/* --- MANDATORY ETSY COMPLIANCE FOOTER --- */}
        {!sidebarCollapsed && (
          <div className="sidebar-compliance-footer">
            <p className="compliance-text">
              The term 'Etsy' is a trademark of Etsy, Inc. This application uses the Etsy API but is not endorsed or certified by Etsy, Inc.
            </p>
          </div>
        )}

      </div>

      <div className="console-main">
        {activeView === 'radar' && <MarketRadar />}
        {activeView === 'workshop' && <Workshop onRequestFullWidth={setIsFullWidthMode} />}
        {activeView === 'inventory' && <InventoryManager />}
        {activeView === 'matrix' && <ProfitMatrix />}
      </div>
    </div>
  );
};