/* src/features/workbench/components/IntakeForm.jsx */
import React, { useState } from 'react';
import { useInventory } from '../../../context/InventoryContext';
import { TERMINOLOGY, CATEGORY_KEYWORDS, COMMON_ASSETS } from '../../../utils/glossary';

const CATEGORIES = Object.keys(CATEGORY_KEYWORDS);

export const IntakeForm = ({ onClose }) => {
  const { materials, addInventoryItem, updateInventoryItem } = useInventory();
  
  const [isExistingItem, setIsExistingItem] = useState(false);
  const [selectedExistingId, setSelectedExistingId] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', brand: '', category: CATEGORIES[0], unit: 'count', qty: '', totalCost: '', status: 'Active'
  });

  const handleNameChange = (e) => {
    const text = e.target.value;
    const lowerText = text.toLowerCase();
    let predictedCategory = formData.category;

    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) { predictedCategory = cat; break; }
    }
    setFormData({ ...formData, name: text, category: predictedCategory });
  };

  const handleExistingSelect = (e) => {
    const id = e.target.value;
    setSelectedExistingId(id);
    const existing = materials.find(m => m.id.toString() === id.toString());
    if (existing) {
      setFormData({ ...formData, name: existing.name, brand: existing.brand || '', category: existing.category, unit: existing.unit });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.qty || !formData.totalCost) return;

    const addedQty = parseFloat(formData.qty);
    const totalCost = parseFloat(formData.totalCost);
    const newUnitCost = totalCost / addedQty;

    // Create the ledger entry for additions
    const historyEntry = {
        date: new Date().toISOString(),
        qty: addedQty,
        unitCost: newUnitCost,
        type: isExistingItem ? 'RESTOCK' : 'INITIAL_INTAKE'
    };

    if (isExistingItem && selectedExistingId) {
      const existing = materials.find(m => m.id.toString() === selectedExistingId.toString());
      if (existing) {
        const newTotalQty = (existing.qty || 0) + addedQty;
        const newHistory = [historyEntry, ...(existing.history || [])];
        
        await updateInventoryItem(selectedExistingId, {
            qty: newTotalQty,
            costPerUnit: newUnitCost, 
            status: 'Active',
            history: newHistory
        });
      }
    } else {
      await addInventoryItem({ 
        name: formData.name, brand: formData.brand, category: formData.category, unit: formData.unit,
        qty: addedQty, costPerUnit: newUnitCost, status: 'Active',
        history: [historyEntry]
      });
    }
    
    onClose();
  };

  return (
    <div className="sidebar-panel animate-fade-in pad-20">
        <form onSubmit={handleSubmit}>
          <div className="flex-center mb-20 gap-10 bg-row-odd p-10 border-radius-2 border-subtle">
            <input type="checkbox" checked={isExistingItem} onChange={(e) => setIsExistingItem(e.target.checked)} />
            <label className="label-industrial no-margin clickable" onClick={() => setIsExistingItem(!isExistingItem)}>
                {TERMINOLOGY.INVENTORY.RESTOCK}
            </label>
          </div>

          {isExistingItem ? (
            <div className="lab-form-group mb-20">
              <label className="label-industrial">{TERMINOLOGY.INVENTORY.SELECT_ASSET}</label>
              <select className="input-industrial" value={selectedExistingId} onChange={handleExistingSelect}>
                <option value="">-- Select Material --</option>
                {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          ) : (
            <>
              <div className="lab-form-group mb-10">
                <label className="label-industrial">{TERMINOLOGY.INVENTORY.MATERIAL_NAME}</label>
                <input className="input-industrial" value={formData.name} onChange={handleNameChange} list="common-assets-list" placeholder={TERMINOLOGY.GENERAL.TYPE_SEARCH} />
                <datalist id="common-assets-list">{COMMON_ASSETS.map((asset, i) => <option key={i} value={asset} />)}</datalist>
              </div>
              <div className="lab-form-group mb-10">
                <label className="label-industrial">{TERMINOLOGY.GENERAL.CATEGORY}</label>
                <select className="input-industrial" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="lab-form-group mb-20">
                <label className="label-industrial">Unit of Measurement</label>
                <input className="input-industrial" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} placeholder="e.g., lb, oz, jar, box" />
              </div>
            </>
          )}

          <div className="flex-between gap-10 mb-20">
            <div className="lab-form-group w-full">
              <label className="label-industrial">{TERMINOLOGY.INVENTORY.ADD_QTY}</label>
              <input type="number" step="0.01" className="input-industrial text-large font-bold text-center" value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} placeholder="0" />
            </div>
            <div className="lab-form-group w-full">
              <label className="label-industrial">{TERMINOLOGY.INVENTORY.TOTAL_COST}</label>
              <input type="number" step="0.01" className="input-industrial text-large font-bold text-center text-good" value={formData.totalCost} onChange={e => setFormData({...formData, totalCost: e.target.value})} placeholder="$0.00" />
            </div>
          </div>

          <div className="flex-end gap-10 mt-20 pt-20 border-top-dashed">
            <button type="button" className="btn-ghost" onClick={onClose}>{TERMINOLOGY.GENERAL.CANCEL}</button>
            <button type="submit" className="btn-primary w-full">{TERMINOLOGY.GENERAL.SAVE}</button>
          </div>
        </form>
    </div>
  );
};