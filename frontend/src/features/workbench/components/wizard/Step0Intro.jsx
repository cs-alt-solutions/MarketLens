/* src/features/workbench/components/wizard/Step0Intro.jsx */
import React, { useState } from 'react';
import { WorkshopIcon, Box, Finance } from '../../../../components/Icons';
import { TERMINOLOGY, MESSAGES } from '../../../../utils/glossary';
import { ConstructionZone } from '../../../../components/ui/ConstructionZone';

export const Step0Intro = ({ onNext, onClose }) => {
  const [showConstruction, setShowConstruction] = useState(false);

  return (
    <div className="flex-col h-full animate-fade-in w-full flex-center pb-30 relative">
      
      <div className="intro-gate-container animate-fade-in flex-col align-center">
        <h2 className="text-neon-teal wizard-title-large text-center mb-10">
            {TERMINOLOGY.WIZARD_INTRO.TITLE}
        </h2>
        <p className="text-muted wizard-subtitle text-center mb-30">
            {TERMINOLOGY.WIZARD_INTRO.SUBTITLE}
        </p>

        <div className="intro-card-grid">
          {/* PATH A: THE SPARK (Project Builder) */}
          <button className="intro-card guided-card" onClick={onNext}>
            <div className="intro-icon-wrapper text-neon-teal">
                <WorkshopIcon />
            </div>
            <span className="font-bold block text-large mb-10">
                {TERMINOLOGY.WIZARD_INTRO.CARD_GUIDED_TITLE}
            </span>
            <span className="text-muted text-small line-height-relaxed">
                {TERMINOLOGY.WIZARD_INTRO.CARD_GUIDED_DESC}
            </span>
          </button>

          {/* PATH B: INVENTORY INTAKE */}
          <button className="intro-card fast-card" onClick={() => {
              // Connects to Inventory Intake later.
              setShowConstruction(true);
          }}>
            <div className="intro-icon-wrapper text-purple">
                <Box />
            </div>
            <span className="font-bold block text-large mb-10">
                {TERMINOLOGY.WIZARD_INTRO.CARD_FAST_TITLE}
            </span>
            <span className="text-muted text-small line-height-relaxed">
                {TERMINOLOGY.WIZARD_INTRO.CARD_FAST_DESC}
            </span>
          </button>

          {/* PATH C: FINANCE INTAKE */}
          <button className="intro-card finance-card" onClick={() => setShowConstruction(true)}>
            <div className="coming-soon-badge">COMING SOON</div>
            <div className="intro-icon-wrapper text-orange">
                <Finance />
            </div>
            <span className="font-bold block text-large mb-10">
                {TERMINOLOGY.WIZARD_INTRO.CARD_FINANCE_TITLE}
            </span>
            <span className="text-muted text-small line-height-relaxed">
                {TERMINOLOGY.WIZARD_INTRO.CARD_FINANCE_DESC}
            </span>
          </button>
        </div>
        
        <button className="btn-ghost mt-30" onClick={onClose}>
            {TERMINOLOGY.GENERAL.CANCEL}
        </button>
      </div>

      {/* 🚀 THE NUCLEAR CENTERING OPTION */}
      {showConstruction && (
          <div 
            className="modal-overlay flex-center flex-col" 
            style={{ 
                position: 'fixed', /* Changed to fixed to cover the whole modal */
                inset: 0, 
                zIndex: 200, 
                background: 'rgba(9, 9, 11, 0.85)', /* Darker to hide the background shift */
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            onClick={() => setShowConstruction(false)}
          >
              <div onClick={(e) => e.stopPropagation()} className="flex-col flex-center">
                  <ConstructionZone 
                      title={MESSAGES.MODULE_OFFLINE_TITLE} 
                      message={MESSAGES.MODULE_OFFLINE_DESC}
                  />
                  
                  {/* Button sits naturally below the card now */}
                  <button 
                    className="btn-primary mt-20" 
                    style={{ width: '200px' }}
                    onClick={() => setShowConstruction(false)}
                  >
                      {TERMINOLOGY.GENERAL.CONFIRM}
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};