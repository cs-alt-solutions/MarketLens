/* src/packages/beta-engine/GlitchBot.jsx */
import React, { useState } from 'react';
import './GlitchBot.css';
import { BotCore } from './components/BotCore';
import { DialogueMenu } from './components/DialogueMenu';
import { BotIntro } from './components/BotIntro';

export const GlitchBot = ({ currentContext = "APP", mode = "floating" }) => {
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDialogue, setActiveDialogue] = useState(null);

  const showIntro = !hasSeenIntro && mode === "floating";

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setActiveDialogue(null); 
  };

  const handleReactionClick = (type) => {
    setActiveDialogue(type);
  };

  const handleCancel = () => {
    setActiveDialogue(null);
  };

  const handleSubmit = (feedbackData) => {
    // We are temporarily logging this to the console. 
    // Soon, we will lift this state so it populates the Lab Tab!
    console.log("🔥 GLITCHBOT CAPTURED FEEDBACK:", feedbackData);
    
    setIsOpen(false);
    setActiveDialogue(null);
  };

  if (showIntro) {
      return <BotIntro onComplete={() => setHasSeenIntro(true)} />;
  }

  return (
    <div className={`glitchbot-wrapper mode-${mode}`}>
      {isOpen && (
        <DialogueMenu 
            currentContext={currentContext} 
            activeDialogue={activeDialogue} 
            onReactionClick={handleReactionClick}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
      )}
      <BotCore onClick={handleToggle} />
    </div>
  );
};