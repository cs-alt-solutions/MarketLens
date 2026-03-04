/* packages/beta-engine/tabs/BlueprintTab.jsx */
import React from 'react';
import { GLITCHBOT_DICT } from '../dictionary';
import { BotCore } from '../components/BotCore';
import './BlueprintTab.css'; 

// Component name must match the export used in BetaHub.jsx
export const BlueprintTab = () => {
  // Must use BLUEPRINT to match your updated dictionary.js
  const { BLUEPRINT } = GLITCHBOT_DICT.HUB; 

  return (
    <div className="blueprint-container animate-fade-in">
      <div className="blueprint-mission">
        <h2 className="blueprint-title">{BLUEPRINT.HEADING}</h2>
        <div className="blueprint-body">
          <p>{BLUEPRINT.BODY_1}</p>
          <p>{BLUEPRINT.BODY_2}</p>
        </div>

        <div className="blueprint-rules-section">
            <h3 className="rules-heading text-teal">{BLUEPRINT.RULES_HEADING}</h3>
            <div className="rules-grid">
                {BLUEPRINT.RULES.map(rule => (
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

        <div className="blueprint-signature mt-30">
          {BLUEPRINT.SIGNATURE}
        </div>
      </div>

      <div className="blueprint-divider"></div>

      <div className="blueprint-lore-card">
        <div className="lore-bot-display">
          <BotCore scale="large" interactive={true} />
        </div>
        <div className="lore-content">
          <div className="lore-badge">{BLUEPRINT.LORE.SUBTITLE}</div>
          <h3 className="lore-title text-orange">{BLUEPRINT.LORE.TITLE}</h3>
          <div className="lore-body">
            <p>{BLUEPRINT.LORE.PARAGRAPH_1}</p>
            <p>{BLUEPRINT.LORE.PARAGRAPH_2}</p>
          </div>
          <div className="lore-cta text-teal font-mono font-bold mt-15">
            // {BLUEPRINT.LORE.CALL_TO_ACTION}
          </div>
        </div>
      </div>
    </div>
  );
};