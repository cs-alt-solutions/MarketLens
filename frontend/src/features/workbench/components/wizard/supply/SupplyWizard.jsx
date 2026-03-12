/* src/features/workbench/components/wizard/supply/SupplyWizard.jsx */
import React from 'react';
import { ConstructionZone } from '../../../../../components/ui/ConstructionZone';
import { TERMINOLOGY } from '../../../../../utils/glossary';
import '../project/ProjectWizard.css'; 

export const SupplyWizard = ({ onClose }) => {
  return (
     <div className="modal-overlay">
        <div className="wizard-window-size animate-fade-in bg-panel border-radius-2 p-20 flex-col flex-center">
           <div className="mb-20">
             <ConstructionZone />
           </div>
           
           <div className="flex-center mt-20">
               <button className="btn-secondary" onClick={onClose}>
                   {TERMINOLOGY.GENERAL.CLOSE}
               </button>
           </div>
        </div>
     </div>
  );
};