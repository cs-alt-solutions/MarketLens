/* src/features/workbench/components/wizard/Step0Intro.jsx */
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
          <button className="intro-card fast-card" onClick={() => setShowConstruction(true)}>
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
        
        <div className="flex-center w-full" style={{ marginTop: '60px' }}>
            <button className="btn-ghost" onClick={onClose}>
                {TERMINOLOGY.GENERAL.CANCEL}
            </button>
        </div>
      </div>

      {/* 🚀 REACT PORTAL: Teleports the overlay directly to the <body> tag */}
      {showConstruction && createPortal(
        <div className="global-construction-overlay" onClick={() => setShowConstruction(false)}>
            <div onClick={(e) => e.stopPropagation()} className="global-construction-wrapper">
                <ConstructionZone 
                    title={MESSAGES.MODULE_OFFLINE_TITLE} 
                    message={MESSAGES.MODULE_OFFLINE_DESC}
                />
                <button 
                  className="btn-construction mt-20" /* 🚀 THE NEW NEON ORANGE BUTTON */
                  style={{ width: '220px' }}
                  onClick={() => setShowConstruction(false)}
                >
                    {TERMINOLOGY.GENERAL.CONFIRM}
                </button>
            </div>
        </div>,
        document.body
      )}

    </div>
  );
};