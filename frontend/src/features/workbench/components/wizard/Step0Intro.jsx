/* src/features/workbench/components/wizard/Step0Intro.jsx */
import React, { useState } from 'react';
import { TERMINOLOGY } from '../../../../utils/glossary';

export const Step0Intro = ({ onNext }) => {
  // 'selection' = showing the two cards | 'slides' = showing the tutorial
  const [view, setView] = useState('selection');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: TERMINOLOGY.WIZARD_INTRO.SLIDE_1_TITLE,
      desc: TERMINOLOGY.WIZARD_INTRO.SLIDE_1_DESC,
      icon: "⚡"
    },
    {
      title: TERMINOLOGY.WIZARD_INTRO.SLIDE_2_TITLE,
      desc: TERMINOLOGY.WIZARD_INTRO.SLIDE_2_DESC,
      icon: "🛠️"
    },
    {
      title: TERMINOLOGY.WIZARD_INTRO.SLIDE_3_TITLE,
      desc: TERMINOLOGY.WIZARD_INTRO.SLIDE_3_DESC,
      icon: "📦"
    }
  ];

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      // Finished the slides, drop them into Step 1
      onNext();
    }
  };

  return (
    <div className="flex-col h-full animate-fade-in w-full flex-center pb-30">
      
      {view === 'selection' && (
        <div className="intro-gate-container animate-fade-in flex-col align-center">
          <h2 className="text-neon-teal wizard-title-large text-center mb-10">
              {TERMINOLOGY.WIZARD_INTRO.TITLE}
          </h2>
          <p className="text-muted wizard-subtitle text-center mb-30">
              {TERMINOLOGY.WIZARD_INTRO.SUBTITLE}
          </p>

          <div className="intro-card-grid">
            {/* The Guided Path */}
            <button 
              className="intro-card guided-card"
              onClick={() => setView('slides')}
            >
              <div className="intro-icon-wrapper">🧭</div>
              <span className="font-bold block mt-15 mb-10 text-large">
                  {TERMINOLOGY.WIZARD_INTRO.CARD_GUIDED_TITLE}
              </span>
              <span className="text-muted text-small">
                  {TERMINOLOGY.WIZARD_INTRO.CARD_GUIDED_DESC}
              </span>
            </button>

            {/* The Fast Track Path */}
            <button 
              className="intro-card fast-card"
              onClick={onNext} // Immediately skips to Step 1!
            >
              <div className="intro-icon-wrapper">🚀</div>
              <span className="font-bold block mt-15 mb-10 text-large">
                  {TERMINOLOGY.WIZARD_INTRO.CARD_FAST_TITLE}
              </span>
              <span className="text-muted text-small">
                  {TERMINOLOGY.WIZARD_INTRO.CARD_FAST_DESC}
              </span>
            </button>
          </div>
        </div>
      )}

      {view === 'slides' && (
        <div className="intro-slide-container animate-fade-in flex-col align-center">
          
          <div className="slide-content-box flex-col flex-center text-center">
            <div className="slide-icon-massive mb-20 animate-pop-in">
                {slides[currentSlide].icon}
            </div>
            <h3 className="label-prompt-large">
                {slides[currentSlide].title}
            </h3>
            <p className="text-muted font-large max-w-500 line-height-relaxed">
                {slides[currentSlide].desc}
            </p>
          </div>

          {/* Slide Pagination & Controls */}
          <div className="slide-controls mt-30 flex-col align-center w-full">
            <div className="pagination-dots flex-center gap-10 mb-20">
              {slides.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`dot ${idx === currentSlide ? 'active' : ''}`}
                />
              ))}
            </div>
            
            <button className="btn-primary btn-large w-full max-w-300" onClick={handleNextSlide}>
              {currentSlide === slides.length - 1 ? "LET'S BUILD" : "NEXT"}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};