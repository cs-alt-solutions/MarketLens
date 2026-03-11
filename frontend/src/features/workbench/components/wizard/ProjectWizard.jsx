/* src/features/workbench/components/wizard/ProjectWizard.jsx */
import React, { useState } from 'react';
import './ProjectWizard.css';
import { WizardStepper } from './WizardStepper';
import { Step0Intro } from './Step0Intro';
import { Step1Identity } from './Step1Identity';
import { Step2Product } from './Step2Product';
import { Step3Fulfillment } from './Step3Fulfillment';

export const ProjectWizard = ({ onClose, onSave }) => {
  // 🚀 Start at Step 0 to trigger the Activation Hub / Intro
  const [currentStep, setCurrentStep] = useState(0);
  
  // The master payload that gathers data across all steps
  const [localProject, setLocalProject] = useState({
    collectionId: '',
    subCollection: '',
    productType: '',
    productFormat: '',
    title: '',
    recipe: []
  });

  // Centralized update function passed down to all steps
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
     <div className="modal-backdrop flex-center">
        <div className="wizard-window-size animate-fade-in">
           <div className="wizard-frame">
              
              {/* 🚀 Hide the Stepper on the Intro Screen */}
              {currentStep > 0 && <WizardStepper currentStep={currentStep} />}

              {/* THE ROUTER */}
              <div className="wizard-body mt-10">
                 {currentStep === 0 && (
                    <Step0Intro onNext={() => setCurrentStep(1)} />
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

              {/* 🚀 Hide the Footer Bar on the Intro Screen (Step 0 handles its own nav) */}
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