/* src/features/workbench/components/wizard/ProjectConsole.jsx */
import React, { useState } from 'react';
import { useInventory } from '../../../../context/InventoryContext';
import { formatCurrency } from '../../../../utils/formatters';
import { TERMINOLOGY } from '../../../../utils/glossary';
import { TrashIcon, WorkshopIcon, Finance } from '../../../../components/Icons';
import './ProjectWizard.css'; 

export const ProjectConsole = ({ project, onClose }) => {
  const { updateProject, deleteProject } = useInventory();
  
  const [localProject, setLocalProject] = useState({ ...project });
  const recipe = localProject.recipe || [];
  const economics = localProject.economics || {};

  const handleUpdate = (field, value) => {
    setLocalProject(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProject(localProject);
    onClose();
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(localProject.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window blueprint-window-size flex-col animate-fade-in" onClick={e => e.stopPropagation()}>
        
        {/* HEADER: Title & Status Control */}
        <div className="bg-panel-header p-20 border-bottom-subtle flex-between align-center">
          <div className="flex-col flex-1 mr-20">
             <input 
                className="input-industrial font-bold text-neon-teal w-full"
                style={{ fontSize: '1.25rem' }}
                value={localProject.title}
                onChange={(e) => handleUpdate('title', e.target.value)}
             />
             <span className="text-muted font-small tracking-wide mt-5">PROJECT CONSOLE</span>
          </div>
          
          <div className="flex-center gap-15">
            <select 
                className={`input-industrial font-bold status-${localProject.status}`}
                value={localProject.status} 
                onChange={e => handleUpdate('status', e.target.value)}
            >
                <option value="idea">IDEA</option>
                <option value="draft">DRAFT</option>
                <option value="active">ACTIVE</option>
            </select>
          </div>
        </div>

        {/* BODY: Two-Column Layout (BOM & Economics) */}
        <div className="blueprint-body bg-app p-30 flex-1 flex-between gap-30 align-start">
          
          {/* LEFT: Bill of Materials */}
          <div className="flex-col flex-1 h-full border-radius-2 border-subtle bg-panel p-20">
            <h3 className="text-muted font-small tracking-wide mb-20 flex-center gap-10">
                <WorkshopIcon /> {TERMINOLOGY.WORKSHOP.BOM_HEADER}
            </h3>
            
            <div className="flex-col gap-10 overflow-y-auto pr-10">
              {recipe.length === 0 ? (
                 <div className="text-muted italic p-20 text-center">No materials logged.</div>
              ) : (
                recipe.map((item, idx) => (
                  <div key={idx} className="flex-between p-15 bg-row-odd border-radius-2 border-left-teal border-subtle">
                    <div className="flex-col gap-5">
                        <span className="font-bold text-main">{item.name}</span>
                        <span className="text-muted font-small font-mono">
                            {item.reqPerUnit}x @ {formatCurrency(item.costPerUnit)}/ea
                        </span>
                    </div>
                    <span className="font-mono font-bold text-main">
                        {formatCurrency(item.costPerUnit * item.reqPerUnit)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT: Economics & Retail */}
          <div className="flex-col flex-1 h-full border-radius-2 border-subtle bg-panel p-20">
             <h3 className="text-muted font-small tracking-wide mb-20 flex-center gap-10">
                <Finance /> MARGIN INTELLIGENCE
            </h3>

            <div className="flex-between mb-20 p-15 bg-row-even border-radius-2 border-subtle">
                <label className="font-bold text-muted">TARGET RETAIL</label>
                <input 
                    type="number" 
                    className="input-industrial w-full text-right ml-20" 
                    style={{ maxWidth: '120px' }}
                    value={localProject.retailPrice || economics.targetRetail || 0}
                    onChange={(e) => {
                        const newPrice = parseFloat(e.target.value);
                        handleUpdate('retailPrice', newPrice);
                        setLocalProject(prev => ({
                            ...prev, 
                            economics: { ...prev.economics, targetRetail: newPrice }
                        }));
                    }}
                />
            </div>

            <div className="profit-cards-container mb-20">
                <div className="flex-between p-15 bg-row-odd border-radius-2 border-subtle">
                    <span className="text-muted font-small tracking-wide">MATERIAL COST</span>
                    <span className="font-bold font-mono">-{formatCurrency(economics.materialCost || 0)}</span>
                </div>
                <div className="flex-between p-15 bg-row-odd border-radius-2 border-subtle mt-10">
                    <span className="text-muted font-small tracking-wide">EST. FEES</span>
                    <span className="font-bold text-warning font-mono">-{formatCurrency(economics.platformFees || 0)}</span>
                </div>
            </div>

            <div className="final-profit-banner p-20 mt-auto bg-panel-header border-radius-2 border-left-teal flex-between align-center">
                <span className="font-bold text-neon-teal">NET PROFIT</span>
                <div className="text-right">
                    <div className="font-bold text-neon-teal profit-total-large font-mono">{formatCurrency(economics.netProfit || 0)}</div>
                    <div className="text-small text-neon-teal">{(economics.marginPercent || 0).toFixed(1)}% MARGIN</div>
                </div>
            </div>
          </div>

        </div>

        {/* FOOTER: Actions */}
        <div className="bg-panel-header p-20 border-top-subtle flex-between">
          <button className="btn-danger flex-center gap-10" onClick={handleDelete}>
             <TrashIcon /> DELETE PROJECT
          </button>
          
          <div className="flex-center gap-15">
            <button className="btn-ghost" onClick={onClose}>CANCEL</button>
            <button className="btn-primary" onClick={handleSave}>SAVE CHANGES</button>
          </div>
        </div>
      </div>
    </div>
  );
};