/* src/features/workbench/components/SaleModal.jsx */
import React, { useState } from 'react';
import { TERMINOLOGY } from '../../../utils/glossary';
import { formatCurrency } from '../../../utils/formatters';

export const SaleModal = ({ projects, onSave, onClose, isProcessing }) => {
  const [saleData, setSaleData] = useState({ projectId: '', qty: 1 });
  
  const selectedProject = projects.find(p => p.id.toString() === saleData.projectId.toString());
  const expectedRevenue = selectedProject ? (selectedProject.retailPrice * saleData.qty) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedProject) onSave(selectedProject, saleData.qty, expectedRevenue);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-window modal-medium animate-fade-in">
        <div className="panel-header flex-between">
          <span className="font-bold font-large">{TERMINOLOGY.FINANCE.RECORD_SALE}</span>
        </div>
        <div className="panel-content pad-20 bg-app">
          <form onSubmit={handleSubmit}>
            <div className="lab-form-group mb-20">
              <label className="label-industrial">{TERMINOLOGY.GENERAL.SELECT_PRODUCT}</label>
              <select 
                className="input-industrial" 
                value={saleData.projectId} 
                onChange={e => setSaleData({...saleData, projectId: e.target.value})} 
                required
              >
                <option value="">-- Choose item --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title} ({p.stockQty} in stock)</option>
                ))}
              </select>
            </div>
            <div className="lab-form-group mb-20">
              <label className="label-industrial">{TERMINOLOGY.FINANCE.QTY_SOLD}</label>
              <input 
                type="number" 
                className="input-industrial text-large font-bold text-center" 
                value={saleData.qty} 
                onChange={e => setSaleData({...saleData, qty: e.target.value})} 
                min="1" 
                required 
              />
            </div>
            <div className="flex-between bg-row-odd p-15 border-radius-2 border-subtle mb-20">
              <span className="label-industrial no-margin text-muted">{TERMINOLOGY.FINANCE.EXPECTED_REVENUE}</span>
              <span className="text-good font-bold text-large">{formatCurrency(expectedRevenue)}</span>
            </div>
            <div className="flex-between gap-10">
              <button type="button" className="btn-ghost w-full" onClick={onClose}>
                {TERMINOLOGY.GENERAL.CANCEL}
              </button>
              <button type="submit" className="btn-primary w-full" disabled={isProcessing || !selectedProject}>
                {TERMINOLOGY.GENERAL.CONFIRM}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};