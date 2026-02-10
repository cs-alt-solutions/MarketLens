import React, { useState } from 'react';
import './ProjectBlueprint.css';

const UNIT_OPTIONS = [
  { value: 'pcs', label: 'Pieces (pcs)' },
  { value: 'in',  label: 'Inches (in)' },
  { value: 'oz',  label: 'Ounces (oz)' },
  { value: 'lb',  label: 'Pounds (lb)' },
];

export const ProjectBlueprint = ({ project, onClose, onSave }) => {
  const [title, setTitle] = useState(project.title || '');
  const [description, setDescription] = useState(project.description || '');
  
  // These were causing "Unused var" errors because the UI was missing
  const [tags, setTags] = useState(project.tags || []); 
  const [tagInput, setTagInput] = useState('');
  const [materials, setMaterials] = useState(project.materials || []);
  const [instructions, setInstructions] = useState(project.instructions || []);
  
  const [newMatName, setNewMatName] = useState('');
  const [newMatAmount, setNewMatAmount] = useState(''); 
  const [newMatUnit, setNewMatUnit] = useState('pcs');  
  const [newMatCost, setNewMatCost] = useState('');

  const [showCalc, setShowCalc] = useState(false);
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkQty, setBulkQty] = useState('');

  const totalCost = materials.reduce((acc, item) => acc + (parseFloat(item.cost) || 0), 0);

  // --- FIXED: Calculator Logic moved out of useEffect ---
  const calculateCost = (bPrice, bQty, amount) => {
    const p = parseFloat(bPrice);
    const q = parseFloat(bQty);
    const a = parseFloat(amount);
    
    if (!isNaN(p) && !isNaN(q) && !isNaN(a) && q !== 0) {
      const pricePerUnit = p / q;
      const calculatedCost = pricePerUnit * a;
      setNewMatCost(calculatedCost.toFixed(2));
    }
  };

  // Update handlers to trigger calculation immediately
  const handleBulkChange = (field, value) => {
    if (field === 'price') {
      setBulkPrice(value);
      if (showCalc) calculateCost(value, bulkQty, newMatAmount);
    } else if (field === 'qty') {
      setBulkQty(value);
      if (showCalc) calculateCost(bulkPrice, value, newMatAmount);
    }
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    setNewMatAmount(val);
    if (showCalc) calculateCost(bulkPrice, bulkQty, val);
  };

  // --- TAG HANDLERS ---
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && tags.length < 13 && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };
  const removeTag = (tag) => setTags(tags.filter(t => t !== tag));

  // --- INSTRUCTION HANDLERS ---
  const addInstruction = () => setInstructions([...instructions, '']);
  const updateInstruction = (index, val) => {
    const newSteps = [...instructions];
    newSteps[index] = val;
    setInstructions(newSteps);
  };
  const removeInstruction = (index) => setInstructions(instructions.filter((_, i) => i !== index));

  const addMaterial = () => {
    if (!newMatName.trim() || !newMatAmount) return;
    setMaterials([...materials, { id: Date.now(), name: newMatName, amount: newMatAmount, unit: newMatUnit, cost: newMatCost }]);
    setNewMatName(''); setNewMatAmount(''); setNewMatCost('');
  };

  const removeMaterial = (id) => setMaterials(materials.filter(m => m.id !== id));

  const handleSave = () => {
    onSave({ ...project, title, description, tags, materials, instructions });
    onClose();
  };

  return (
    <div className="blueprint-overlay">
      <div className="blueprint-panel">
        
        {/* HEADER */}
        <div className="blueprint-header">
          <div>
            <div className="label-industrial">PROJECT ID: {project.id}</div>
            <h2 style={{margin:0, fontSize:'1.2rem', color:'var(--neon-teal)'}}>BLUEPRINT MODE</h2>
          </div>
          <button className="btn-ghost" onClick={onClose}>CLOSE</button>
        </div>

        {/* CONTENT */}
        <div className="blueprint-content">
          
          {/* MATERIAL MANIFEST */}
          <div className="blueprint-section">
             <div className="label-floating" style={{color:'var(--neon-orange)', borderColor:'var(--neon-orange)'}}>MATERIAL MANIFEST</div>
             <div className="flex-between" style={{marginBottom:'15px', alignItems:'flex-end'}}>
               <div className="label-industrial">COMPONENTS LIST</div>
               <div style={{textAlign:'right'}}>
                 <div className="label-industrial">TOTAL COST</div>
                 <span className="glow-orange" style={{fontSize:'1.2rem', fontWeight:800}}>${totalCost.toFixed(2)}</span>
               </div>
             </div>

             <div className="material-input-grid">
               <input className="input-industrial" placeholder="Item Name..." value={newMatName} onChange={e => setNewMatName(e.target.value)} />
               <input className="input-industrial" type="number" placeholder="#" style={{textAlign:'center'}} value={newMatAmount} onChange={handleAmountChange} />
               <select className="input-industrial" value={newMatUnit} onChange={e => setNewMatUnit(e.target.value)}>
                 {UNIT_OPTIONS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
               </select>
               <div className="cost-wrapper">
                 <input className="input-industrial" type="number" placeholder="$ Cost" value={newMatCost} onChange={e => setNewMatCost(e.target.value)} />
                 <button className={`calc-toggle ${showCalc ? 'active' : ''}`} onClick={() => setShowCalc(!showCalc)}>🖩</button>
               </div>
               <button className="btn-primary" style={{padding:'10px'}} onClick={addMaterial}>+</button>
             </div>

             {/* CALC DRAWER */}
             {showCalc && (
               <div className="calc-drawer">
                 <span className="calc-label">BULK CALC:</span>
                 <input className="input-industrial small" placeholder="Qty" type="number" value={bulkQty} onChange={e => handleBulkChange('qty', e.target.value)} />
                 <span className="calc-label">FOR</span>
                 <input className="input-industrial small" placeholder="$" type="number" value={bulkPrice} onChange={e => handleBulkChange('price', e.target.value)} />
                 <div className="calc-result">= ${(parseFloat(newMatCost) || 0).toFixed(2)}</div>
               </div>
             )}

             <div className="spec-list">
               {materials.map(m => (
                 <div key={m.id} className="spec-item">
                   <span style={{flex:3, fontWeight:700}}>{m.name}</span>
                   <span style={{flex:2, color:'var(--neon-cyan)', fontFamily:'monospace'}}>{m.amount} {m.unit}</span>
                   <span style={{flex:1, textAlign:'right', fontFamily:'monospace'}}>${parseFloat(m.cost).toFixed(2)}</span>
                   <button className="x-btn" onClick={() => removeMaterial(m.id)}>×</button>
                 </div>
               ))}
             </div>
          </div>

          {/* PROTOCOLS (Instructions) - Restored UI */}
          <div className="blueprint-section">
             <div className="label-floating" style={{color:'var(--neon-teal)', borderColor:'var(--neon-teal)'}}>ASSEMBLY PROTOCOLS</div>
             <div className="flex-between" style={{marginBottom:'15px'}}>
               <div className="label-industrial">EXECUTION STEPS</div>
               <button className="btn-ghost" onClick={addInstruction} style={{padding:'4px 8px'}}>+ STEP</button>
             </div>
             
             {instructions.length === 0 && <div className="empty-msg">No protocols defined.</div>}
             
             {instructions.map((step, idx) => (
               <div key={idx} className="step-row">
                 <div className="step-num">{idx + 1}</div>
                 <textarea 
                   className="input-industrial"
                   style={{fontSize:'0.9rem', padding:'8px', minHeight:'60px'}}
                   value={step}
                   onChange={(e) => updateInstruction(idx, e.target.value)}
                   placeholder={`Step ${idx + 1} details...`}
                 />
                 <button className="x-btn" style={{marginTop:'10px'}} onClick={() => removeInstruction(idx)}>×</button>
               </div>
             ))}
          </div>

          {/* BASIC INFO & TAGS - Restored UI */}
          <div className="blueprint-section">
            <div className="label-floating">MARKETING DATA</div>
            
            <div style={{marginBottom:'15px'}}>
              <div className="label-industrial">LISTING TITLE</div>
              <input className="input-industrial" value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            <div style={{marginBottom:'15px'}}>
              <div className="flex-between">
                 <div className="label-industrial">TAG ARRAY (13 MAX)</div>
                 <span style={{fontSize:'0.65rem', color: tags.length === 13 ? 'var(--neon-orange)' : 'var(--text-muted)'}}>{tags.length}/13</span>
              </div>
              <div className="tag-input-area">
                {tags.map(tag => (
                  <div key={tag} className="tag-chip">
                    <span>{tag}</span>
                    <span className="tag-remove" onClick={() => removeTag(tag)}>×</span>
                  </div>
                ))}
                {tags.length < 13 && (
                  <input 
                    className="tag-entry"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Type tag..."
                  />
                )}
              </div>
            </div>

            <div>
              <div className="label-industrial">DESCRIPTION</div>
              <textarea className="input-industrial" style={{minHeight:'100px'}} value={description} onChange={e => setDescription(e.target.value)} />
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div style={{padding:'20px', borderTop:'1px solid var(--border-subtle)', background:'var(--bg-panel-header)'}}>
           <button className="btn-primary" style={{width:'100%'}} onClick={handleSave}>SAVE BLUEPRINT</button>
        </div>

      </div>
    </div>
  );
};