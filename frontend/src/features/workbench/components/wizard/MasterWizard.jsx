/* src/features/workbench/components/wizard/MasterWizard.jsx */
import React, { useState } from 'react';
import { Step0Intro } from './Step0Intro';
import { ProjectWizard } from './project/ProjectWizard';
import { SupplyWizard } from './supply/SupplyWizard';
import './project/ProjectWizard.css'; 

export const MasterWizard = ({ onClose, onSaveProject, initialFlow = null }) => {
  const [flow, setFlow] = useState(initialFlow); 

  // 🚀 ROUTING ENGINES
  if (flow === 'project') {
    return <ProjectWizard onClose={onClose} onSave={onSaveProject} />;
  }

  if (flow === 'supply') {
    return <SupplyWizard onClose={onClose} />;
  }

  // 🚪 DEFAULT: THE UNIVERSAL HUB (Step 0)
  return (
     <div className="modal-overlay" onClick={onClose}>
        <div className="wizard-window-size animate-fade-in" onClick={(e) => e.stopPropagation()}>
           <div className="wizard-frame">
              <Step0Intro 
                 onNext={() => setFlow('project')} 
                 onSupply={() => setFlow('supply')} 
                 onClose={onClose} 
              />
           </div>
        </div>
     </div>
  );
};