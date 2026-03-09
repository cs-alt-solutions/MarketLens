/* src/features/workbench/components/IntakeForm.jsx */
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../supabaseClient';

export const IntakeForm = ({ onSubmit, onCancel }) => {
  // --- STATE: The Taxonomy Dictionary ---
  const [taxonomy, setTaxonomy] = useState([]);
  const [isLoadingTaxonomy, setIsLoadingTaxonomy] = useState(true);

  // --- STATE: User Selections ---
  const [selectedBroad, setSelectedBroad] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSpecificId, setSelectedSpecificId] = useState('');
  
  // --- STATE: Receiving Details ---
  const [alias, setAlias] = useState('');
  const [qty, setQty] = useState('');
  const [isCustomQty, setIsCustomQty] = useState(false);
  const [cost, setCost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch the Master Dictionary on load (This is safe to keep in React for UI speed)
  useEffect(() => {
    const fetchTaxonomy = async () => {
      const { data, error } = await supabase.from('material_categories').select('*');
      if (!error && data) setTaxonomy(data);
      setIsLoadingTaxonomy(false);
    };
    fetchTaxonomy();
  }, []);

  // 2. Cascading Logic
  const broadCategories = useMemo(() => [...new Set(taxonomy.map(t => t.broad_category))], [taxonomy]);
  const availableTypes = useMemo(() => [...new Set(taxonomy.filter(t => t.broad_category === selectedBroad).map(t => t.type_name))], [taxonomy, selectedBroad]);
  const availableSpecifics = useMemo(() => taxonomy.filter(t => t.broad_category === selectedBroad && t.type_name === selectedType), [taxonomy, selectedBroad, selectedType]);
  const selectedMaterialDef = useMemo(() => taxonomy.find(t => t.id === selectedSpecificId), [taxonomy, selectedSpecificId]);

  // Smart Batch Generator
  const smartQtyOptions = useMemo(() => {
    if (!selectedMaterialDef) return [];
    const uom = selectedMaterialDef.default_uom;
    if (uom === 'Gallons') return [1, 2, 3, 5, 10];
    if (uom === 'Board Feet') return [5, 10, 20, 50, 100, 250];
    if (uom === 'Grams') return [50, 100, 250, 500, 1000];
    if (uom === 'Kilograms') return [1, 2, 3, 5, 10];
    if (uom === 'Count') return [1, 5, 10, 50, 100, 500];
    return [1, 5, 10, 20, 50]; 
  }, [selectedMaterialDef]);

  // Reset downstream dropdowns
  const handleBroadChange = (e) => { setSelectedBroad(e.target.value); setSelectedType(''); setSelectedSpecificId(''); setQty(''); setIsCustomQty(false); };
  const handleTypeChange = (e) => { setSelectedType(e.target.value); setSelectedSpecificId(''); setQty(''); setIsCustomQty(false); };
  const handleSpecificChange = (e) => { setSelectedSpecificId(e.target.value); setQty(''); setIsCustomQty(false); };
  
  const handleQtySelect = (e) => {
    if (e.target.value === 'custom') { setIsCustomQty(true); setQty(''); } 
    else { setIsCustomQty(false); setQty(e.target.value); }
  };

  // 3. Submit Logic -> DELEGATED TO PARENT/PYTHON ENGINE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSpecificId || !qty || !cost) return;

    setIsSubmitting(true);
    try {
      // We build a pristine payload for your Python engine or Context
      const payload = {
        material_category_id: selectedSpecificId,
        alias: alias || selectedMaterialDef.species_or_specific,
        name: selectedMaterialDef.species_or_specific,
        category: selectedMaterialDef.broad_category,
        qty: parseFloat(qty),
        unit: selectedMaterialDef.default_uom,
        cost_per_unit: parseFloat(cost)
      };

      // Pass it UP. Do not write to DB from here.
      if (onSubmit) {
        await onSubmit(payload);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Error passing data to engine. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingTaxonomy) return <div className="p-20 text-center text-muted font-mono animate-fade-in">SYNCING GLOBAL DICTIONARY...</div>;

  return (
    <div className="intake-form-wrapper animate-fade-in">
      <div className="panel-header">
        <h3 className="no-margin font-mono text-teal">STANDARD MATERIAL INTAKE</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-20 flex-col gap-20">
        
        {/* --- STEP 1: SMART CLASSIFICATION --- */}
        <div className="classification-zone p-15 border-subtle border-radius-2 bg-row-odd">
          <span className="label-industrial mb-10">1. Smart Classification</span>
          
          <div className="flex gap-15 mb-10">
            <div className="flex-1">
              <select className="input-industrial" value={selectedBroad} onChange={handleBroadChange} required>
                <option value="">-- Select Craft --</option>
                {broadCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            
            <div className="flex-1">
              <select className="input-industrial" value={selectedType} onChange={handleTypeChange} disabled={!selectedBroad} required>
                <option value="">-- Select Type --</option>
                {availableTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          </div>

          <div className="w-full">
            <select className="input-industrial" value={selectedSpecificId} onChange={handleSpecificChange} disabled={!selectedType} required>
              <option value="">-- Select Specific Material --</option>
              {availableSpecifics.map(mat => (
                <option key={mat.id} value={mat.id}>{mat.species_or_specific}</option>
              ))}
            </select>
          </div>

          {selectedMaterialDef?.help_text && (
             <div className="mt-15 p-10 border-subtle border-radius-2 bg-panel flex gap-10 align-start">
                <span className="text-orange font-bold">🤖</span>
                <span className="font-small text-muted italic">"{selectedMaterialDef.help_text}"</span>
             </div>
          )}
        </div>

        {/* --- STEP 2: RECEIVING LOGISTICS --- */}
        <div className="logistics-zone p-15 border-subtle border-radius-2 bg-row-even">
           <span className="label-industrial mb-10">2. Receiving Logistics</span>
           
           <div className="mb-15">
             <label className="font-small text-muted mb-5 display-block">Shop Alias (Optional)</label>
             <input 
                type="text" 
                className="input-industrial" 
                placeholder={`e.g., "The good stuff"`}
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                disabled={!selectedSpecificId}
             />
           </div>

           <div className="flex gap-15 align-end">
              <div className="flex-1">
                 <label className="font-small text-muted mb-5 display-block">Quantity Received</label>
                 <div className="flex gap-10 align-center">
                    {!isCustomQty ? (
                      <select className="input-industrial" value={qty} onChange={handleQtySelect} disabled={!selectedSpecificId} required>
                        <option value="">-- Select Batch Size --</option>
                        {smartQtyOptions.map(amount => <option key={amount} value={amount}>{amount}</option>)}
                        <option value="custom">Custom Amount...</option>
                      </select>
                    ) : (
                      <input type="number" step="0.01" className="input-industrial animate-fade-in" placeholder="Exact Qty" value={qty} onChange={(e) => setQty(e.target.value)} autoFocus required />
                    )}
                    <span className="font-mono text-teal whitespace-nowrap">{selectedMaterialDef?.default_uom || 'UNIT'}</span>
                 </div>
              </div>
              
              <div className="flex-1">
                 <label className="font-small text-muted mb-5 display-block">Total Cost ($)</label>
                 <input type="number" step="0.01" className="input-industrial" value={cost} onChange={(e) => setCost(e.target.value)} disabled={!selectedSpecificId} required />
              </div>
           </div>
        </div>

        {/* --- ACTIONS --- */}
        <div className="flex-between mt-10">
           <button type="button" className="btn-ghost" onClick={onCancel} disabled={isSubmitting}>ABORT</button>
           <button type="submit" className="btn-primary" disabled={!selectedSpecificId || !qty || !cost || isSubmitting}>
             {isSubmitting ? 'PROCESSING...' : 'PASS TO ENGINE'}
           </button>
        </div>

      </form>
    </div>
  );
};