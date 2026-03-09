/* src/features/workbench/components/wizard/WizardStepper.jsx */
import React from 'react';

export const WizardStepper = ({ step }) => {
  const steps = [
    { id: 1, label: 'Identity' },
    { id: 2, label: 'Product' },
    { id: 3, label: 'Fulfillment' },
    { id: 4, label: 'Check-In' }
  ];

  return (
    <div className="wizard-stepper mt-10 w-full max-w-600 flex-between position-relative">
      <div className="stepper-track"></div>
      <div className="stepper-fill" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>

      {steps.map((s) => (
        <div key={s.id} className="stepper-node flex-col flex-center z-layer-top">
          <div className={`step-circle ${step >= s.id ? 'active' : ''}`}>{s.id}</div>
          <span className={`step-label mt-10 ${step >= s.id ? 'text-neon-teal font-bold' : 'text-muted'}`}>{s.label}</span>
        </div>
      ))}
    </div>
  );
};