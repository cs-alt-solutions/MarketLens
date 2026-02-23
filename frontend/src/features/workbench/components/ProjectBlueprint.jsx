/* src/features/workbench/components/ProjectBlueprint.jsx - REFACTORED */
import React, { useState } from 'react';
import './ProjectBlueprint.css';
import { useInventory } from '../../../context/InventoryContext';
import { useProjectEconomics } from '../../../context/FinancialContext';
import { EngineeringPanel } from './EngineeringPanel';
import { BrandingPanel } from './BrandingPanel';
import { TERMINOLOGY } from '../../../utils/glossary';
import { Save, WorkshopIcon } from '../../../components/Icons';

export const ProjectBlueprint = ({ project, onClose }) => {
  const { updateProject, materials } = useInventory();
  const [activeTab, setActiveTab] = useState('BUILD'); 
  const [localProject, setLocalProject] = useState({
    ...project,
    instructions: project.instructions || [],
    brand_specs: project.brand_specs || { label_size: '', finish: '', font_main: '', hex_code: '#ffffff', notes: '' },
    economics: project.economics || { shippingCost: 0, platformFeePercent: 6.5, platformFixedFee: 0.20 }
  });
  
  const { materialCost, platformFees, netProfit, marginPercent } = useProjectEconomics(localProject);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedMatId, setSelectedMatId] = useState('');
  const [reqQty, setReqQty] = useState('');
  const [newStep, setNewStep] = useState('');

  const handleUpdate = (field, value, subField = null) => {
    setIsDirty(true);
    if (subField) {
      setLocalProject(prev => ({ ...prev, [field]: { ...prev[field], [subField]: value } }));
    } else {
      setLocalProject(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    updateProject(localProject);
    setIsDirty(false);
    onClose(); 
  };

  const addStep = () => {
    if (!newStep.trim()) return;
    handleUpdate('instructions', [...localProject.instructions, newStep.trim()]);
    setNewStep('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-window blueprint-window-size animate-fade-in">
        <div className="blueprint-header">
           <div className="bp-top-bar pad-20 flex-between border-bottom-subtle">
               <div className="flex-center w-full max-w-500">
                  <WorkshopIcon />
                  <input className="input-chromeless ml-10 font-large font-bold w-full" value={localProject.title} onChange={(e) => handleUpdate('title', e.target.value)} />
               </div>
               <div className="flex-center gap-10">
                  {isDirty && <span className="text-warning font-small italic mr-10">Unsaved Changes</span>}
                  <button className="btn-ghost" onClick={onClose}>{TERMINOLOGY.GENERAL.CANCEL}</button>
                  <button className="btn-primary" onClick={handleSave}><Save /> {TERMINOLOGY.GENERAL.SAVE}</button>
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
                    localProject={localProject} materials={materials} handleUpdate={handleUpdate} 
                    selectedMatId={selectedMatId} setSelectedMatId={setSelectedMatId} 
                    reqQty={reqQty} setReqQty={setReqQty} newStep={newStep} setNewStep={setNewStep} 
                    addStep={addStep} removeStep={(idx) => handleUpdate('instructions', localProject.instructions.filter((_, i) => i !== idx))} 
                />
            ) : (
                <BrandingPanel 
                    localProject={localProject} handleUpdate={handleUpdate} 
                    materialCost={materialCost} platformFees={platformFees} 
                    netProfit={netProfit} marginPercent={marginPercent} 
                />
            )}
        </div>
      </div>
    </div>
  );
};