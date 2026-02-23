/* src/features/workbench/components/ProjectBlueprint.jsx */
import React, { useState } from 'react';
import './ProjectBlueprint.css';
import { useInventory } from '../../../context/InventoryContext';
import { useProjectEconomics } from '../../../context/FinancialContext';
import { TERMINOLOGY } from '../../../utils/glossary';
import { formatCurrency } from '../../../utils/formatters';
import { Save, WorkshopIcon, Finance, CloseIcon } from '../../../components/Icons';

export const ProjectBlueprint = ({ project, onClose }) => {
  const { updateProject, materials, manufactureProduct } = useInventory();
  
  const [activeTab, setActiveTab] = useState('BUILD'); 
  const [localProject, setLocalProject] = useState({
    ...project,
    research: project.research || { targetAudience: '', inspiration: '', notes: '' },
    checklist: project.checklist || { photos: false, description: false, tags: false },
    economics: project.economics || { shippingCost: 0, platformFeePercent: 6.5, platformFixedFee: 0.20 }
  });
  
  const { materialCost, platformFees, netProfit, marginPercent } = useProjectEconomics(localProject);

  const [batchSize, setBatchSize] = useState(1);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedMatId, setSelectedMatId] = useState('');
  const [reqQty, setReqQty] = useState('');

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

  const handleTitleChange = (e) => {
      handleUpdate('title', e.target.value);
  };

  const handleSave = () => {
    updateProject(localProject);
    setIsDirty(false);
    onClose(); 
  };

  const handleAddIngredient = () => {
    if (!selectedMatId || !reqQty) {
        logToConsole("Error: Please select a material and enter a quantity.");
        return;
    }
    
    // THE FIX: Uses .toString() to handle both Ints and UUIDs safely!
    const mat = materials.find(m => m.id.toString() === selectedMatId.toString());
    
    if (!mat) {
        logToConsole("Error: Could not locate material in database.");
        return;
    }

    const newItem = {
      matId: mat.id,
      name: mat.name,
      reqPerUnit: parseFloat(reqQty),
      unit: mat.unit 
    };
    
    setLocalProject(prev => ({ ...prev, recipe: [...(prev.recipe || []), newItem] }));
    setIsDirty(true);
    setReqQty('');
    setSelectedMatId('');
    logToConsole(`Added ${newItem.reqPerUnit} ${newItem.unit} of ${newItem.name} to recipe.`);
  };

  const handleRunBatch = async () => {
    if (!localProject.recipe || localProject.recipe.length === 0) {
        logToConsole("Please add materials before making a batch.");
        return;
    }
    
    logToConsole("Checking material levels...");
    const result = await manufactureProduct(localProject.id, localProject.recipe, parseInt(batchSize));
    
    if (result.success) {
        logToConsole(`Success: ${batchSize} units built and added to stock!`);
        setLocalProject(prev => ({ ...prev, stockQty: (prev.stockQty || 0) + parseInt(batchSize) }));
    } else {
        logToConsole(`Error: ${result.message}`);
    }
  };

  const logToConsole = (msg) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setConsoleLogs(prev => [`[${timestamp}] ${msg}`, ...prev]);
  };

  const renderEngineering = () => (
    <div className="engineering-grid">
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
                            type="number" className="input-industrial" placeholder={TERMINOLOGY.GENERAL.UNITS}
                            value={reqQty} onChange={e => setReqQty(e.target.value)}
                        />
                        <button className="btn-ghost" onClick={handleAddIngredient}>{TERMINOLOGY.GENERAL.ADD}</button>
                    </div>
                </div>
                
                <div className="flex-col gap-10">
                    {localProject.recipe?.length === 0 && <div className="text-muted italic font-small">No materials added yet.</div>}
                    {localProject.recipe?.map((item, idx) => (
                    <div key={idx} className="recipe-item flex-between p-10 bg-row-odd border-subtle border-radius-2">
                        <div>
                            <div className="font-bold">{item.name}</div>
                            <div className="text-muted font-small">{item.reqPerUnit} {item.unit} per item</div>
                        </div>
                        <button className="btn-icon text-muted hover-red" onClick={() => {
                            const newRecipe = [...localProject.recipe];
                            newRecipe.splice(idx, 1);
                            handleUpdate('recipe', newRecipe);
                        }}><CloseIcon /></button>
                    </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="bp-col">
            <div className="blueprint-card">
                <div className="blueprint-card-title">{TERMINOLOGY.BLUEPRINT.PRODUCTION_CONSOLE}</div>
                <div className="flex-between mb-20 p-10 bg-row-even border-radius-2">
                   <span className="font-bold">{TERMINOLOGY.BLUEPRINT.STOCK}:</span>
                   <span className="text-accent font-large font-bold">{localProject.stockQty || 0}</span>
                </div>
                <div className="lab-form-group">
                   <label className="label-industrial">{TERMINOLOGY.BLUEPRINT.BATCH}</label>
                   <input 
                       type="number" className="input-industrial text-center text-large" 
                       value={batchSize} onChange={e => setBatchSize(e.target.value)}
                       min="1"
                   />
                </div>
                <button 
                   className="btn-primary w-full mt-10 py-15" 
                   onClick={handleRunBatch}
                   disabled={!localProject.recipe || localProject.recipe.length === 0}
                >
                   {TERMINOLOGY.BLUEPRINT.RUN}
                </button>
                
                {consoleLogs.length > 0 && (
                    <div className="console-log-area mt-20 p-10 bg-app border-subtle border-radius-2 font-mono font-small text-muted">
                        {consoleLogs.map((log, i) => (
                            <div key={i} className="mb-5">{log}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
  );

  const renderLaunch = () => (
    <div className="phase-grid">
         <div className="phase-col">
            <div className="blueprint-card">
                <div className="blueprint-card-title"><Finance /> {TERMINOLOGY.BLUEPRINT.PROFIT_SIMULATOR}</div>
                
                <div className="lab-form-group mt-20">
                    <label className="label-industrial">{TERMINOLOGY.BLUEPRINT.RETAIL}</label>
                    <input 
                        type="number" className="input-industrial retail-price-input" 
                        value={localProject.retailPrice}
                        onChange={e => handleUpdate('retailPrice', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                    />
                </div>
                
                <div className="profit-breakdown">
                    <div className="calc-row">
                        <span>{TERMINOLOGY.BLUEPRINT.RAW_MATERIALS}</span>
                        <span className="text-muted">{formatCurrency(materialCost)}</span>
                    </div>
                    <div className="calc-row">
                         <span>{TERMINOLOGY.BLUEPRINT.PLATFORM_FEES}</span>
                         <span className="text-warning">-{formatCurrency(platformFees)}</span>
                    </div>
                    <div className="calc-row border-none">
                         <span>{TERMINOLOGY.BLUEPRINT.SHIPPING_LABEL}</span>
                         <div className="shipping-input-wrapper">
                             <input 
                                className="input-chromeless" 
                                type="number" 
                                value={localProject.economics.shippingCost}
                                onChange={e => handleUpdate('economics', parseFloat(e.target.value) || 0, 'shippingCost')}
                                placeholder="0.00"
                             />
                         </div>
                    </div>
                    <div className="calc-row final">
                        <span>{TERMINOLOGY.BLUEPRINT.PROFIT}:</span>
                        <span className={netProfit > 0 ? 'text-good' : 'text-alert'}>
                            {formatCurrency(netProfit)}
                        </span>
                    </div>
                     <div className="text-right font-small text-muted mt-10">
                        {TERMINOLOGY.BLUEPRINT.MARGIN}: {marginPercent.toFixed(1)}%
                     </div>
                </div>
            </div>
         </div>

         <div className="phase-col">
             <div className="blueprint-card h-full">
                 <div className="blueprint-card-title">{TERMINOLOGY.BLUEPRINT.LAUNCH_CHECKLIST}</div>
                 <div className="mt-20">
                     {['photos', 'description', 'tags'].map(key => (
                         <div 
                            key={key} 
                            className={`flex-center gap-10 p-15 mb-10 border-subtle border-radius-2 clickable transition-all ${localProject.checklist[key] ? 'bg-row-even border-teal' : 'hover-bg-odd'}`}
                            onClick={() => handleUpdate('checklist', !localProject.checklist[key], key)}
                         >
                            <div className={`w-20 h-20 border-radius-circle flex-center border-subtle ${localProject.checklist[key] ? 'bg-teal text-black border-none' : ''}`}>
                                {localProject.checklist[key] && '✓'}
                            </div>
                            <span className={`font-bold ${localProject.checklist[key] ? 'text-main' : 'text-muted'}`}>
                                {TERMINOLOGY.BLUEPRINT[key.toUpperCase()]}
                            </span>
                         </div>
                     ))}
                 </div>
             </div>
         </div>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-window blueprint-window-size animate-fade-in">
        <div className="blueprint-header">
           <div className="bp-top-bar pad-20 flex-between border-bottom-subtle">
               <div className="flex-center w-full max-w-500">
                  <WorkshopIcon />
                  <input 
                    className="input-chromeless ml-10 font-large font-bold w-full text-left"
                    style={{ fontSize: '1.4rem' }}
                    value={localProject.title}
                    onChange={handleTitleChange}
                    placeholder="Project Name..."
                  />
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
            {activeTab === 'BUILD' && renderEngineering()}
            {activeTab === 'LAUNCH' && renderLaunch()}
        </div>
      </div>
    </div>
  );
};