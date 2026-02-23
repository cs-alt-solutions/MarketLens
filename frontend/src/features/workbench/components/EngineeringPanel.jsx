/* src/features/workbench/components/EngineeringPanel.jsx */
import React from 'react';
import { TERMINOLOGY } from '../../../utils/glossary';
import { CloseIcon, Plus } from '../../../components/Icons';

export const EngineeringPanel = ({ 
  localProject, 
  materials, 
  handleUpdate, 
  selectedMatId, 
  setSelectedMatId, 
  reqQty, 
  setReqQty, 
  newStep, 
  setNewStep, 
  addStep, 
  removeStep 
}) => {
  return (
    <div className="engineering-grid-v2">
      <div className="bp-col">
        <div className="blueprint-card">
          <div className="blueprint-card-title">{TERMINOLOGY.WORKSHOP.BOM_HEADER}</div>
          <div className="lab-form-group mb-20">
            <select className="input-industrial mb-10" value={selectedMatId} onChange={e => setSelectedMatId(e.target.value)}>
              <option value="">{TERMINOLOGY.BLUEPRINT.ADD_MATERIAL}</option>
              {materials.filter(m => m.qty > 0).map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <div className="flex-between gap-10">
              <input 
                type="number" className="input-industrial" placeholder="Qty per unit"
                value={reqQty} onChange={e => setReqQty(e.target.value)}
              />
              <button className="btn-ghost" onClick={() => {
                const mat = materials.find(m => m.id.toString() === selectedMatId.toString());
                if(mat && reqQty) {
                  handleUpdate('recipe', [...(localProject.recipe || []), { matId: mat.id, name: mat.name, reqPerUnit: parseFloat(reqQty), unit: mat.unit }]);
                  setSelectedMatId(''); setReqQty('');
                }
              }}>{TERMINOLOGY.GENERAL.ADD}</button>
            </div>
          </div>
          <div className="flex-col gap-10">
            {localProject.recipe?.map((item, idx) => (
              <div key={idx} className="recipe-item flex-between p-10 bg-row-odd border-radius-2 border-subtle">
                <span className="font-bold">{item.name} <span className="text-muted font-small">({item.reqPerUnit}{item.unit})</span></span>
                <button className="btn-icon text-muted hover-red" onClick={() => {
                  const r = localProject.recipe.filter((_, i) => i !== idx);
                  handleUpdate('recipe', r);
                }}><CloseIcon /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bp-col">
        <div className="blueprint-card">
          <div className="blueprint-card-title">{TERMINOLOGY.WORKSHOP.ASSEMBLY_GUIDE}</div>
          <div className="flex-between gap-10 mb-20">
            <input 
              className="input-industrial" placeholder={TERMINOLOGY.WORKSHOP.STEP_PLACEHOLDER} 
              value={newStep} onChange={e => setNewStep(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addStep()}
            />
            <button className="btn-ghost" onClick={addStep}><Plus /></button>
          </div>
          <div className="instructions-list">
            {localProject.instructions.map((step, idx) => (
              <div key={idx} className="instruction-step flex-between p-10 mb-5 bg-row-even border-radius-2">
                <div className="flex-center gap-10">
                  <span className="step-num">{idx + 1}</span>
                  <span className="text-main font-small">{step}</span>
                </div>
                <button className="btn-icon text-muted" onClick={() => removeStep(idx)}><CloseIcon /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};