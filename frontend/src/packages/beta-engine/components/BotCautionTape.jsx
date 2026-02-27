/* src/packages/beta-engine/components/BotCautionTape.jsx */
import React from 'react';
import { BotCore } from './BotCore';
import { GLITCHBOT_DICT } from '../dictionary';
import './BotCautionTape.css';

export const BotCautionTape = ({ children }) => {
  return (
    <div className="btn-tape-wrapper">
       
       <div className="btn-tape-content">
          {children}
       </div>

       {/* The Bot and the Caution Tape unrolling beneath the button */}
       <div className="bot-tape-action">
          <div className="bot-tape-holder">
             <BotCore scale="normal" interactive={false} />
          </div>
          <div className="bot-caution-tape">
             <span className="tape-text">{GLITCHBOT_DICT.INTRO.TAPE_LABEL}</span>
          </div>
       </div>

    </div>
  );
};