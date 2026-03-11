/* src/features/workbench/components/wizard/Step2Product.jsx */
import React from 'react';

// 🚀 EXACT match to your units.js keys to ensure the math engine never breaks
const UNIT_OPTIONS = [
  'ea', 'count', 'box', 'jar', 'roll', 'rolls', // Count
  'oz', 'lb', 'lbs', 'g', 'kg',                 // Weight
  'fl oz', 'gal', 'L', 'ml',                    // Volume
  'in', 'ft', 'yd', 'cm'                        // Length
];

export const Step2Product = ({ localProject, handleUpdate }) => {
  const recipe = localProject.recipe || [];

  const handleRecipeChange = (index, field, value) => {
    const updatedRecipe = [...recipe];
    updatedRecipe[index] = { ...updatedRecipe[index], [field]: value, isPlaceholder: false };
    handleUpdate('recipe', updatedRecipe);
  };

  const removeRow = (index) => {
    const updatedRecipe = recipe.filter((_, i) => i !== index);
    handleUpdate('recipe', updatedRecipe);
  };

  const addCoreRow = () => {
    // 🚀 Defaults to 'ea' so the dropdown always has a valid starting state
    handleUpdate('recipe', [...recipe, { name: '', category: 'Raw Material', reqPerUnit: 1, unit: 'ea', costPerUnit: 0, isPlaceholder: false }]);
  };

  const totalProductCost = recipe.reduce((sum, item) => {
      if (['Packaging', 'Shipping'].includes(item.category)) return sum;
      const qty = parseFloat(item.reqPerUnit) || 0;
      const cost = parseFloat(item.costPerUnit) || 0;
      return sum + (qty * cost);
  }, 0);

  // 🚀 SMART DEFAULT ENGINE: Guesses the unit based on material name
  const getPlaceholderUnit = (name) => {
      const lower = name?.toLowerCase() || '';
      if (lower.includes('wax') || lower.includes('resin') || lower.includes('fragrance') || lower.includes('oil')) return 'oz';
      if (lower.includes('wood') || lower.includes('lumber')) return 'in';
      if (lower.includes('liquid') || lower.includes('spray')) return 'fl oz';
      return 'ea'; // Default catch-all
  };

  return (
    <div className="flex-col h-full animate-fade-in w-full pb-30">
      
      <div className="flex-col align-center w-full mb-30 border-bottom-subtle pb-20">
        <h2 className="text-neon-teal wizard-title-large text-center mb-10">
            The Workbench Build
        </h2>
        <p className="text-muted wizard-subtitle text-center max-w-600 mb-15">
            What raw materials go into making <span className="text-main font-bold">"{localProject.title || 'this project'}"</span>? 
        </p>
        <div className="notice-pill-teal">
            <span>LEAVE SHIPPING & BOXES FOR THE NEXT STEP</span>
        </div>
      </div>

      <div className="bom-scratchpad-container">
          <div className="bom-grid-header">
              <span className="label-industrial text-muted">MATERIAL / COMPONENT</span>
              <span className="label-industrial text-muted text-center">QTY</span>
              <span className="label-industrial text-muted text-center">UNIT</span>
              <span className="label-industrial text-muted text-center">EST. COST</span>
              <span></span>
          </div>
          
          <div className="bom-rows-wrapper flex-col gap-10">
              {recipe.map((item, index) => {
                  if (['Packaging', 'Shipping'].includes(item.category)) return null;
                  
                  // Determine the current unit (use saved unit, or guess based on name)
                  const currentUnit = item.unit || getPlaceholderUnit(item.name);

                  return (
                      <div key={index} className={`bom-row ${item.isPlaceholder ? 'is-placeholder' : ''}`}>
                          <div className="bom-input-group flex-1">
                              <span className="bom-category-tag">{item.category}</span>
                              <input
                                  className="input-bom-text"
                                  placeholder={item.isPlaceholder ? `e.g. ${item.name}` : 'Material Name'}
                                  value={item.isPlaceholder ? '' : item.name}
                                  onChange={(e) => handleRecipeChange(index, 'name', e.target.value)}
                              />
                          </div>
                          
                          <div className="bom-input-group w-80">
                              <input
                                  type="number" className="input-bom-num text-center" min="0" step="0.01"
                                  value={item.reqPerUnit}
                                  onChange={(e) => handleRecipeChange(index, 'reqPerUnit', e.target.value)}
                              />
                          </div>

                          {/* 🚀 THE LOCKED-DOWN DROPDOWN */}
                          <div className="bom-input-group w-80">
                              <select 
                                  className="unit-dropdown"
                                  value={currentUnit}
                                  onChange={(e) => handleRecipeChange(index, 'unit', e.target.value)}
                              >
                                  {UNIT_OPTIONS.map(u => (
                                      <option key={u} value={u}>{u}</option>
                                  ))}
                              </select>
                          </div>

                          <div className="bom-input-group w-100 flex-start align-center px-10">
                              <span className="text-muted mr-5">$</span>
                              <input
                                  type="number" className="input-bom-num" min="0" step="0.01" placeholder="0.00"
                                  value={item.costPerUnit || ''}
                                  onChange={(e) => handleRecipeChange(index, 'costPerUnit', e.target.value)}
                              />
                          </div>
                          
                          <button className="bom-remove-btn" onClick={() => removeRow(index)} title="Remove Item">✕</button>
                      </div>
                  );
              })}
          </div>
          <button className="bom-add-btn mt-10" onClick={addCoreRow}>+ ADD COMPONENT</button>
      </div>

      <div className="bom-total-banner mt-30 mb-20">
          <div className="flex-col">
              <span className="label-industrial text-neon-teal">BASE PRODUCT COST</span>
              <span className="text-tiny text-muted mt-5">Cost to physically build ONE unit (Excludes shipping).</span>
          </div>
          <div className="profit-total-large text-neon-teal font-mono font-bold">
              ${totalProductCost.toFixed(2)}
          </div>
      </div>
    </div>
  );
};