/* src/features/workbench/components/wizard/ProjectWizard.jsx */
import React, { useState } from 'react';
import './ProjectWizard.css';
import { WizardStepper } from './WizardStepper';
import { Step0Intro } from './Step0Intro';
import { Step1Identity } from './Step1Identity';
import { Step2Product } from './Step2Product';
import { Step3Fulfillment } from './Step3Fulfillment';

// 🚀 defaults to 1 so the Workshop button skips the intro. The Dashboard will pass 0.
export const ProjectWizard = ({ onClose, onSave, initialStep = 1 }) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  
  const [localProject, setLocalProject] = useState({
    collectionId: '',
    subCollection: '',
    productType: '',
    productFormat: '',
    title: '',
    recipe: []
  });

  const handleUpdate = (field, value) => {
    setLocalProject(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleComplete = () => {
    if (onSave) onSave(localProject);
    onClose();
  };

  return (
     <div className="modal-overlay">
        <div className="wizard-window-size animate-fade-in">
           <div className="wizard-frame">
              
              {/* Stepper only shows for actual project creation steps */}
              {currentStep > 0 && <WizardStepper currentStep={currentStep} />}

              <div className="wizard-body mt-10">
                 {currentStep === 0 && (
                    <Step0Intro onNext={() => setCurrentStep(1)} onClose={onClose} />
                 )}
                 {currentStep === 1 && (
                    <Step1Identity localProject={localProject} handleUpdate={handleUpdate} onNext={handleNext} />
                 )}
                 {currentStep === 2 && (
                    <Step2Product localProject={localProject} handleUpdate={handleUpdate} />
                 )}
                 {currentStep === 3 && (
                    <Step3Fulfillment localProject={localProject} handleUpdate={handleUpdate} />
                 )}
                 {currentStep === 4 && (
                    <div className="flex-col flex-center h-full animate-fade-in">
                       <h2 className="label-prompt-large text-center">Step 4: Check-In</h2>
                       <p className="text-muted">Final Review & Profit Simulator coming next!</p>
                    </div>
                 )}
              </div>

              {/* Footer only shows for actual project creation steps */}
              {currentStep > 0 && (
                 <div className="wizard-footer-bar">
                    <button className="btn-secondary" onClick={onClose}>
                        CANCEL
                    </button>
                    
                    <div className="flex-center gap-15">
                       {currentStep > 1 && (
                          <button className="btn-secondary" onClick={handleBack}>
                              BACK
                          </button>
                       )}
                       
                       {currentStep < 4 ? (
                          <button className="btn-primary" onClick={handleNext}>
                              CONTINUE
                          </button>
                       ) : (
                          <button className="btn-primary" onClick={handleComplete}>
                              ACTIVATE PROJECT
                          </button>
                       )}
                    </div>
                 </div>
              )}

           </div>
        </div>
     </div>
  );
};