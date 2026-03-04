/* src/packages/beta-engine/GlitchBot.jsx */
import React, { useState } from 'react';
import './GlitchBot.css';
import { BotCore } from './components/BotCore';
import { DialogueMenu } from './components/DialogueMenu';

/**
 * GLITCHBOT: The primary state manager for the diagnostic companion.
 * @param {string} currentContext - Tells the bot where it is (e.g., 'DASHBOARD').
 * @param {string} mode - 'floating', 'cinematic', or 'docked'.
 * @param {string} layout - 'anchor-bottom', 'zone-push', etc. (Handles positioning physics).
 */
export const GlitchBot = ({ 
  currentContext = "APP", 
  mode = "floating", 
  layout = "anchor-bottom" 
}) => {
  // State for managing the dialogue matrix
  const [isOpen, setIsOpen] = useState(false);
  const [activeDialogue, setActiveDialogue] = useState(null);

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
    // Logic for lifting state to the Lab Tab will go here
    console.log("🔥 GLITCHBOT CAPTURED FEEDBACK:", feedbackData);
    
    setIsOpen(false);
    setActiveDialogue(null);
  };

  // Cinematic mode automatically hides diagnostic HUD
  const showBadge = mode !== "cinematic";

  return (
    <div className={`glitchbot-wrapper mode-${mode} layout-${layout}`}>
      {isOpen && (
        <DialogueMenu 
            currentContext={currentContext} 
            activeDialogue={activeDialogue} 
            onReactionClick={handleReactionClick}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
      )}
      <BotCore 
        onClick={handleToggle} 
        showBadge={showBadge}
        scale={mode === "cinematic" ? "large" : "normal"}
      />
    </div>
  );
};