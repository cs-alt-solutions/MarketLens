/* src/features/workbench/components/wizard/Step3Fulfillment.jsx */
import React, { useState } from 'react';
import { APP_CONFIG, TERMINOLOGY } from '../../../../utils/glossary';
import { TrashIcon } from '../../../../components/Icons';

// 🛠️ External helper maintains React purity
const generateProtoId = (name) => {
  return 'proto-' + btoa(name + Math.random()).substring(0, 10);
};

export const Step3Fulfillment = ({ localProject, handleUpdate, materials, hasAllPackaging, setHasAllPackaging }) => {
  const [selectedMatId, setSelectedMatId] = useState('');
  const [reqQty, setReqQty] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCost, setNewCost] = useState('');

  const isLogistics = (cat) => APP_CONFIG.INVENTORY.LOGISTICS.includes(cat);
  const shippingMaterials = materials.filter(m => isLogistics(m.category));
  
  const recipe = localProject.recipe || [];
  const currentFulfillmentList = recipe.filter(i => {
    const mat = materials.find(m => m.id === i.matId);
    return i.isPrototype || (mat && isLogistics(mat.category));
  });

  const addItem = () => {
    if (isAddingNew) {
      if (!newName || !newCost) return;
      
      const protoItem = { 
        matId: generateProtoId(newName),
        name: newName, 
        reqPerUnit: parseFloat(reqQty) || 1, 
        costPerUnit: parseFloat(newCost), 
        isPrototype: true 
      };
      
      handleUpdate('recipe', [...recipe, protoItem]);
      setNewName(''); 
      setNewCost(''); 
      setIsAddingNew(false);
    } else {
      const mat = materials.find(m => m.id.toString() === selectedMatId);
      if (!mat) return;
      const newItem = { matId: mat.id, name: mat.name, reqPerUnit: parseFloat(reqQty) || 1, costPerUnit: mat.costPerUnit };
      handleUpdate('recipe', [...recipe, newItem]);
    }
    setSelectedMatId(''); 
    setReqQty('');
  };

  return (
    <div className="animate-fade-in flex-col h-full max-w-800 w-full">
      <h2 className="text-neon-teal mb-10 text-center wizard-title-large">{TERMINOLOGY.WIZARD.STEP_3}</h2>
      <p className="text-muted mb-30 text-center font-large">Ensure all necessary packaging is available for fulfillment.</p>
      
      <div className="bg-panel p-15 border-radius-2 border-subtle mb-20">
        <div className="flex-center gap-10">
          {!isAddingNew ? (
            <select className="input-industrial w-full" value={selectedMatId} onChange={e => setSelectedMatId(e.target.value)}>
              <option value="">-- Choose a Shipping Box or Mailer --</option>
              {shippingMaterials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          ) : (
            <>
              <input className="input-industrial w-full" placeholder="Box/Supply Name" value={newName} onChange={e => setNewName(e.target.value)} />
              {/* 🚀 Replaced inline styles with strict CSS classes */}
              <input type="number" className="input-industrial w-100" placeholder="Est. Cost" value={newCost} onChange={e => setNewCost(e.target.value)} />
            </>
          )}
          <input type="number" className="input-industrial w-80" placeholder="Qty" value={reqQty} onChange={e => setReqQty(e.target.value)} />
          <button className="btn-primary" onClick={addItem}>{TERMINOLOGY.GENERAL.ADD}</button>
        </div>
        <button className="text-neon-teal font-small mt-10 btn-ghost" onClick={() => setIsAddingNew(!isAddingNew)}>
          {isAddingNew ? TERMINOLOGY.GENERAL.CANCEL : "+ Add Prototype Packaging (Custom Boxes, etc.)"}
        </button>
      </div>

      <div className="flex-col gap-10 overflow-y-auto pr-10 mb-20 flex-1">
        <div className="bom-section-header">SHIPPING SUPPLIES REQUIRED PER UNIT</div>
        {currentFulfillmentList.length === 0 ? (
            <div className="text-muted italic text-small text-center mt-20">No packaging added to this product yet.</div>
        ) : (
          currentFulfillmentList.map((item, idx) => {
            const realIndex = recipe.findIndex(r => r.matId === item.matId && r.reqPerUnit === item.reqPerUnit);
            return (
              <div key={idx} className="flex-between p-15 border-bottom-subtle bg-panel border-radius-2 animate-fade-in">
                <span className="font-bold">{item.reqPerUnit}x <span className="text-muted ml-5 font-normal">{item.name}</span> {item.isPrototype && <span className="text-warning font-mono text-small ml-10">[PROTOTYPE]</span>}</span>
                <button className="btn-icon-hover-clean" onClick={() => handleUpdate('recipe', recipe.filter((_, i) => i !== realIndex))}><TrashIcon /></button>
              </div>
            )
          })
        )}
      </div>

      <div 
          className={`p-15 border-radius-2 border-subtle flex-center gap-15 clickable transition ${hasAllPackaging ? 'bg-teal text-black font-bold' : 'bg-app text-muted'}`} 
          onClick={() => setHasAllPackaging(!hasAllPackaging)}
      >
        {/* 🚀 Replaced massive inline style block with step-circle-check */}
        <div className={`step-circle step-circle-check ${hasAllPackaging ? 'active' : ''}`}>
            {hasAllPackaging ? '✓' : ''}
        </div>
        <span>Shipping supplies verified for fulfillment.</span>
      </div>
    </div>
  );
};