/* src/features/workbench/components/wizard/Step2Product.jsx */
import React, { useState } from 'react';
import { APP_CONFIG, TERMINOLOGY } from '../../../../utils/glossary';
import { TrashIcon } from '../../../../components/Icons';

export const Step2Product = ({ localProject, handleUpdate, materials, hasAllCore, setHasAllCore }) => {
  const [selectedMatId, setSelectedMatId] = useState('');
  const [reqQty, setReqQty] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCost, setNewCost] = useState('');

  const isLogistics = (cat) => APP_CONFIG.INVENTORY.LOGISTICS.includes(cat);
  const coreMaterials = materials.filter(m => !isLogistics(m.category));
  const currentRecipe = localProject.recipe.filter(i => {
    const mat = materials.find(m => m.id === i.matId);
    return i.isPrototype || (mat && !isLogistics(mat.category));
  });

  const addItem = () => {
    if (isAddingNew) {
      if (!newName || !newCost) return;
      const uniqueId = 'proto-' + btoa(newName + Math.random()).substring(0, 10);
      const protoItem = { matId: uniqueId, name: newName, reqPerUnit: parseFloat(reqQty) || 1, costPerUnit: parseFloat(newCost), isPrototype: true };
      handleUpdate('recipe', [...localProject.recipe, protoItem]);
      setNewName(''); setNewCost(''); setIsAddingNew(false);
    } else {
      const mat = materials.find(m => m.id.toString() === selectedMatId);
      if (!mat) return;
      const newItem = { matId: mat.id, name: mat.name, reqPerUnit: parseFloat(reqQty) || 1, costPerUnit: mat.costPerUnit };
      handleUpdate('recipe', [...localProject.recipe, newItem]);
    }
    setSelectedMatId(''); setReqQty('');
  };

  return (
    <div className="animate-fade-in flex-col h-full max-w-800 w-full">
      <h2 className="text-neon-teal mb-10 text-center">{TERMINOLOGY.WIZARD.STEP_2} 🛠️</h2>
      
      <div className="bg-panel p-15 border-radius-2 border-subtle mb-20">
        <div className="flex-center gap-10">
          {!isAddingNew ? (
            <select className="input-industrial w-full" value={selectedMatId} onChange={e => setSelectedMatId(e.target.value)}>
              <option value="">{TERMINOLOGY.BLUEPRINT.ADD_MATERIAL}</option>
              {coreMaterials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          ) : (
            <>
              <input className="input-industrial w-full" placeholder={TERMINOLOGY.INVENTORY.MATERIAL_NAME} value={newName} onChange={e => setNewName(e.target.value)} />
              <input type="number" className="input-industrial w-100" placeholder="Est. Cost" value={newCost} onChange={e => setNewCost(e.target.value)} />
            </>
          )}
          <input type="number" className="input-industrial w-80" placeholder={TERMINOLOGY.GENERAL.UNITS} value={reqQty} onChange={e => setReqQty(e.target.value)} />
          <button className="btn-primary" onClick={addItem}>{TERMINOLOGY.GENERAL.ADD}</button>
        </div>
        <button className="text-neon-teal font-small mt-10 btn-ghost" onClick={() => setIsAddingNew(!isAddingNew)}>
          {isAddingNew ? TERMINOLOGY.GENERAL.CANCEL : "+ Add Prototype Material"}
        </button>
      </div>

      <div className="flex-col gap-10 overflow-y-auto pr-10 mb-20 flex-1">
        {currentRecipe.map((item, idx) => (
          <div key={idx} className="flex-between p-15 bg-panel border-radius-2 border-subtle">
            <span>{item.reqPerUnit}x {item.name} {item.isPrototype && <span className="text-warning font-mono text-small">[PROTO]</span>}</span>
            <button className="btn-icon-hover-clean" onClick={() => handleUpdate('recipe', localProject.recipe.filter(r => r.matId !== item.matId))}><TrashIcon /></button>
          </div>
        ))}
      </div>

      <div className={`p-15 border-radius-2 border-subtle flex-center gap-15 clickable transition ${hasAllCore ? 'bg-teal text-black font-bold' : 'bg-app text-muted'}`} onClick={() => setHasAllCore(!hasAllCore)}>
        <div className={`step-circle step-circle-check ${hasAllCore ? 'active' : ''}`}>{hasAllCore ? '✓' : ''}</div>
        <span>Core materials logged.</span>
      </div>
    </div>
  );
};