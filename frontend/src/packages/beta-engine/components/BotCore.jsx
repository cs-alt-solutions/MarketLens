/* packages/beta-engine/components/BotCore.jsx */
import React from 'react';
import { GLITCHBOT_DICT } from '../dictionary';

export const BotCore = ({ onClick, scale = "normal", interactive = true, showBadge = true }) => {
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

      {/* Renders the nameplate only when diagnostic mode is active */}
      {showBadge && (
        <div className="bot-id-badge">
            ID: {GLITCHBOT_DICT.UI.BADGE.replace('[', '').replace(']', '')}
        </div>
      )}
    </div>
  );
};