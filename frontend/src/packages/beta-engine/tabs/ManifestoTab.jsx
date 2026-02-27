/* src/packages/beta-engine/tabs/ManifestoTab.jsx */
import React from 'react';
import { GLITCHBOT_DICT } from '../dictionary';
import { BotCore } from '../components/BotCore';
import './ManifestoTab.css';

export const ManifestoTab = () => {
  const { MANIFESTO } = GLITCHBOT_DICT.HUB;

  return (
    <div className="manifesto-container animate-fade-in">
      
      {/* SECTION 1: THE MISSION */}
      <div className="manifesto-mission">
        <h2 className="manifesto-title">{MANIFESTO.HEADING}</h2>
        <div className="manifesto-body">
          <p>{MANIFESTO.BODY_1}</p>
          <p>{MANIFESTO.BODY_2}</p>
        </div>

        {/* NEW: The Rules of Engagement */}
        <div className="manifesto-rules-section">
            <h3 className="rules-heading text-teal">{MANIFESTO.RULES_HEADING}</h3>
            <div className="rules-grid">
                {MANIFESTO.RULES.map(rule => (
                    <div key={rule.id} className="rule-card">
                        <div className="rule-number">0{rule.id}</div>
                        <div className="rule-content">
                            <h4 className="rule-title">{rule.title}</h4>
                            <p className="rule-desc">{rule.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="manifesto-signature mt-30">
          {MANIFESTO.SIGNATURE}
        </div>
      </div>

      <div className="manifesto-divider"></div>

      {/* SECTION 2: THE GAME (GLITCHBOT LORE) */}
      <div className="manifesto-lore-card">
        <div className="lore-bot-display">
          <BotCore scale="large" interactive={true} />
        </div>
        
        <div className="lore-content">
          <div className="lore-badge">{MANIFESTO.LORE.SUBTITLE}</div>
          <h3 className="lore-title text-orange">{MANIFESTO.LORE.TITLE}</h3>
          
          <div className="lore-body">
            <p>{MANIFESTO.LORE.PARAGRAPH_1}</p>
            <p>{MANIFESTO.LORE.PARAGRAPH_2}</p>
          </div>
          
          <div className="lore-cta text-teal font-mono font-bold mt-15">
            // {MANIFESTO.LORE.CALL_TO_ACTION}
          </div>
        </div>
      </div>

    </div>
  );
};