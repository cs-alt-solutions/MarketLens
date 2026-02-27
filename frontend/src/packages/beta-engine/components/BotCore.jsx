/* src/packages/beta-engine/components/BotCore.jsx */
import React from 'react';
import { GLITCHBOT_DICT } from '../dictionary';

export const BotCore = ({ onClick, scale = "normal", interactive = true }) => {
  const containerClass = `glitchbot-core-container scale-${scale} ${interactive ? 'interactive' : ''}`;
  
  return (
    <div className={containerClass}>
      <div className="bot-id-badge">
          {GLITCHBOT_DICT.UI.BADGE}
      </div>

      <div className="glitchbot-core" onClick={interactive ? onClick : undefined}>
          <div className="bot-arm left"></div>
          
          <div className="bot-eyes">
              <div className="bot-eye"></div>
              <div className="bot-eye"></div>
          </div>

          <div className="bot-arm right"></div>
      </div>
    </div>
  );
};