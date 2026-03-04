/* packages/beta-engine/components/BotCore.jsx */
import React from 'react';
import { GLITCHBOT_DICT } from '../dictionary';

export const BotCore = ({ onClick, scale = "normal", interactive = true }) => {
  // Ensure this template literal generates "scale-normal" or "scale-large"
  const containerClass = `glitchbot-core-container scale-${scale} ${interactive ? 'interactive' : ''}`;
  
  return (
    <div className={containerClass}>
      <div className="glitchbot-core-mascot" onClick={interactive ? onClick : undefined}>
          <img 
            src="/glitchbot_mascot.png" 
            alt="GLITCH_BOT" 
            className="bot-image-render"
          />
      </div>

      {/* Using ID prefix to look like a diagnostic HUD */}
      <div className="bot-id-badge">
          ID: {GLITCHBOT_DICT.UI.BADGE.replace('[', '').replace(']', '')}
      </div>
    </div>
  );
};