/* src/features/workbench/ConsoleLayout.jsx */
import React, { useState } from 'react';
import './ConsoleLayout.css'; 
import { Menu, ChevronLeft } from '../../components/Icons';
import { TERMINOLOGY, NAV_LINKS } from '../../utils/glossary';
import { DashboardHome } from './DashboardHome';
import { Workshop } from './Workshop';
import { InventoryManager } from './InventoryManager';
import { ProfitMatrix } from './ProfitMatrix';
import { MarketRadar } from './MarketRadar';

export const ConsoleLayout = () => {
  const [activeView, setActiveView] = useState('dashboard'); 
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavigate = (view) => setActiveView(view);

  // View Router Logic
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardHome onNavigate={handleNavigate} />;
      case 'workshop': return <Workshop />;
      case 'inventory': return <InventoryManager />;
      case 'matrix': return <ProfitMatrix />;
      case 'radar': return <MarketRadar />;
      default: return <DashboardHome onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="console-container">
      {/* SIDEBAR */}
      <div className={`console-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="app-title">
            <span>{TERMINOLOGY.GENERAL.APP_NAME}</span>
          </div>
          <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <Menu /> : <ChevronLeft />}
          </button>
        </div>
        
        <div className="nav-group">
          {NAV_LINKS.map((navItem) => {
             // Explicitly grab the Icon component from the config object
             const IconComponent = navItem.Icon;
             
             return (
              <div 
                key={navItem.id}
                className={`nav-link ${activeView === navItem.id ? 'active' : ''}`}
                onClick={() => handleNavigate(navItem.id)}
              >
                <IconComponent />
                <span className="nav-text">
                  {navItem.category ? TERMINOLOGY[navItem.category][navItem.label] : TERMINOLOGY.GENERAL[navItem.label]}
                </span>
              </div>
             );
          })}
        </div>

        <div className="sidebar-compliance-footer">
          <p className="compliance-text">
             CONFIDENTIAL<br />
             AUTH: C.SULENSKI<br />
             {TERMINOLOGY.GENERAL.VERSION}
          </p>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="console-main">
        {renderContent()}
      </div>
    </div>
  );
};