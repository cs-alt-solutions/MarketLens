/* src/features/workbench/ConsoleLayout.jsx */
import React, { useState } from 'react';
import './ConsoleLayout.css'; 
import { Menu, ChevronLeft } from '../../components/Icons';
import { TERMINOLOGY, NAV_LINKS, MARKET_TICKER_DATA } from '../../utils/glossary';
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
      {/* --- SIDEBAR --- */}
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
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="console-main">
        
        {/* 1. The Actual Page Content (Loads first so it sits on top) */}
        <div className="console-content-scroll">
          {renderContent()}
        </div>

        {/* 2. GLOBAL BOTTOM BAR (Ticker + Feedback + Beta Status) */}
        <div className="global-bottom-bar bg-panel flex-between align-center px-20 border-top-subtle">
          
          {/* Left: The Scrolling Market Ticker */}
<div className="ticker-container flex-1 overflow-hidden flex-center justify-start">
  
  {/* NEW SOLID LABEL: This stays fixed while the ticker moves behind it */}
  <div className="ticker-fixed-label bg-panel-header px-20 font-mono font-tiny text-teal border-right-subtle h-full flex-center z-layer-top">
    STREET_PRICES //
  </div>

  <div className="ticker-scroll-window flex-1 overflow-hidden relative">
    <div className="ticker-scroll flex-center gap-30">
      {MARKET_TICKER_DATA.map((item) => (
        <div key={item.id} className="ticker-item flex-center gap-5 font-mono font-small">
          <span className="text-muted">{item.symbol}</span>
          <span className="text-main">{item.value}</span>
          <span className={item.trend === 'up' ? 'text-good' : item.trend === 'down' ? 'text-alert' : 'text-muted'}>
            {item.change}
          </span>
        </div>
      ))}
    </div>
  </div>
</div>

          {/* Right: Feedback Button & Beta Status */}
          <div className="top-bar-actions flex-center gap-15 pl-20 border-left-subtle">
            <button 
              className="btn-ghost flex-center gap-10 text-accent glow-teal py-5 px-15 font-small"
              onClick={() => alert("Feedback Modal Hook Goes Here!")}
            >
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
               </svg>
               SUBMIT BETA FEEDBACK
            </button>

            <div className="beta-tag text-orange font-mono font-tiny text-blink bg-row-odd px-10 py-5 border-radius-2 border-subtle">
              ● BETA_ACTIVE
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};