/* src/packages/beta-engine/BetaTrigger.jsx */
import React from 'react';
import './BetaTrigger.css';
import { GLITCHBOT_DICT } from './dictionary';

export const BetaTrigger = ({ onClick }) => {
  return (
    <button 
      className="beta-hub-trigger font-mono font-tiny text-blink border-radius-2 px-15 py-5"
      onClick={onClick}
    >
      {/* We will add this exact string to the dictionary in the next step */}
      ● {GLITCHBOT_DICT.UI.TRIGGER_LABEL}
    </button>
  );
};