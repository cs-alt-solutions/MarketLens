/* src/features/workbench/components/wizard/ProjectWizard.jsx */
import React, { useState } from 'react';
import './ProjectWizard.css';
import { useInventory } from '../../../../context/InventoryContext';
import { useProjectEconomics } from '../../hooks/useProjectEconomics';

// 🚀 Pulling in our official SVG instead of a text 'X'
import { CloseIcon } from '../../../../components/Icons'; 

import { WizardStepper } from './WizardStepper';
import { Step1Identity } from './Step1Identity';
import { Step2Product } from './Step2Product';
import { Step3Fulfillment } from './Step3Fulfillment';
import { Step4CheckIn } from './Step4CheckIn';

export const ProjectWizard = ({ project, onClose }) => {
  const { addProject, updateProject, materials } = useInventory();
  const [step, setStep] = useState(1);
  const [localProject, setLocalProject] = useState({ 
    ...project, 
    status: project.status || 'idea',
    recipe: project.recipe || [],
    economics: project.economics || { targetRetail: project.retailPrice || 0 }
  });

  // Track completeness checkpoints
  const [hasAllCore, setHasAllCore] = useState(false);
  const [hasAllPackaging, setHasAllPackaging] = useState(false);

  // Python Engine Connection
  const economics = useProjectEconomics(localProject);

  const handleUpdate = (field, value, subField = null) => {
    if (subField) {
      setLocalProject(prev => ({
        ...prev,
        [field]: { ...prev[field], [subField]: value }
      }));
    } else {
      setLocalProject(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFinish = () => {
    const finalProject = {
      ...localProject,
      retailPrice: localProject.economics?.targetRetail || 0
    };
    
    if (finalProject.isNew) {
      delete finalProject.isNew;
      addProject(finalProject);
    } else {
      updateProject(finalProject);
    }
    onClose();
  };

  return (
    /* Added onClick={onClose} to overlay for standard modal behavior */
    <div className="modal-overlay" onClick={onClose}>
      
      {/* Added animate-fade-in to match our other modals, and stopPropagation so clicking inside doesn't close it */}
      <div className="modal-window blueprint-window-size flex-col animate-fade-in" onClick={e => e.stopPropagation()}>
        
        {/* 🚀 STANDARDIZED HEADER: No inline styles. Perfectly balanced using flex-between. */}
        <div className="bg-panel-header p-20 border-bottom-subtle flex-between align-center">
          <div className="invisible"><CloseIcon /></div> {/* Invisible spacer to ensure absolute center */}
          
          <WizardStepper step={step} />
          
          <button className="btn-icon-hover-clean" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="blueprint-body bg-app p-30 flex-center flex-1">
          {step === 1 && <Step1Identity localProject={localProject} handleUpdate={handleUpdate} />}
          {step === 2 && <Step2Product localProject={localProject} handleUpdate={handleUpdate} materials={materials} hasAllCore={hasAllCore} setHasAllCore={setHasAllCore} />}
          {step === 3 && <Step3Fulfillment localProject={localProject} handleUpdate={handleUpdate} materials={materials} hasAllPackaging={hasAllPackaging} setHasAllPackaging={setHasAllPackaging} />}
          {step === 4 && <Step4CheckIn localProject={localProject} handleUpdate={handleUpdate} economics={economics} hasAllCore={hasAllCore} hasAllPackaging={hasAllPackaging} />}
        </div>

        <div className="bg-panel-header p-20 border-top-subtle flex-between">
          <button className={`btn-ghost ${step === 1 ? 'invisible' : ''}`} onClick={() => setStep(step - 1)}>
            &larr; BACK
          </button>
          
          {step < 4 ? (
            <button className="btn-primary" onClick={() => setStep(step + 1)} disabled={step === 1 && !localProject.title}>
              NEXT STEP &rarr;
            </button>
          ) : (
            <button className="btn-activate glow-teal" onClick={handleFinish} disabled={economics?.isCalculating}>
              CONFIRM & SAVE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};