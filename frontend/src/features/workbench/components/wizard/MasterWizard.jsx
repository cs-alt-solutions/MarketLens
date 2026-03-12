/* src/features/workbench/components/wizard/MasterWizard.jsx */
import React, { useState } from 'react';
import { Step0Intro } from './Step0Intro';
import { ProjectWizard } from './project/ProjectWizard';
import { SupplyWizard } from './supply/SupplyWizard';
import './project/ProjectWizard.css'; // Pulling in the frame sizing

export const MasterWizard = ({ onClose, onSaveProject, initialFlow = null }) => {
  const [flow, setFlow] = useState(initialFlow); // null, 'project', or 'supply'

  // 🚀 ROUTING ENGINES
  if (flow === 'project') {
    return <ProjectWizard onClose={onClose} onSave={onSaveProject} />;
  }

  if (flow === 'supply') {
    return <SupplyWizard onClose={onClose} />;
  }

  // 🚪 DEFAULT: THE UNIVERSAL HUB (Step 0)
  return (
     <div className="modal-overlay">
        <div className="wizard-window-size animate-fade-in">
           <div className="wizard-frame">
              <Step0Intro 
                 onNext={() => setFlow('project')} 
                 onSupply={() => setFlow('supply')} // 🚀 New prop!
                 onClose={onClose} 
              />
           </div>
        </div>
     </div>
  );
};