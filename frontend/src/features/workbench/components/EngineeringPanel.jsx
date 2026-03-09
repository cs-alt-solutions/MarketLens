/* src/features/workbench/components/EngineeringPanel.jsx */
import React from 'react';
import { TERMINOLOGY } from '../../../utils/glossary';
import { formatCurrency } from '../../../utils/formatters';
import { TrashIcon } from '../../../components/Icons';

export const EngineeringPanel = ({
  localProject, materials, handleUpdate,
  selectedMatId, setSelectedMatId, reqQty, setReqQty,
  newStep, setNewStep, addStep, removeStep
}) => {

  const handleAddMaterial = () => {
    if (!selectedMatId || !reqQty) return;
    const mat = materials.find(m => m.id.toString() === selectedMatId.toString());
    if (!mat) return;

    const newItem = {
      matId: mat.id,
      name: mat.name,
      reqPerUnit: parseFloat(reqQty),
      costPerUnit: mat.costPerUnit 
      // 🔥 Python will inject lineTotalCost into this object during the save phase
    };

    const currentRecipe = localProject.recipe || [];
    handleUpdate('recipe', [...currentRecipe, newItem]);
    setSelectedMatId('');
    setReqQty('');
  };

  const handleRemoveMaterial = (index) => {
    const currentRecipe = localProject.recipe || [];
    const updated = currentRecipe.filter((_, i) => i !== index);
    handleUpdate('recipe', updated);
  };

  const recipe = localProject.recipe || [];

  // RULE 8: Standard SOP Action Dictionary
  const STANDARD_ACTIONS = [
    "PREP: Joint & Plane", "PREP: CNC Cut", "PREP: Sanding",
    "MIX: Epoxy Ratio", "MIX: Pigment Add",
    "ASSEMBLE: Clamp & Glue", "ASSEMBLE: Fasten",
    "FINISH: Apply Clear Coat", "FINISH: Polish"
  ];

  return (
    <div className="engineering-grid-v2 h-full">
       
       {/* --- LEFT COLUMN: BILL OF MATERIALS (BOM) --- */}
       <div className="blueprint-card no-margin flex-col h-full">
          <div className="blueprint-card-title">{TERMINOLOGY.WORKSHOP.BOM_HEADER}</div>

          <div className="flex-between gap-10 mb-20">
             <div className="flex-col w-full">
                <label className="label-industrial">MATERIAL</label>
                <select className="input-industrial" value={selectedMatId} onChange={e => setSelectedMatId(e.target.value)}>
                   <option value="">{TERMINOLOGY.BLUEPRINT.ADD_MATERIAL}</option>
                   {materials.map(m => (
                      <option key={m.id} value={m.id}>
                          {m.name} ({formatCurrency(m.costPerUnit)}/ea)
                      </option>
                   ))}
                </select>
             </div>
             
             <div className="flex-col">
                 <label className="label-industrial">{TERMINOLOGY.GENERAL.UNITS}</label>
                 <div className="flex-center gap-10">
                    <input type="number" step="0.01" className="input-industrial" value={reqQty} onChange={e => setReqQty(e.target.value)} placeholder="0.00" />
                    <button type="button" className="btn-primary" onClick={handleAddMaterial}>{TERMINOLOGY.GENERAL.ADD}</button>
                 </div>
             </div>
          </div>

          <div className="panel-content no-pad mt-10">
             {recipe.length === 0 ? (
                 <div className="text-muted italic font-small p-20 text-center">{TERMINOLOGY.GENERAL.NO_DATA}</div>
             ) : (
                 <div className="flex-col gap-10">
                     {recipe.map((item, idx) => (
                         <div key={idx} className="flex-between p-15 border-subtle border-radius-2 bg-darker">
                             <div className="bom-item-text">
                                 <div className="font-bold text-main">{item.name}</div>
                                 <div className="font-small text-muted font-mono mt-5">
                                     {item.reqPerUnit} units @ {formatCurrency(item.costPerUnit || 0)}/ea
                                 </div>
                             </div>
                             <div className="flex-center gap-15">
                                 {/* RULE 8 + PYTHON BRIDGE: 
                                     It prefers Python's calculation, but uses React's math as a fallback to prevent screen crash 
                                 */}
                                 <div className="font-mono text-neon-teal font-bold">
                                     {formatCurrency(item.lineTotalCost ?? (item.reqPerUnit * (item.costPerUnit || 0)))}
                                 </div>
                                 <button type="button" className="btn-icon-hover-clean" onClick={() => handleRemoveMaterial(idx)} title={TERMINOLOGY.GENERAL.DELETE}><TrashIcon /></button>
                             </div>
                         </div>
                     ))}
                 </div>
             )}
          </div>
       </div>

       {/* --- RIGHT COLUMN: STANDARD OPERATING PROCEDURE (SOP) --- */}
       <div className="blueprint-card no-margin flex-col h-full">
          <div className="blueprint-card-title">{TERMINOLOGY.WORKSHOP.ASSEMBLY_GUIDE}</div>

          <div className="flex-col mb-20 w-full">
             <label className="label-industrial">NEW STEP (RULE 8: SELECT-FIRST)</label>
             <div className="flex-center gap-10 w-full">
                 <select className="input-industrial w-full" value={newStep.startsWith('CUSTOM:') ? 'CUSTOM' : newStep} onChange={e => setNewStep(e.target.value)}>
                    <option value="">-- Select Standard Action --</option>
                    {STANDARD_ACTIONS.map(action => (
                        <option key={action} value={action}>{action}</option>
                    ))}
                    <option value="CUSTOM">Custom Action...</option>
                 </select>
                 <button type="button" className="btn-primary" onClick={addStep} disabled={!newStep}>{TERMINOLOGY.GENERAL.ADD}</button>
             </div>
             
             {/* Fallback open-text field if they need a highly specific step */}
             {(newStep === 'CUSTOM' || newStep.startsWith('CUSTOM:')) && (
                 <input type="text" className="input-industrial mt-10 animate-fade-in" placeholder="Type custom step..." value={newStep.replace('CUSTOM: ', '') === 'CUSTOM' ? '' : newStep.replace('CUSTOM: ', '')} onChange={e => setNewStep(`CUSTOM: ${e.target.value}`)} onKeyDown={e => e.key === 'Enter' && addStep()} autoFocus />
             )}
          </div>

          <div className="panel-content no-pad mt-10 flex-col gap-10">
             {localProject.instructions?.length === 0 ? (
                 <div className="text-muted italic font-small p-20 text-center">{TERMINOLOGY.GENERAL.NO_DATA}</div>
             ) : (
                 localProject.instructions?.map((step, idx) => (
                     <div key={idx} className="instruction-step flex-between p-15 gap-15 bg-darker border-radius-2">
                         <div className="flex-center gap-15">
                             <div className="step-num flex-shrink-0">{idx + 1}</div>
                             <div className="text-main font-small lh-15 instruction-item-text">{step}</div>
                         </div>
                         <button type="button" className="btn-icon-hover-clean flex-shrink-0" onClick={() => removeStep(idx)} title={TERMINOLOGY.GENERAL.DELETE}><TrashIcon /></button>
                     </div>
                 ))
             )}
          </div>
       </div>
    </div>
  );
};