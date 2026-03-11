/* src/features/workbench/components/wizard/Step3Fulfillment.jsx */
import React from 'react';

export const Step3Fulfillment = ({ localProject, handleUpdate }) => {
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

  const addFulfillmentRow = () => {
    handleUpdate('recipe', [...recipe, { name: '', category: 'Shipping', reqPerUnit: 1, costPerUnit: 0, isPlaceholder: false }]);
  };

  // 🚀 Calculate ONLY the packaging/shipping materials showing on this page
  const totalFulfillmentCost = recipe.reduce((sum, item) => {
      if (!['Packaging', 'Shipping'].includes(item.category)) return sum;
      const qty = parseFloat(item.reqPerUnit) || 0;
      const cost = parseFloat(item.costPerUnit) || 0;
      return sum + (qty * cost);
  }, 0);
return (
    <div className="flex-col h-full animate-fade-in w-full pb-30">
      
      {/* 🚀 UPGRADED HEADER: Matches Step 2 perfectly */}
      <div className="flex-col align-center w-full mb-30 border-bottom-subtle pb-20">
        <h2 className="text-neon-teal wizard-title-large text-center mb-10">
            Logistics & Packing Station
        </h2>
        <p className="text-muted wizard-subtitle text-center max-w-600 mb-15">
            How are we getting <span className="text-main font-bold">"{localProject.title || 'this'}"</span> to the customer? 
        </p>
        <div className="notice-pill-teal">
            <span>ONLY ADD BOXES, MAILERS, AND PACKING MATERIALS HERE</span>
        </div>
      </div>

      <div className="bom-scratchpad-container">
          <div className="bom-grid-header">
              <span className="label-industrial text-muted">SHIPPING MATERIAL</span>
              <span className="label-industrial text-muted text-center">QTY</span>
              <span className="label-industrial text-muted text-center">UNIT</span>
              <span className="label-industrial text-muted text-center">EST. COST</span>
              <span></span>
          </div>
          
          <div className="bom-rows-wrapper flex-col gap-10">
              {recipe.map((item, index) => {
                  if (!['Packaging', 'Shipping'].includes(item.category)) return null;
                  
                  // Same smart unit default we used in Step 2!
                  const currentUnit = item.unit || 'ea';
                  
                  return (
                      <div key={index} className={`bom-row ${item.isPlaceholder ? 'is-placeholder' : ''}`}>
                          <div className="bom-input-group flex-1">
                              <span className="bom-category-tag">{item.category}</span>
                              <input
                                  className="input-bom-text"
                                  placeholder={item.isPlaceholder ? `e.g. ${item.name}` : 'Mailer, Box, Tape...'}
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

                          {/* 🚀 Add the Unit Dropdown here too! */}
                          <div className="bom-input-group w-80">
                              <select 
                                  className="unit-dropdown"
                                  value={currentUnit}
                                  onChange={(e) => handleRecipeChange(index, 'unit', e.target.value)}
                              >
                                  {['ea', 'count', 'box', 'jar', 'roll', 'rolls', 'oz', 'lb', 'lbs', 'g', 'kg', 'fl oz', 'gal', 'L', 'ml', 'in', 'ft', 'yd', 'cm'].map(u => (
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
          <button className="bom-add-btn mt-10" onClick={addFulfillmentRow}>+ ADD SHIPPING SUPPLY</button>
      </div>

      <div className="bom-total-banner mt-30 mb-20">
          <div className="flex-col">
              <span className="label-industrial text-neon-teal">FULFILLMENT OVERHEAD</span>
              <span className="text-tiny text-muted mt-5">Cost of materials to pack ONE unit (Excludes postage).</span>
          </div>
          <div className="profit-total-large text-neon-teal font-mono font-bold">
              ${totalFulfillmentCost.toFixed(2)}
          </div>
      </div>
    </div>
  );
};