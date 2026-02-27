/* src/packages/beta-engine/components/DialogueMenu.jsx */
import React from 'react';
import { GLITCHBOT_DICT } from '../dictionary';

export const DialogueMenu = ({ currentContext, activeDialogue, onFeedback }) => {
  if (activeDialogue) {
      return (
          <div className="glitchbot-dialogue">
              <div className="dialogue-text text-center text-teal font-mono">
                  {GLITCHBOT_DICT.UI.LOGGING} <br/>
                  <span className="text-main font-small">{GLITCHBOT_DICT.UI.XP_GAIN}</span>
              </div>
          </div>
      );
  }

  return (
      <div className="glitchbot-dialogue">
        <div className="dialogue-text">
           <span className="text-teal font-bold font-mono">{GLITCHBOT_DICT.UI.NAME}</span>
           <br/>
           {GLITCHBOT_DICT.PROMPTS.START} 
           <strong className="text-accent uppercase">{currentContext}</strong> 
           {GLITCHBOT_DICT.PROMPTS.END}
        </div>
        <button className="reaction-btn oof" onClick={() => onFeedback('OOF')}>
            {GLITCHBOT_DICT.REACTIONS.OOF}
        </button>
        <button className="reaction-btn eyesore" onClick={() => onFeedback('EYESORE')}>
            {GLITCHBOT_DICT.REACTIONS.EYESORE}
        </button>
        <button className="reaction-btn lightbulb" onClick={() => onFeedback('IDEA')}>
            {GLITCHBOT_DICT.REACTIONS.IDEA}
        </button>
      </div>
  );
};