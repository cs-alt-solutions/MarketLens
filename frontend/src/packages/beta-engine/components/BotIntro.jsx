/* src/packages/beta-engine/components/BotIntro.jsx */
import React from 'react';
import { GLITCHBOT_DICT } from '../dictionary';
import { BotCore } from './BotCore';

export const BotIntro = ({ onComplete }) => {
  return (
    <div className="bot-intro-overlay">
      <div className="bot-intro-window animate-fade-in">
        <div className="bot-intro-hero">
            <BotCore scale="large" interactive={false} />
        </div>
        <div className="bot-intro-content">
            <h1 className="text-teal font-mono font-bold text-center">{GLITCHBOT_DICT.INTRO.GREETING}</h1>
            <p className="text-main mt-20 text-center">{GLITCHBOT_DICT.INTRO.LINE_1}</p>
            <p className="text-muted mt-10 text-center">{GLITCHBOT_DICT.INTRO.LINE_2}</p>
            <div className="mt-20 flex-center">
                <button className="btn-primary" onClick={onComplete}>
                    {GLITCHBOT_DICT.INTRO.BUTTON}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};