/* src/components/feedback/BootScreen.jsx */
import React, { useState, useEffect } from 'react';
import { TERMINOLOGY } from '../../utils/glossary';
import './BootScreen.css';

export const BootScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('landing');
  const [status, setStatus] = useState(TERMINOLOGY.BOOT.KERNEL);
  const [isExiting, setIsExiting] = useState(false); 

  useEffect(() => {
    if (phase === 'loading') {
      const timers = [
        setTimeout(() => setStatus(TERMINOLOGY.BOOT.SECURE), 800),
        setTimeout(() => setStatus(TERMINOLOGY.BOOT.ASSETS), 1600),
        setTimeout(() => setStatus(TERMINOLOGY.BOOT.GRANTED), 2400),
        setTimeout(() => setIsExiting(true), 3200),
        setTimeout(() => onComplete(), 4000)
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [phase, onComplete]);

  return (
    <div className={`boot-container ${isExiting ? 'fade-out-main' : ''}`}>
      <div className="ambient-glow bg-splatter-1"></div>
      
      {phase === 'landing' && (
        <div className="pulse-center animate-fade-in z-layer-top flex-col flex-center text-center">
          
          <div className="boot-brand-column">
            <h1 className="boot-logo text-teal mb-15">{TERMINOLOGY.GENERAL.APP_NAME}</h1>
            <p className="boot-tagline font-mono mb-30">{TERMINOLOGY.GENERAL.TAGLINE}</p>
            
            <button 
                className="btn-primary boot-enter-btn glow-teal font-bold font-mono" 
                onClick={() => setPhase('loading')}
            >
                ENTER WORKSPACE
            </button>
          </div>

        </div>
      )}

      {phase === 'loading' && (
        <div className="pulse-center animate-fade-in text-center z-layer-top">
          <div className="glow-ring"></div>
          <div className="system-status font-mono">{status}...</div>
        </div>
      )}
    </div>
  );
};