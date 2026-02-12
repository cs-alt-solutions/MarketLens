import React, { useState } from 'react';
import './ConsoleLayout.css'; 
import { Menu, ChevronLeft } from '../../components/Icons';
import { TERMINOLOGY, NAV_LINKS } from '../../utils/glossary';

// ... (Sub-components removed for brevity as they are now in their own files)

export const ConsoleLayout = () => {
  const [activeView, setActiveView] = useState('dashboard'); 
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavigate = (view) => setActiveView(view);

  return (
    <div className="console-container">
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
          {NAV_LINKS.map(({ id, label, Icon: IconComponent, category }) => (
            <div 
              key={id}
              className={`nav-link ${activeView === id ? 'active' : ''}`}
              onClick={() => handleNavigate(id)}
            >
              <IconComponent />
              <span className="nav-text">
                {category ? TERMINOLOGY[category][label] : TERMINOLOGY.GENERAL[label]}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* ... (Main Content mapping same as before) */}
    </div>
  );
};