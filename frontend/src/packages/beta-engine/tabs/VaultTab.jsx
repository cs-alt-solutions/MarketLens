/* src/packages/beta-engine/tabs/VaultTab.jsx */
import React from 'react';
import './VaultTab.css';
import { GLITCHBOT_DICT } from '../dictionary';

export const VaultTab = () => {
  const { VAULT } = GLITCHBOT_DICT.HUB;

  return (
    <div className="vault-container animate-fade-in">
      
      <div className="vault-section-header">
        <span>// {VAULT.HEADER_TITLE}</span>
        <span className="text-purple font-bold text-blink">● ONLINE</span>
      </div>
      
      <div className="vault-grid">
        {VAULT.MODULES.map((mod) => {
          // Check if the module is locked to apply specific styling
          const isLocked = mod.status.includes('LOCKED');
          const cardClass = `vault-card ${isLocked ? 'status-locked' : 'status-unlocked'}`;
          const statusTextClass = isLocked ? 'status-locked-text' : 'status-unlocked-text';

          return (
            <div key={mod.id} className={cardClass}>
              
              <div className="vault-card-header">
                <span className="vault-module-type">[{mod.type}]</span>
              </div>
              
              <div>
                <h3 className="vault-card-title">{mod.title}</h3>
                <p className="vault-card-desc">{mod.desc}</p>
              </div>
              
              <div className="vault-card-footer">
                <span className={`vault-status-tag ${statusTextClass}`}>
                  {isLocked ? `// ${mod.status}` : `// ${mod.status}`}
                </span>
                
                {/* A decorative icon indicating the action (play/download/locked) */}
                <button className="vault-action-btn" disabled={isLocked}>
                  {isLocked ? '🔒' : '→'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};