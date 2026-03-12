/* src/features/workbench/components/wizard/supply/SupplyWizard.jsx */
import React, { useState } from 'react';
import { Step1Details } from './Step1Details';
import { Step2Finance } from './Step2Finance';
import { TERMINOLOGY } from '../../../../../utils/glossary';
import '../project/ProjectWizard.css'; // Steal the layout frame from the Project Wizard

export const SupplyWizard = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // 🚀 The Master State for new Inventory
  const [localSupply, setLocalSupply] = useState({
    name: '',
    category: '',
    format: '', 
    vendorId: null,
    totalCost: 0,
    unitsReceived: 1
  });

  const handleUpdate = (field, value) => {
    setLocalSupply(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleComplete = () => {
    // We will wire this to the InventoryContext later
    console.log("Inventory Logged:", localSupply);
    onClose();
  };

  return (
     <div className="modal-overlay">
        <div className="wizard-window-size animate-fade-in">
           <div className="wizard-frame">
              
              {/* 🚀 MINI STEPPER FOR INTAKE */}
              <div className="flex-center gap-15 mb-20 mt-10">
                 <div className="flex-center gap-10">
                    <div className={`step-badge ${currentStep >= 1 ? 'active' : ''}`}>1</div>
                    <span className={`font-mono text-small tracking-wide ${currentStep >= 1 ? 'text-main' : 'text-muted'}`}>ASSET DETAILS</span>
                 </div>
                 <div style={{ width: '40px', height: '1px', background: 'var(--border-subtle)' }}></div>
                 <div className="flex-center gap-10">
                    <div className={`step-badge ${currentStep >= 2 ? 'active' : ''}`}>2</div>
                    <span className={`font-mono text-small tracking-wide ${currentStep >= 2 ? 'text-main' : 'text-muted'}`}>FINANCE & QTY</span>
                 </div>
              </div>

              <div className="wizard-body mt-10">
                 {currentStep === 1 && (
                    <Step1Details localSupply={localSupply} handleUpdate={handleUpdate} />
                 )}
                 {currentStep === 2 && (
                    <Step2Finance localSupply={localSupply} handleUpdate={handleUpdate} />
                 )}
              </div>

              <div className="wizard-footer-bar">
                 <button className="btn-secondary" onClick={onClose}>
                     {TERMINOLOGY.GENERAL.CANCEL}
                 </button>
                 
                 <div className="flex-center gap-15">
                    {currentStep > 1 && (
                       <button className="btn-secondary" onClick={handleBack}>
                           BACK
                       </button>
                    )}
                    
                    {currentStep < 2 ? (
                       <button className="btn-primary" onClick={handleNext}>
                           CONTINUE
                       </button>
                    ) : (
                       <button className="btn-primary" onClick={handleComplete}>
                           LOG ASSET
                       </button>
                    )}
                 </div>
              </div>

           </div>
        </div>
     </div>
  );
};