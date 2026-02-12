/* src/features/workbench/components/ProjectBlueprint.jsx */
import React, { useState } from 'react';
import './ProjectBlueprint.css';
import { useInventory } from '../../../context/InventoryContext';
import { useProjectEconomics } from '../../../context/FinancialContext';
import { TERMINOLOGY } from '../../../utils/glossary';
import { formatCurrency } from '../../../utils/formatters';
import { Save, Box, WorkshopIcon, Radar, Finance } from '../../../components/Icons';

export const ProjectBlueprint = ({ project, onClose }) => {
  const { updateProject, materials, manufactureProduct } = useInventory();
  
  const [activeTab, setActiveTab] = useState('RD'); 
  const [localProject, setLocalProject] = useState({
    ...project,
    research: project.research || { targetAudience: '', inspiration: '', notes: '' },
    checklist: project.checklist || { photos: false, description: false, tags: false },
    economics: project.economics || { shippingCost: 0, platformFeePercent: 6.5, platformFixedFee: 0.20 }
  });
  
  // Rule 3: Math moved to specialized hook
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

  const handleSave = () => {
    updateProject(localProject);
    setIsDirty(false);
    logToConsole("Project Blueprint synced to database.", "success");
  };

  const handleAddIngredient = () => {
    if (!selectedMatId || !reqQty) return;
    const mat = materials.find(m => m.id === parseInt(selectedMatId));
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
  };

  const handleRunBatch = () => {
    if (!localProject.recipe || localProject.recipe.length === 0) {
        logToConsole("Error: Recipe empty. Cannot build.", "error");
        return;
    }
    const result = manufactureProduct(localProject.id, localProject.recipe, parseInt(batchSize));
    if (result.success) {
        logToConsole(`PRODUCTION SUCCESS: ${result.message}`, "success");
        setLocalProject(prev => ({ ...prev, stockQty: (prev.stockQty || 0) + parseInt(batchSize) }));
    } else {
        logToConsole(`PRODUCTION FAILED: ${result.message}`, "error");
    }
  };

  const logToConsole = (msg, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [`[${timestamp}] ${msg}::${type}`, ...prev]);
  };

  const renderRD = () => (
    <div className="phase-grid">
        <div className="phase-col">
            <div className="bp-section-header flex-center gap-10">
                <Radar /> {TERMINOLOGY.BLUEPRINT.MARKET_RESEARCH}
            </div>
            <div className="pad-20">
                <div className="lab-form-group">
                    <label className="label-industrial">{TERMINOLOGY.BLUEPRINT.AUDIENCE}</label>
                    <textarea 
                        className="input-industrial" rows="3" 
                        value={localProject.research.targetAudience}
                        onChange={e => handleUpdate('research', e.target.value, 'targetAudience')}
                    />
                </div>
                <div className="lab-form-group">
                    <label className="label-industrial">{TERMINOLOGY.BLUEPRINT.INSPIRATION}</label>
                    <input 
                        className="input-industrial" 
                        value={localProject.research.inspiration}
                        onChange={e => handleUpdate('research', e.target.value, 'inspiration')}
                    />
                </div>
                <div className="lab-form-group">
                    <label className="label-industrial">{TERMINOLOGY.BLUEPRINT.NOTES}</label>
                    <textarea 
                        className="input-industrial" rows="6" 
                        value={localProject.research.notes}
                        onChange={e => handleUpdate('research', e.target.value, 'notes')}
                    />
                </div>
            </div>
        </div>
        <div className="phase-col">
             <div className="bp-section-header">{TERMINOLOGY.BLUEPRINT.VISUAL_CONCEPTS}</div>
             <div className="visual-concept-zone">
                 <div className="concept-placeholder">DRAG & DROP CONCEPT ART HERE</div>
                 <span className="font-small mt-10 opacity-50">(Simulated Upload Zone)</span>
             </div>
        </div>
    </div>
  );

  const renderEngineering = () => (
    <div className="engineering-grid">
        <div className="bp-col">
            <div className="bp-section-header">{TERMINOLOGY.WORKSHOP.BOM_HEADER}</div>
            <div className="pad-20 border-bottom-subtle">
                <div className="lab-form-group">
                <select className="input-industrial mb-10" value={selectedMatId} onChange={e => setSelectedMatId(e.target.value)}>
                    <option value="">-- Add Material --</option>
                    {materials.filter(m => m.qty > 0).map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>
                <div className="flex-between gap-10">
                    <input 
                        type="number" className="input-industrial" placeholder="Qty"
                        value={reqQty} onChange={e => setReqQty(e.target.value)}
                    />
                    <button className="btn-ghost" onClick={handleAddIngredient}>ADD</button>
                </div>
                </div>
            </div>
            <div className="flex-col">
                {localProject.recipe?.map((item, idx) => (
                <div key={idx} className="recipe-item">
                    <div>
                        <div className="recipe-name">{item.name}</div>
                        <div className="recipe-meta">{item.reqPerUnit} {item.unit}</div>
                    </div>
                    <button className="btn-icon" onClick={() => {
                        const newRecipe = [...localProject.recipe];
                        newRecipe.splice(idx, 1);
                        handleUpdate('recipe', newRecipe);
                    }}>×</button>
                </div>
                ))}
            </div>
        </div>

        <div className="bp-col flex-center bg-dots">
             <div className="text-center">
                 <Box className="placeholder-icon-large" />
                 <div className="mt-20 font-mono text-muted">{TERMINOLOGY.WORKSHOP.REF_VISUAL}</div>
             </div>
        </div>

        <div className="bp-col">
            <div className="bp-section-header">{TERMINOLOGY.BLUEPRINT.PRODUCTION_CONSOLE}</div>
            <div className="pad-20">
                <div className="stock-indicator-clean mb-20 flex-center">
                   {TERMINOLOGY.BLUEPRINT.STOCK}: <strong className="ml-5 text-white">{localProject.stockQty || 0}</strong>
                </div>
                <div className="lab-form-group">
                   <label className="label-industrial">{TERMINOLOGY.BLUEPRINT.BATCH}</label>
                   <input 
                       type="number" className="input-industrial" 
                       value={batchSize} onChange={e => setBatchSize(e.target.value)}
                   />
                </div>
                <button 
                   className="btn-primary w-full mt-10" 
                   onClick={handleRunBatch}
                   disabled={!localProject.recipe || localProject.recipe.length === 0}
                >
                   {TERMINOLOGY.BLUEPRINT.RUN}
                </button>
            </div>
            <div className="console-log-area">
                 {consoleLogs.map((log, i) => {
                    const [msg, type] = log.split('::');
                    return <div key={i} className={`log-entry log-${type}`}>{msg}</div>;
                 })}
            </div>
        </div>
    </div>
  );

  const renderLaunch = () => (
    <div className="phase-grid">
         <div className="phase-col">
            <div className="bp-section-header flex-center gap-10"><Finance /> {TERMINOLOGY.BLUEPRINT.PROFIT_SIMULATOR}</div>
            <div className="pad-20">
                <div className="lab-form-group">
                    <label className="label-industrial">{TERMINOLOGY.BLUEPRINT.RETAIL}</label>
                    <input 
                        type="number" className="input-industrial retail-price-input" 
                        value={localProject.retailPrice}
                        onChange={e => handleUpdate('retailPrice', parseFloat(e.target.value))}
                    />
                </div>
                
                <div className="profit-breakdown">
                    <div className="calc-row">
                        <span>Raw Materials:</span>
                        <span className="text-muted">{formatCurrency(materialCost)}</span>
                    </div>
                    <div className="calc-row">
                         <span>Platform Fees:</span>
                         <span className="text-warning">-{formatCurrency(platformFees)}</span>
                    </div>
                    <div className="calc-row">
                         <span>Shipping Label:</span>
                         <div className="shipping-input-wrapper">
                             <input 
                                className="input-chromeless text-right" 
                                type="number" 
                                value={localProject.economics.shippingCost}
                                onChange={e => handleUpdate('economics', parseFloat(e.target.value), 'shippingCost')}
                             />
                         </div>
                    </div>
                    <div className="calc-row final">
                        <span>{TERMINOLOGY.BLUEPRINT.PROFIT}:</span>
                        <span className={netProfit > 0 ? 'text-good' : 'text-alert'}>
                            {formatCurrency(netProfit)}
                        </span>
                    </div>
                     <div className="text-right font-small text-muted mt-5">
                        {TERMINOLOGY.BLUEPRINT.MARGIN}: {marginPercent.toFixed(1)}%
                     </div>
                </div>
            </div>
         </div>

         <div className="phase-col">
             <div className="bp-section-header">{TERMINOLOGY.BLUEPRINT.LAUNCH_CHECKLIST}</div>
             <div className="pad-20">
                 {['photos', 'description', 'tags'].map(key => (
                     <div 
                        key={key} 
                        className={`checklist-item ${localProject.checklist[key] ? 'checked' : ''}`}
                        onClick={() => handleUpdate('checklist', !localProject.checklist[key], key)}
                     >
                        <div className="check-box">{localProject.checklist[key] && '✓'}</div>
                        <span className="label-industrial no-margin">
                            {TERMINOLOGY.BLUEPRINT[key.toUpperCase()]}
                        </span>
                     </div>
                 ))}
             </div>
         </div>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-window blueprint-window-size animate-fade-in">
        <div className="blueprint-header">
           <div className="bp-top-bar pad-20 flex-between">
               <div className="flex-center">
                  <WorkshopIcon />
                  <div className="ml-10">
                    <span className="blueprint-title header-title">{localProject.title}</span>
                    <span className="blueprint-id font-mono text-accent ml-10">REF: {localProject.id.toString().slice(-4)}</span>
                  </div>
               </div>
               <div className="flex-center gap-10">
                  {isDirty && <span className="text-warning font-small italic">Unsaved Changes</span>}
                  <button className="btn-primary" onClick={handleSave}><Save /> {TERMINOLOGY.GENERAL.SAVE}</button>
                  <button className="btn-ghost" onClick={onClose}>{TERMINOLOGY.GENERAL.CLOSE}</button>
               </div>
           </div>
           <div className="tab-container">
               <div className={`tab-item ${activeTab === 'RD' ? 'active' : ''}`} onClick={() => setActiveTab('RD')}>{TERMINOLOGY.BLUEPRINT.PHASE_PLAN}</div>
               <div className={`tab-item ${activeTab === 'BUILD' ? 'active' : ''}`} onClick={() => setActiveTab('BUILD')}>{TERMINOLOGY.BLUEPRINT.PHASE_BUILD}</div>
               <div className={`tab-item ${activeTab === 'LAUNCH' ? 'active' : ''}`} onClick={() => setActiveTab('LAUNCH')}>{TERMINOLOGY.BLUEPRINT.PHASE_LAUNCH}</div>
           </div>
        </div>
        <div className="blueprint-body">
            {activeTab === 'RD' && renderRD()}
            {activeTab === 'BUILD' && renderEngineering()}
            {activeTab === 'LAUNCH' && renderLaunch()}
        </div>
      </div>
    </div>
  );
};