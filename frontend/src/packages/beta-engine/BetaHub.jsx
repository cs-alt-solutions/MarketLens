/* src/packages/beta-engine/BetaHub.jsx */
import React, { useState } from 'react';
import './BetaHub.css';
import { GLITCHBOT_DICT } from './dictionary';

import { ManifestoTab } from './tabs/ManifestoTab';
import { LabTab } from './tabs/LabTab';
import { VaultTab } from './tabs/VaultTab';
import { GlitchBot } from './GlitchBot';

export const BetaHub = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('MANIFESTO');

  const renderContent = () => {
    switch (activeTab) {
      case 'MANIFESTO': return <ManifestoTab />;
      case 'LAB':       return <LabTab />;
      case 'VAULT':     return <VaultTab />;
      default:          return null;
    }
  };

  return (
    <div className="beta-hub-overlay">
      <div className="beta-hub-window">
        
        <div className="hub-header">
          <div className="font-mono font-bold text-orange">
            {GLITCHBOT_DICT.HUB.TITLE}
          </div>
          
          <div className="evolution-container">
            <div className="evolution-label">
              <span>{GLITCHBOT_DICT.HUB.EVOLUTION_PHASE}</span>
              {/* UPGRADED: RPG XP Tracker */}
              <span>{GLITCHBOT_DICT.HUB.XP_PROGRESS}</span>
            </div>
            <div className="evolution-track">
              <div className="evolution-fill"></div>
            </div>
          </div>

          <button className="btn-icon-hover-clean text-main font-large" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="hub-content">
          
          <div className="hub-sidebar">
            <button 
              className={`hub-tab tab-manifesto ${activeTab === 'MANIFESTO' ? 'active' : ''}`}
              onClick={() => setActiveTab('MANIFESTO')}
            >
              // {GLITCHBOT_DICT.HUB.TABS.MANIFESTO}
            </button>
            <button 
              className={`hub-tab tab-lab ${activeTab === 'LAB' ? 'active' : ''}`}
              onClick={() => setActiveTab('LAB')}
            >
              // {GLITCHBOT_DICT.HUB.TABS.LAB}
            </button>
            <button 
              className={`hub-tab tab-vault ${activeTab === 'VAULT' ? 'active' : ''}`}
              onClick={() => setActiveTab('VAULT')}
            >
              // {GLITCHBOT_DICT.HUB.TABS.VAULT}
            </button>

            <GlitchBot mode="docked" currentContext={`HUB: ${activeTab}`} />

          </div>

          <div className="hub-main-panel">
            {renderContent()}
          </div>

        </div>
      </div>
    </div>
  );
};