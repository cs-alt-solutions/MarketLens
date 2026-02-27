/* src/components/feedback/BootScreen.jsx */
import React, { useState, useEffect } from 'react';
import { TERMINOLOGY } from '../../utils/glossary';
import './BootScreen.css';

import { BotCautionTape } from '../../packages/beta-engine/components/BotCautionTape';
// NEW: Import the standalone Onboarding component
import { BetaOnboarding } from '../../packages/beta-engine/components/BetaOnboarding';

export const BootScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('landing');
  const [status, setStatus] = useState(TERMINOLOGY.BOOT.KERNEL);
  const [isExiting, setIsExiting] = useState(false); 

  useEffect(() => {
    if (phase === 'loading') {
      const timer1 = setTimeout(() => setStatus(TERMINOLOGY.BOOT.SECURE), 800);
      const timer2 = setTimeout(() => setStatus(TERMINOLOGY.BOOT.ASSETS), 1600);
      const timer3 = setTimeout(() => setStatus(TERMINOLOGY.BOOT.GRANTED), 2400);
      
      const timer4 = setTimeout(() => setIsExiting(true), 3200); 
      const timer5 = setTimeout(() => onComplete(), 4000); 

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    }
  }, [phase, onComplete]);

  return (
    <div className={`boot-container ${isExiting ? 'fade-out-main' : ''}`}>
      <div className="ambient-glow bg-splatter-1"></div>
      <div className="ambient-glow bg-splatter-2"></div>
      
      {/* PHASE 1: THE FRONT DOOR */}
      {phase === 'landing' && (
        <div className="pulse-center animate-fade-in text-center z-layer-top">
          <h1 className="boot-logo text-teal mb-15">
            <span className="shift-effect" data-text={TERMINOLOGY.GENERAL.APP_NAME.split(' ')[0]}>
              {TERMINOLOGY.GENERAL.APP_NAME.split(' ')[0]}
            </span> 
            {' ' + TERMINOLOGY.GENERAL.APP_NAME.split(' ').slice(1).join(' ')}
          </h1>
          <p className="boot-tagline font-mono mb-15">
            {TERMINOLOGY.GENERAL.TAGLINE}
          </p>
          <p className="boot-subtitle text-muted mb-30">
            BY ALTERNATIVE SOLUTIONS
          </p>
          
          <BotCautionTape>
             <button className="btn-primary boot-enter-btn glow-teal font-bold font-mono" onClick={() => setPhase('agreement')}>
               ENTER WORKSPACE
             </button>
          </BotCautionTape>
        </div>
      )}

      {/* PHASE 2: THE BETA ONBOARDING (NOW 100% ENCAPSULATED!) */}
      {phase === 'agreement' && (
        <BetaOnboarding onComplete={() => setPhase('loading')} />
      )}

      {/* PHASE 3: THE LOADING SEQUENCE */}
      {phase === 'loading' && (
        <div className="pulse-center animate-fade-in z-layer-top">
          <div className="glow-ring"></div>
          <div className="system-status font-mono">{status}</div>
        </div>
      )}

    </div>
  );
};