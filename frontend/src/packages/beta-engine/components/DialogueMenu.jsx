/* src/packages/beta-engine/components/DialogueMenu.jsx */
import React, { useState } from 'react';
import { GLITCHBOT_DICT } from '../dictionary';

export const DialogueMenu = ({ currentContext = "APP", activeDialogue, onReactionClick, onSubmit, onCancel }) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UPGRADED: The Bulletproof Translator Engine
  // We force the incoming string to UPPERCASE and trim spaces so it always matches the dictionary keys.
  const normalizedContext = currentContext.toUpperCase().trim();
  const friendlyContext = GLITCHBOT_DICT.CONTEXT_MAP[normalizedContext] || currentContext.toLowerCase();

  const handleSend = () => {
    if (!text.trim()) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      onSubmit({ type: activeDialogue, text, context: currentContext });
      setIsSubmitting(false);
      setText('');
    }, 1500);
  };

  // State 3: The Loading/Success Screen
  if (isSubmitting) {
      return (
          <div className="glitchbot-dialogue">
              <div className="dialogue-text text-center text-teal font-mono border-none">
                  {GLITCHBOT_DICT.UI.LOGGING} <br/>
                  <span className="text-main font-small">{GLITCHBOT_DICT.UI.XP_GAIN}</span>
              </div>
          </div>
      );
  }

  // State 2: The Text Input Form
  if (activeDialogue) {
      const colorClass = activeDialogue === 'OOF' ? 'text-orange' : activeDialogue === 'EYESORE' ? 'text-red' : 'text-teal';

      return (
          <div className="glitchbot-dialogue form-mode">
              <div className="dialogue-text mb-15">
                  <span className={`font-bold font-mono ${colorClass}`}>
                      {GLITCHBOT_DICT.REACTIONS[activeDialogue]}
                  </span>
              </div>
              
              <textarea
                  className="feedback-textarea"
                  placeholder={GLITCHBOT_DICT.UI.INPUT_PLACEHOLDER}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  autoFocus
              />
              
              <div className="feedback-actions">
                  <button className="btn-cancel" onClick={onCancel}>
                      {GLITCHBOT_DICT.UI.BTN_CANCEL}
                  </button>
                  <button className="btn-submit" onClick={handleSend} disabled={!text.trim()}>
                      {GLITCHBOT_DICT.UI.BTN_SUBMIT}
                  </button>
              </div>
          </div>
      );
  }

  // State 1: The Base Reaction Menu 
  return (
      <div className="glitchbot-dialogue">
        <div className="dialogue-text">
           <span className="text-teal font-bold font-mono">{GLITCHBOT_DICT.UI.NAME}</span>
           <br/>
           {GLITCHBOT_DICT.PROMPTS.START} 
           <strong className="text-accent">{friendlyContext}</strong> 
           {GLITCHBOT_DICT.PROMPTS.END}
        </div>
        <button className="reaction-btn oof" onClick={() => onReactionClick('OOF')}>
            {GLITCHBOT_DICT.REACTIONS.OOF}
        </button>
        <button className="reaction-btn eyesore" onClick={() => onReactionClick('EYESORE')}>
            {GLITCHBOT_DICT.REACTIONS.EYESORE}
        </button>
        <button className="reaction-btn lightbulb" onClick={() => onReactionClick('IDEA')}>
            {GLITCHBOT_DICT.REACTIONS.IDEA}
        </button>
      </div>
  );
};