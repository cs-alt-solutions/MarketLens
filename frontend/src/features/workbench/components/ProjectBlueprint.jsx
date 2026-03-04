/* src/features/workbench/components/ProjectBlueprint.jsx */
import React, { useState } from 'react';
import './ProjectBlueprint.css';
import { useInventory } from '../../../context/InventoryContext';

// FIX: Pointing to the new dedicated hook file!
import { useProjectEconomics } from '../hooks/useProjectEconomics';

import { EngineeringPanel } from './EngineeringPanel';
import { BrandingPanel } from './BrandingPanel';
import { TERMINOLOGY } from '../../../utils/glossary';
import { Save, WorkshopIcon } from '../../../components/Icons';

export const ProjectBlueprint = ({ project, onClose }) => {
  const { updateProject, materials } = useInventory();
  
  const [activeTab, setActiveTab] = useState('BUILD'); 
  const [localProject, setLocalProject] = useState({
    ...project,
    status: project.status || 'idea', 
    instructions: project.instructions || [],
    brand_specs: project.brand_specs || { label_size: '', finish: '', font_main: '', hex_code: '#ffffff', notes: '' },
    economics: project.economics || { shippingCost: 0, platformFeePercent: 6.5, platformFixedFee: 0.20, targetRetail: project.retailPrice || 0 }
  });
  
  const { materialCost, platformFees, netProfit, marginPercent } = useProjectEconomics(localProject);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedMatId, setSelectedMatId] = useState('');
  const [reqQty, setReqQty] = useState('');
  const [newStep, setNewStep] = useState('');

  const handleUpdate = (field, value, subField = null) => {
      setIsDirty(true);
      if (subField) {
          setLocalProject(prev => ({
              ...prev,
              [field]: { ...prev[field], [subField]: value }
          }));
      } else {
          setLocalProject(prev => ({ ...prev, [field]: value }));
      }
  };

  const handleSave = () => {
    const projectToSave = {
      ...localProject,
      retailPrice: localProject.economics?.targetRetail || 0
    };
    updateProject(projectToSave);
    setIsDirty(false);
    onClose(); 
  };

  // --- THE SAFETY NET ---
  const handleSafeClose = () => {
    if (isDirty) {
      const confirmDiscard = window.confirm(
        "WARNING: You have unsaved changes!\n\nAre you sure you want to close and lose your work?"
      );
      if (confirmDiscard) {
        onClose();
      }
    } else {
      onClose(); 
    }
  };

  const missingRequirements = [];
  if (!localProject.title || localProject.title.trim() === '') missingRequirements.push(TERMINOLOGY.BLUEPRINT.REQ_TITLE);
  if (!localProject.recipe || localProject.recipe.length === 0) missingRequirements.push(TERMINOLOGY.BLUEPRINT.REQ_BOM);
  if (!localProject.instructions || localProject.instructions.length === 0) missingRequirements.push(TERMINOLOGY.BLUEPRINT.REQ_SOP);
  if (!localProject.economics?.targetRetail || localProject.economics.targetRetail <= 0) missingRequirements.push(TERMINOLOGY.BLUEPRINT.REQ_PRICE);

  const isReadyToLaunch = missingRequirements.length === 0;
  
  const isIdea = localProject.status === 'idea';
  const isDraft = localProject.status === 'draft';
  const isPreLaunch = isIdea || isDraft;

  const handleActivate = () => {
    if (!isReadyToLaunch) return;
    
    const activatedProject = {
      ...localProject,
      status: 'active',
      retailPrice: localProject.economics?.targetRetail || 0
    };
    
    updateProject(activatedProject);
    onClose(); 
  };

  const addStep = () => {
    if (!newStep.trim()) return;
    handleUpdate('instructions', [...localProject.instructions, newStep.trim()]);
    setNewStep('');
  };

  const removeStep = (index) => {
    const updated = localProject.instructions.filter((_, i) => i !== index);
    handleUpdate('instructions', updated);
  };

  return (
    <div className="modal-overlay" onClick={handleSafeClose}>
      
      <div className="modal-window blueprint-window-size animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="blueprint-header">
           <div className="bp-top-bar pad-20 flex-between border-bottom-subtle">
               
               <div className="flex-center w-full max-w-500">
                  <WorkshopIcon />
                  <div className="flex-col ml-10 w-full">
                      <input 
                        className="input-chromeless font-large font-bold w-full"
                        placeholder="ENTER PROJECT TITLE..."
                        value={localProject.title || ''}
                        onChange={(e) => handleUpdate('title', e.target.value)}
                      />
                      
                      {isPreLaunch && (
                          <div className="flex mt-5 gap-10">
                              <span 
                                className={`clickable font-mono font-small transition ${isIdea ? 'text-purple font-bold' : 'text-muted'}`}
                                onClick={() => handleUpdate('status', 'idea')}
                              >
                                [ PHASE: IDEA ]
                              </span>
                              <span 
                                className={`clickable font-mono font-small transition ${isDraft ? 'text-warning font-bold' : 'text-muted'}`}
                                onClick={() => handleUpdate('status', 'draft')}
                              >
                                [ PHASE: DRAFT ]
                              </span>
                          </div>
                      )}
                  </div>
               </div>

               <div className="flex-center gap-15">
                  
                  {isPreLaunch && (
                    <div className="gatekeeper-status mr-10 flex-center">
                      {isReadyToLaunch ? (
                        <button className="btn-activate glow-teal" onClick={handleActivate}>
                          {TERMINOLOGY.BLUEPRINT.ACTIVATE_PROJECT}
                        </button>
                      ) : (
                        <div className="text-right">
                          <div className="font-mono font-small text-muted">{TERMINOLOGY.BLUEPRINT.MISSING_REQS}</div>
                          <div className="font-mono font-small text-warning font-bold">
                            {missingRequirements.join(' • ')}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-left-subtle pl-15 flex-center gap-10">
                    {isDirty && <span className="text-warning font-small italic mr-10">Unsaved Changes</span>}
                    <button className="btn-ghost" onClick={handleSafeClose}>{TERMINOLOGY.GENERAL.CANCEL}</button>
                    <button className="btn-primary" onClick={handleSave}><Save /> {TERMINOLOGY.GENERAL.SAVE}</button>
                  </div>

               </div>
           </div>
           
           <div className="tab-container">
               <div className={`tab-item ${activeTab === 'BUILD' ? 'active' : ''}`} onClick={() => setActiveTab('BUILD')}>{TERMINOLOGY.BLUEPRINT.PHASE_BUILD}</div>
               <div className={`tab-item ${activeTab === 'LAUNCH' ? 'active' : ''}`} onClick={() => setActiveTab('LAUNCH')}>{TERMINOLOGY.BLUEPRINT.PHASE_LAUNCH}</div>
           </div>
        </div>
        
        <div className="blueprint-body bg-app p-20">
            {activeTab === 'BUILD' ? (
                <EngineeringPanel 
                    localProject={localProject}
                    materials={materials}
                    handleUpdate={handleUpdate}
                    selectedMatId={selectedMatId}
                    setSelectedMatId={setSelectedMatId}
                    reqQty={reqQty}
                    setReqQty={setReqQty}
                    newStep={newStep}
                    setNewStep={setNewStep}
                    addStep={addStep}
                    removeStep={removeStep}
                />
            ) : (
                <BrandingPanel 
                    localProject={localProject}
                    handleUpdate={handleUpdate}
                    materialCost={materialCost}
                    platformFees={platformFees}
                    netProfit={netProfit}
                    marginPercent={marginPercent}
                />
            )}
        </div>
      </div>
    </div>
  );
};