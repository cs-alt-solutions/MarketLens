/* src/packages/beta-engine/components/BetaOnboarding.jsx */
import React, { useState } from 'react';
import { GLITCHBOT_DICT } from '../dictionary';
import { BotCore } from './BotCore';
import './BetaOnboarding.css';

export const BetaOnboarding = ({ onComplete }) => {
  const [hasAgreed, setHasAgreed] = useState(false);
  const { AGREEMENT } = GLITCHBOT_DICT;

  return (
    <div className="beta-onboarding-overlay z-layer-top">
      
      <div className="beta-push-wrapper">
        
        {/* The Bot physically pushing the card */}
        <div className="pushing-bot">
           <BotCore scale="large" interactive={false} />
        </div>

        {/* The Encapsulated VIP Card */}
        <div className="beta-glass-card">
          <div className="flex-center flex-col mb-25 text-center">
             <span className="badge-purple mb-10">{AGREEMENT.VERSION}</span>
             <h2 className="text-main m-0 font-light letter-spacing-1">{AGREEMENT.TITLE}</h2>
             <p className="text-teal font-mono font-small mt-10 letter-spacing-1">
               {AGREEMENT.SUBTITLE}
             </p>
          </div>
          
          <div className="vip-card-grid mb-30">
            {AGREEMENT.CARDS.map(card => (
               <div key={card.id} className={`vip-card border-${card.color}`}>
                 <span className={`vip-card-title text-${card.color}`}>{card.title}</span>
                 <span className="vip-card-text">{card.text}</span>
               </div>
            ))}
          </div>
          
          <label className="neon-checkbox-container mb-25">
            <input 
              type="checkbox" 
              checked={hasAgreed} 
              onChange={(e) => setHasAgreed(e.target.checked)} 
            />
            <span className="neon-checkmark"></span>
            <span className="neon-checkbox-text">{AGREEMENT.CONFIRMATION}</span>
          </label>

          <button 
            className={`btn-primary w-full py-15 font-bold letter-spacing-2 transition-all ${hasAgreed ? 'glow-teal' : 'btn-disabled'}`} 
            onClick={onComplete}
            disabled={!hasAgreed}
          >
            {hasAgreed ? AGREEMENT.BTN_READY : AGREEMENT.BTN_PENDING}
          </button>
        </div>

      </div>
    </div>
  );
};