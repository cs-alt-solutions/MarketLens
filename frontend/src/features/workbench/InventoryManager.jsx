import React, { useState, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import './InventoryManager.css';
import { Box, History, ChevronDown, ChevronUp, Plus } from '../../components/Icons';
import { StatCard } from '../../components/StatCard';
import { ImagePlaceholder } from '../../components/ImagePlaceholder';
import { formatCurrency } from '../../utils/formatters';
import { TERMINOLOGY } from '../../utils/glossary';

const CATEGORIES = ['Raw Material', 'Packaging', 'Shipping', 'Consumables', 'Hardware', 'Electronics', 'Tools'];

export const InventoryManager = () => {
  const { materials, addAsset, restockAsset } = useInventory(); 
  const [filter, setFilter] = useState('ALL');
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null); 
  const [isExistingItem, setIsExistingItem] = useState(false);
  const [selectedExistingId, setSelectedExistingId] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', brand: '', category: 'Raw Material', unit: 'lbs', qty: '', totalCost: '', status: 'Active'
  });

  // --- LOGIC ---
  const metrics = useMemo(() => {
    let totalValue = 0, lowStockCount = 0, outOfStockCount = 0;
    materials.forEach(m => {
      const val = (m.qty || 0) * m.costPerUnit;
      if (m.status !== 'Discontinued') totalValue += val;
      if (m.status === 'Active') {
        if (m.qty === 0) outOfStockCount++;
        else if (m.qty < 10) lowStockCount++;
      }
    });
    return { totalValue, lowStockCount, outOfStockCount };
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    if (filter === 'ALL') return materials;
    return materials.filter(m => m.status.toUpperCase() === filter);
  }, [materials, filter]);

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

  const handleSubmitIntake = (e) => {
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
    setShowIntakeForm(false);
    setIsExistingItem(false);
    setSelectedExistingId('');
    setFormData({ name: '', brand: '', category: 'Raw Material', unit: 'lbs', qty: '', totalCost: '', status: 'Active' });
  };

  return (
    <div className="inventory-layout">
      <div className="inventory-scroll-area">
        <div className="inventory-header">
          <div>
            <h2 className="header-title">{TERMINOLOGY.INVENTORY.HEADER}</h2>
            <span className="header-subtitle">{TERMINOLOGY.INVENTORY.MANIFEST_LABEL}</span>
          </div>
          <div className="flex-center gap-10">
            <div className="filter-group">
               {['ALL', 'ACTIVE', 'DORMANT'].map(f => (
                 <button 
                    key={f} 
                    onClick={() => setFilter(f)} 
                    className={`filter-btn ${filter === f ? 'active' : ''}`}
                 >
                    {f}
                 </button>
               ))}
            </div>
            <button className="btn-primary" onClick={() => setShowIntakeForm(true)}>
               <Plus /> {TERMINOLOGY.GENERAL.ADD}
            </button>
          </div>
        </div>

        <div className="inventory-metrics">
           <StatCard 
              label="ASSET VALUE" 
              value={formatCurrency(metrics.totalValue)} 
              glowColor="purple" 
           />
           <StatCard 
              label="OUT OF STOCK" 
              value={metrics.outOfStockCount} 
              glowColor={metrics.outOfStockCount > 0 ? 'red' : 'teal'} 
              isAlert={metrics.outOfStockCount > 0} 
           />
           <StatCard 
              label="LOW STOCK" 
              value={metrics.lowStockCount} 
              glowColor={metrics.lowStockCount > 0 ? 'orange' : 'teal'} 
           />
        </div>

        <div className="blueprint-section">
          <div className="floating-manifest-label">{TERMINOLOGY.INVENTORY.MANIFEST_LABEL}</div>
          <table className="inventory-table">
            <thead>
               <tr>
                 <th>ITEM</th>
                 <th>STATUS</th>
                 <th className="td-right">AVG COST</th>
                 <th className="td-center">QTY</th>
                 <th></th>
               </tr>
            </thead>
            <tbody>
              {filteredMaterials.map(m => {
                const isOutOfStock = m.qty === 0;
                const isExpanded = expandedRowId === m.id;
                const barWidth = Math.min((m.qty / 100) * 100, 100);

                return (
                  <React.Fragment key={m.id}>
                    <tr className={`inventory-row ${isOutOfStock ? 'status-alert' : ''}`} onClick={() => setSelectedMaterial(m)}>
                      <td className="td-cell">
                        <div className="cell-name">{m.name}</div>
                        <div className="cell-meta">{m.brand}</div>
                      </td>
                      <td className="td-cell">
                        <div className={`flex-center-start font-bold ${isOutOfStock ? 'text-alert' : 'text-good'}`}>
                            <Box /> {isOutOfStock ? 'OUT' : 'STOCKED'}
                        </div>
                      </td>
                      <td className="td-cell td-right cell-meta">{formatCurrency(m.costPerUnit)}</td>
                      <td className="td-cell td-center">
                        <div className="flex-col-center">
                            <div className="font-bold">{m.qty} <span className="text-muted">{m.unit}</span></div>
                            <div className="progress-bar-track">
                                <div className={`progress-bar-fill ${isOutOfStock ? 'status-alert' : ''}`} style={{ width: `${barWidth}%` }} />
                            </div>
                        </div>
                      </td>
                      <td className="td-cell">
                         <button onClick={(e) => { e.stopPropagation(); setExpandedRowId(isExpanded ? null : m.id); }} className="btn-icon">
                           {isExpanded ? <ChevronUp /> : <ChevronDown />}
                         </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="history-expansion">
                        <td colSpan="6" className="no-pad">
                          <div className="history-inner">
                             <span className="label-industrial text-accent"><History /> {TERMINOLOGY.INVENTORY.HISTORY_LOG}</span>
                             <table className="mini-history-table">
                               <thead><tr><th>DATE</th><th>QTY</th><th>TOTAL</th></tr></thead>
                               <tbody>
                                 {m.history?.map((h, i) => (
                                   <tr key={i}><td>{h.date}</td><td className="text-good">+{h.qty}</td><td>{formatCurrency(h.qty * h.unitCost)}</td></tr>
                                 ))}
                               </tbody>
                             </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sidebar-col">
         <div className="keyword-header">
           <h3 className="label-industrial glow-purple">
             {showIntakeForm ? (isExistingItem ? TERMINOLOGY.INVENTORY.RESTOCK : TERMINOLOGY.INVENTORY.INTAKE) : TERMINOLOGY.INVENTORY.ASSET_DETAILS}
           </h3>
        </div>
        <div className="keyword-list">
          {showIntakeForm ? (
            <div className="sidebar-panel animate-fade-in">
              <div className="sidebar-inner">
                <form onSubmit={handleSubmitIntake}>
                  <div className="flex-center mb-20 gap-10">
                    <input 
                      type="checkbox" 
                      checked={isExistingItem} 
                      onChange={(e) => setIsExistingItem(e.target.checked)} 
                    />
                    <label className="label-industrial no-margin">{TERMINOLOGY.INVENTORY.RESTOCK}</label>
                  </div>

                  {isExistingItem && (
                    <div className="lab-form-group">
                      <label className="label-industrial">SELECT ASSET</label>
                      <select className="input-industrial" value={selectedExistingId} onChange={handleExistingSelect}>
                        <option value="">-- Select Material --</option>
                        {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                    </div>
                  )}

                  {!isExistingItem && (
                    <>
                      <div className="lab-form-group">
                        <label className="label-industrial">MATERIAL NAME</label>
                        <input 
                            className="input-industrial" 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                            placeholder="e.g. Soy Wax" 
                        />
                      </div>
                      <div className="lab-form-group">
                        <label className="label-industrial">CATEGORY</label>
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
                      <label className="label-industrial">ADD QTY</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        className="input-industrial" 
                        value={formData.qty} 
                        onChange={e => setFormData({...formData, qty: e.target.value})} 
                      />
                    </div>
                    <div className="lab-form-group">
                      <label className="label-industrial">TOTAL COST</label>
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
                    <button type="button" className="btn-ghost" onClick={() => setShowIntakeForm(false)}>{TERMINOLOGY.GENERAL.CANCEL}</button>
                    <button type="submit" className="btn-primary">{TERMINOLOGY.GENERAL.SAVE}</button>
                  </div>
                </form>
              </div>
            </div>
          ) : selectedMaterial ? (
            <div className="sidebar-panel animate-fade-in">
              <ImagePlaceholder height="180px" label="ITEM PHOTO" />
              <div className="sidebar-inner">
                <h3 className="detail-title">{selectedMaterial.name}</h3>
                <div className="detail-brand">BRAND: {selectedMaterial.brand || 'N/A'}</div>
                <div className="stock-grid">
                  <div className="stock-box">
                    <div className="stock-label">STOCK</div>
                    <div className="stock-value">{selectedMaterial.qty}</div>
                  </div>
                  <div className="stock-box">
                    <div className="stock-label">COST</div>
                    <div className="stock-value text-accent">{formatCurrency(selectedMaterial.costPerUnit)}</div>
                  </div>
                </div>
                <button className="btn-ghost w-full mt-20" onClick={() => setSelectedMaterial(null)}>
                  {TERMINOLOGY.GENERAL.CLOSE}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted pad-20 italic">
               Select an asset to view technical logs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};