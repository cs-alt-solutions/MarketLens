/* src/features/workbench/components/SaleModal.jsx */
import React, { useState } from 'react';
import { CloseIcon, Finance } from '../../../components/Icons';

export const SaleModal = ({ projects, onSave, onClose, isProcessing }) => {
  const [saleData, setSaleData] = useState({
    projectId: '',
    qtySold: 1,
    salePrice: 0,
    salesChannel: 'D2C Website',
    fulfillmentType: 'SHIPPABLE', 
    orderInfo: '' 
  });

  const selectedProject = projects.find(p => p.id.toString() === saleData.projectId.toString());
  const expectedRevenue = selectedProject ? saleData.salePrice * saleData.qtySold : 0;

  const handleProjectSelect = (e) => {
    const proj = projects.find(p => p.id.toString() === e.target.value);
    setSaleData({ 
      ...saleData, 
      projectId: e.target.value, 
      salePrice: proj ? proj.retailPrice : 0 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject && saleData.fulfillmentType !== 'DIGITAL') return;

    // We pass ALL the data to the parent (InventoryManager) to handle the database routing
    await onSave(
        selectedProject, 
        saleData.qtySold, 
        expectedRevenue, 
        saleData.salesChannel,
        {
            type: saleData.fulfillmentType,
            orderInfo: saleData.orderInfo
        }
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window modal-medium p-20" onClick={e => e.stopPropagation()}>
        
        <div className="flex-between mb-20 border-bottom-subtle pb-15">
            <h3 className="m-0 font-large text-neon-teal">LOG NEW SALE</h3>
            <button className="btn-icon-hover-clean" onClick={onClose}><CloseIcon /></button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* UPDATED: Uses the new Global CSS for a cleaner, industrial look */}
          <div className="selector-group mb-20">
             {['SHIPPABLE', 'PHYSICAL', 'DIGITAL'].map(type => (
                 <button 
                    key={type} type="button" 
                    className={`btn-selector ${saleData.fulfillmentType === type ? 'active' : ''}`}
                    onClick={() => setSaleData({...saleData, fulfillmentType: type})}
                 >
                    {type}
                 </button>
             ))}
          </div>

          <div className="lab-form-group mb-15">
            <label className="label-industrial">PRODUCT</label>
            <select className="input-industrial" value={saleData.projectId} onChange={handleProjectSelect} required={saleData.fulfillmentType !== 'DIGITAL'}>
              <option value="">-- Select Product --</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.title} (Stock: {p.stockQty})</option>)}
            </select>
          </div>

          <div className="grid-2-col gap-15 mb-15">
            <div className="lab-form-group">
              <label className="label-industrial">QTY SOLD</label>
              <input type="number" min="1" className="input-industrial" value={saleData.qtySold} onChange={e => setSaleData({...saleData, qtySold: parseInt(e.target.value) || 1})} required />
            </div>
            <div className="lab-form-group">
              <label className="label-industrial">UNIT PRICE</label>
              <input type="number" step="0.01" className="input-industrial" value={saleData.salePrice} onChange={e => setSaleData({...saleData, salePrice: parseFloat(e.target.value) || 0})} required />
            </div>
          </div>

          <div className="grid-2-col gap-15 mb-20">
              <div className="lab-form-group">
                <label className="label-industrial">SALES CHANNEL</label>
                <select className="input-industrial" value={saleData.salesChannel} onChange={e => setSaleData({...saleData, salesChannel: e.target.value})}>
                    <option value="D2C Website">D2C Website</option>
                    <option value="Etsy">Etsy</option>
                    <option value="In-Person Market">In-Person Market</option>
                    <option value="Wholesale">Wholesale</option>
                    <option value="Amazon">Amazon</option>
                </select>
              </div>
              <div className="lab-form-group">
                <label className="label-industrial">ORDER # / CUSTOMER</label>
                <input type="text" className="input-industrial" placeholder="e.g. #10234" value={saleData.orderInfo} onChange={e => setSaleData({...saleData, orderInfo: e.target.value})} />
              </div>
          </div>

          <div className="bg-darker p-15 border-radius-2 mb-20 flex-between">
            <span className="text-muted font-mono font-small">EST. REVENUE:</span>
            <span className="text-neon-teal font-large font-bold">${expectedRevenue.toFixed(2)}</span>
          </div>

          <button type="submit" className="btn-primary w-full py-15" disabled={isProcessing}>
             <Finance /> {isProcessing ? 'RECORDING...' : 'COMPLETE TRANSACTION'}
          </button>
        </form>
      </div>
    </div>
  );
};