/* src/features/workbench/components/wizard/WizardStepper.jsx */
import React from 'react';
import { TERMINOLOGY } from '../../../../utils/glossary';
import './WizardStepper.css'; // Ensure CSS is explicitly imported!

export const WizardStepper = ({ currentStep }) => {
  const steps = [
    { id: 1, label: TERMINOLOGY.WIZARD.STEP_1 },
    { id: 2, label: TERMINOLOGY.WIZARD.STEP_2 },
    { id: 3, label: TERMINOLOGY.WIZARD.STEP_3 },
    { id: 4, label: TERMINOLOGY.WIZARD.STEP_4 }
  ];

  // Calculate fill width safely (0%, 33%, 66%, 100%)
  const fillWidth = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="wizard-stepper">
      
      {/* Background Track */}
      <div className="stepper-track"></div>
      
      {/* Active Fill Line */}
      <div 
        className="stepper-fill" 
        style={{ width: `${Math.max(0, Math.min(100, fillWidth))}%` }}
      ></div>

      {steps.map((s) => {
        const isActive = currentStep >= s.id; // Past or present
        const isCurrent = currentStep === s.id; // Exactly this step
        
        return (
            <div key={s.id} className="stepper-node">
              <div className={`step-circle ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                  {s.id}
              </div>
              <span className={`step-label ${isActive ? 'text-neon-teal font-bold' : 'text-muted'}`}>
                  {s.label}
              </span>
            </div>
        );
      })}
    </div>
  );
};