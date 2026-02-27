/* src/packages/beta-engine/tabs/LabTab.jsx */
import React from 'react';
import './LabTab.css';
import { GLITCHBOT_DICT } from '../dictionary';

export const LabTab = () => {
  const { LAB } = GLITCHBOT_DICT.HUB;

  return (
    <div className="lab-container animate-fade-in">
      
      {/* LEFT: LIVE TRANSMISSIONS */}
      <div className="lab-terminal-panel">
        <div className="lab-section-header">
          <span>// {LAB.FEED_TITLE}</span>
          <span className="text-teal text-blink font-bold">● LIVE</span>
        </div>
        
        <div className="lab-feed">
          {LAB.MOCK_TRANSMISSIONS.map((t) => (
            <div 
              key={t.id} 
              className={`transmission-card type-${t.type.toLowerCase()}`}
            >
              <div className="transmission-meta">
                <div>
                  <span className="text-muted">{t.user} // </span>
                  <span className="transmission-type">[{t.type}]</span>
                  <span className="text-muted"> ON {t.context}</span>
                </div>
                <div className="text-muted opacity-50">{t.time}</div>
              </div>
              <div className="transmission-message">
                "{t.message}"
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: LEADERBOARD */}
      <div className="lab-terminal-panel">
        <div className="lab-section-header">
          <span>// {LAB.BOARD_TITLE}</span>
        </div>
        
        <div className="lab-leaderboard">
          {LAB.MOCK_LEADERBOARD.map((leader) => (
            <div 
              key={leader.rank} 
              className={`leaderboard-row rank-${leader.rank}`}
            >
              <div className="leader-rank">#{leader.rank}</div>
              <div className="leader-info">
                <div className="leader-name">{leader.name}</div>
                <div className="leader-badge">
                  {leader.badge}
                </div>
              </div>
              <div className="leader-xp">
                {leader.xp} XP
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};