import React, { useState } from 'react';
import { useInventory } from '../../../context/InventoryContext';
import { TERMINOLOGY, CATEGORY_KEYWORDS, COMMON_ASSETS } from '../../../utils/glossary';

// Derived from Glossary to ensure Single Source of Truth
const CATEGORIES = Object.keys(CATEGORY_KEYWORDS);

export const IntakeForm = ({ onClose }) => {
  const { materials, addAsset, restockAsset } = useInventory();
  
  const [isExistingItem, setIsExistingItem] = useState(false);
  const [selectedExistingId, setSelectedExistingId] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', 
    brand: '', 
    category: 'Raw Material', 
    unit: 'lbs', 
    qty: '', 
    totalCost: '', 
    status: 'Active'
  });

  const handleNameChange = (e) => {
    const text = e.target.value;
    const lowerText = text.toLowerCase();
    
    let predictedCategory = formData.category;

    // Auto-predict category based on Glossary keywords
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        predictedCategory = cat;
        break; 
      }
    }

    setFormData({ ...formData, name: text, category: predictedCategory });
  };

  const handleExistingSelect = (e) => {
    const id = e.target.value;
    setSelectedExistingId(id);
    const existing = materials.find(m => m.id === parseInt(id));
    if (existing) {
      setFormData({ 
        ...formData, 
        name: existing.name, 
        brand: existing.brand || '', 
        category: existing.category, 
        unit: existing.unit 
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.qty || !formData.totalCost) return;

    if (isExistingItem && selectedExistingId) {
      restockAsset(parseInt(selectedExistingId), parseFloat(formData.qty), parseFloat(formData.totalCost));
    } else {
      const unitCost = parseFloat(formData.totalCost) / parseFloat(formData.qty);
      addAsset({ 
        ...formData, 
        id: Date.now(), 
        costPerUnit: unitCost, 
        lastUsed: new Date().toISOString().split('T')[0], 
        history: [{ 
            date: new Date().toISOString().split('T')[0], 
            qty: parseFloat(formData.qty), 
            unitCost,
            type: 'INITIAL_INTAKE'
        }] 
      });
    }
    
    // Reset and Close
    setFormData({ name: '', brand: '', category: 'Raw Material', unit: 'lbs', qty: '', totalCost: '', status: 'Active' });
    onClose();
  };

  return (
    <div className="sidebar-panel animate-fade-in">
      <div className="sidebar-inner">
        <form onSubmit={handleSubmit}>
          <div className="flex-center mb-20 gap-10">
            <input 
                type="checkbox" 
                checked={isExistingItem} 
                onChange={(e) => setIsExistingItem(e.target.checked)} 
            />
            <label className="label-industrial no-margin">{TERMINOLOGY.INVENTORY.RESTOCK}</label>
          </div>

          {isExistingItem ? (
            <div className="lab-form-group">
              <label className="label-industrial">{TERMINOLOGY.INVENTORY.SELECT_ASSET}</label>
              <select className="input-industrial" value={selectedExistingId} onChange={handleExistingSelect}>
                <option value="">-- Select Material --</option>
                {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          ) : (
            <>
              <div className="lab-form-group">
                <label className="label-industrial">{TERMINOLOGY.INVENTORY.MATERIAL_NAME}</label>
                <input 
                   className="input-industrial" 
                   value={formData.name} 
                   onChange={handleNameChange} 
                   list="common-assets-list" 
                   placeholder={TERMINOLOGY.GENERAL.TYPE_SEARCH}
                />
                <datalist id="common-assets-list">
                   {COMMON_ASSETS.map((asset, i) => (
                      <option key={i} value={asset} />
                   ))}
                </datalist>
              </div>
              <div className="lab-form-group">
                <label className="label-industrial">{TERMINOLOGY.GENERAL.CATEGORY}</label>
                <select 
                    className="input-industrial" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </>
          )}

          <div className="lab-form-row">
            <div className="lab-form-group">
              <label className="label-industrial">{TERMINOLOGY.INVENTORY.ADD_QTY}</label>
              <input 
                type="number" 
                step="0.01" 
                className="input-industrial" 
                value={formData.qty} 
                onChange={e => setFormData({...formData, qty: e.target.value})} 
              />
            </div>
            <div className="lab-form-group">
              <label className="label-industrial">{TERMINOLOGY.INVENTORY.TOTAL_COST}</label>
              <input 
                type="number" 
                step="0.01" 
                className="input-industrial" 
                value={formData.totalCost} 
                onChange={e => setFormData({...formData, totalCost: e.target.value})} 
              />
            </div>
          </div>

          <div className="flex-end gap-10 mt-20">
            <button type="button" className="btn-ghost" onClick={onClose}>{TERMINOLOGY.GENERAL.CANCEL}</button>
            <button type="submit" className="btn-primary">{TERMINOLOGY.GENERAL.SAVE}</button>
          </div>
        </form>
      </div>
    </div>
  );
};