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

  // Intro only shows up if he is floating (in the main app) and hasn't been acknowledged yet
  const showIntro = !hasSeenIntro && mode === "floating";

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setActiveDialogue(null); 
  };

  const handleFeedback = (type) => {
    setActiveDialogue(type);
    
    // Simulate logging to the Beta Database to track XP
    setTimeout(() => {
        setIsOpen(false);
    }, 2000);
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
            onFeedback={handleFeedback} 
        />
      )}
      <BotCore onClick={handleToggle} />
    </div>
  );
};