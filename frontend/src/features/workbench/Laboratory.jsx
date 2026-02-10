import React, { useState } from 'react';
import './InventoryManager.css'; // Re-use panel styles
import './Laboratory.css'; // New styles
import { MOCK_PROJECTS } from '../../data/mockData';

// --- MOCK INVENTORY ---
const AVAILABLE_MATERIALS = [
  { id: 101, name: 'Soy Wax', unit: 'lbs', stock: 45 },
  { id: 102, name: 'Glass Jars', unit: 'count', stock: 120 },
  { id: 104, name: 'Brass Rods', unit: 'ft', stock: 0 },
  { id: 105, name: 'Cotton Wicks', unit: 'count', stock: 500 },
  { id: 106, name: 'Fragrance Oil', unit: 'oz', stock: 32 },
  { id: 107, name: 'Warning Labels', unit: 'count', stock: 1000 },
];

export const Laboratory = () => {
  const [selectedProject, setSelectedProject] = useState(MOCK_PROJECTS[0]);
  
  // --- SPECS STATE ---
  const [attributes, setAttributes] = useState({
    style: 'Vintage / Decorative',
    dimensions: '3" x 3" x 4"',
    vesselSize: '8', // oz
    vesselUnit: 'oz',
    variant: 'Standard'
  });

  // --- RECIPE STATE ---
  const [recipe, setRecipe] = useState([
    { id: 1, matId: 101, name: 'Soy Wax', reqPerUnit: 0.65, unit: 'lbs', type: 'Raw Material' },
    { id: 2, matId: 102, name: 'Glass Jars', reqPerUnit: 1, unit: 'count', type: 'Packaging' },
    { id: 3, matId: 105, name: 'Cotton Wicks', reqPerUnit: 1, unit: 'count', type: 'Hardware' }
  ]);

  const [newIngredientId, setNewIngredientId] = useState('');

  // --- HANDLERS ---
  const handleAddIngredient = () => {
    if (!newIngredientId) return;
    const mat = AVAILABLE_MATERIALS.find(m => m.id === parseInt(newIngredientId));
    if (mat) {
      setRecipe([...recipe, { 
        id: Date.now(), 
        matId: mat.id, 
        name: mat.name, 
        reqPerUnit: 0, 
        unit: mat.unit,
        type: 'Material' 
      }]);
      setNewIngredientId('');
    }
  };

  const updateUsage = (id, val) => {
    setRecipe(recipe.map(r => r.id === id ? { ...r, reqPerUnit: parseFloat(val) } : r));
  };

  const removeIngredient = (id) => {
    setRecipe(recipe.filter(r => r.id !== id));
  };

  return (
    <div className="inventory-layout" style={{padding:'30px 40px'}}>
      
      {/* --- HEADER --- */}
      <div className="inventory-header">
        <div>
          <h2 className="header-title" style={{textShadow:'0 0 15px rgba(34, 211, 238, 0.2)', color:'#fff'}}>R&D LABORATORY</h2>
          <div style={{color:'var(--neon-teal)', fontSize:'0.8rem', letterSpacing:'1px', marginTop:'5px'}}>PRODUCT ENGINEERING DIVISION</div>
        </div>
        
        {/* Project Switcher */}
        <select 
          className="input-industrial" 
          style={{width:'300px', borderColor:'var(--neon-teal)', color:'var(--neon-teal)', fontWeight:700}}
          value={selectedProject.id}
          onChange={(e) => {
            const p = MOCK_PROJECTS.find(proj => proj.id === parseInt(e.target.value));
            setSelectedProject(p);
          }}
        >
          {MOCK_PROJECTS.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </div>

      <div className="lab-grid">
        
        {/* --- LEFT: BLUEPRINT SPECS --- */}
        <div className="blueprint-section panel-base" style={{padding:'25px', marginTop: 0}}> {/* Remove marginTop to fix alignment */}
           <div className="floating-manifest-label" style={{color:'var(--neon-cyan)', borderColor:'var(--neon-cyan)'}}>PRODUCT SPECS</div>
           
           <div className="lab-form-group">
             <label className="lab-label">PRODUCT VARIANT</label>
             <select 
               className="input-industrial" 
               value={attributes.style} 
               onChange={e => setAttributes({...attributes, style: e.target.value})}
             >
               <option>Plain / Minimalist</option>
               <option>Vintage / Decorative</option>
               <option>Rustic / Textured</option>
             </select>
           </div>

           <div className="lab-form-row">
             <div className="lab-form-group">
               <label className="lab-label">VESSEL CAPACITY</label>
               <div style={{display:'flex', gap:'10px'}}>
                 <input 
                   className="input-industrial" 
                   value={attributes.vesselSize} 
                   onChange={e => setAttributes({...attributes, vesselSize: e.target.value})}
                   style={{textAlign:'center', fontWeight:700}} 
                 />
                 <div className="unit-badge">{attributes.vesselUnit}</div>
               </div>
             </div>
             
             <div className="lab-form-group">
               <label className="lab-label">DIMENSIONS</label>
               <input 
                 className="input-industrial" 
                 value={attributes.dimensions} 
                 onChange={e => setAttributes({...attributes, dimensions: e.target.value})}
                 placeholder='e.g. 3" x 3" x 4"'
               />
             </div>
           </div>

           <div className="lab-note">
             <span style={{color:'var(--neon-cyan)'}}>ℹ NOTE:</span> Changing vessel size may affect required wax quantity. Please verify composition.
           </div>
        </div>

        {/* --- RIGHT: COMPOSITION MATRIX --- */}
        <div className="blueprint-section panel-base" style={{padding:'0', marginTop: 0, display:'flex', flexDirection:'column'}}>
           <div className="floating-manifest-label" style={{color:'var(--neon-purple)', borderColor:'var(--neon-purple)'}}>COMPOSITION MATRIX</div>
           
           {/* Add New Ingredient Bar */}
           <div style={{padding:'25px 25px 15px', borderBottom:'1px solid #27272a', display:'flex', gap:'10px'}}>
             <select 
               className="input-industrial" 
               style={{flex:1}}
               value={newIngredientId}
               onChange={e => setNewIngredientId(e.target.value)}
             >
               <option value="">+ Add Component from Inventory...</option>
               {AVAILABLE_MATERIALS.map(m => <option key={m.id} value={m.id}>{m.name} ({m.stock} {m.unit} in stock)</option>)}
             </select>
             <button onClick={handleAddIngredient} className="btn-restock" style={{background:'var(--neon-purple)', borderColor:'var(--neon-purple)', color:'#fff'}}>ADD</button>
           </div>

           {/* The Recipe List */}
           <div className="lab-recipe-list">
             {recipe.map(item => {
               const inventoryItem = AVAILABLE_MATERIALS.find(m => m.id === item.matId) || { stock: 0 };
               // Calculate Max Yield
               const yieldCount = item.reqPerUnit > 0 ? Math.floor(inventoryItem.stock / item.reqPerUnit) : 0;
               const isBottleneck = yieldCount < 10;

               return (
                 <div key={item.id} className="recipe-row">
                   
                   {/* Name & Stock Context */}
                   <div style={{flex:2}}>
                     <div className="recipe-name">{item.name}</div>
                     <div className="recipe-meta">Stock: {inventoryItem.stock} {item.unit} available</div>
                   </div>

                   {/* Usage Input */}
                   <div style={{flex:2, display:'flex', flexDirection:'column', alignItems:'center'}}>
                     <label className="lab-label" style={{marginBottom:'4px', color:'var(--neon-purple)'}}>USAGE PER UNIT</label>
                     <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                       <input 
                         type="number" 
                         step="0.01"
                         className="input-industrial" 
                         style={{width:'80px', textAlign:'center', borderColor: item.reqPerUnit ? '#27272a' : 'red'}}
                         value={item.reqPerUnit}
                         onChange={(e) => updateUsage(item.id, e.target.value)}
                         placeholder="0.00"
                       />
                       <span style={{fontSize:'0.75rem', color:'var(--text-muted)', fontWeight:700}}>{item.unit}</span>
                     </div>
                   </div>

                   {/* Yield Calculator */}
                   <div style={{flex:1, textAlign:'right'}}>
                     <label className="lab-label">EST. YIELD</label>
                     <div className="yield-value" style={{color: isBottleneck ? 'red' : 'var(--neon-teal)', textShadow: isBottleneck ? '0 0 5px red' : '0 0 5px rgba(45,212,191,0.3)'}}>
                       {item.reqPerUnit > 0 ? yieldCount : '-'}
                     </div>
                     <div style={{fontSize:'0.6rem', color:'var(--text-muted)'}}>UNITS</div>
                   </div>

                   <button onClick={() => removeIngredient(item.id)} className="btn-icon" style={{marginLeft:'15px', color:'red'}}>×</button>
                 </div>
               );
             })}
           </div>
           
           {/* Footer Stats */}
           <div style={{padding:'15px', background:'rgba(0,0,0,0.3)', borderTop:'1px solid #27272a', textAlign:'center', marginTop:'auto'}}>
              <span style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>BASED ON CURRENT RECIPE, YOU CAN BUILD: </span>
              <strong style={{color:'#fff', fontSize:'1rem'}}>
                {recipe.length > 0 ? Math.min(...recipe.map(r => {
                   const stock = AVAILABLE_MATERIALS.find(m => m.id === r.matId)?.stock || 0;
                   return r.reqPerUnit > 0 ? Math.floor(stock / r.reqPerUnit) : Infinity;
                })) : 0} UNITS
              </strong>
           </div>

        </div>

      </div>
    </div>
  );
};