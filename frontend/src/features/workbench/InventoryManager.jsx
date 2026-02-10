import React, { useState, useMemo } from 'react';
import { useWorkbench } from '../../context/WorkbenchContext';
import './InventoryManager.css';
// NEW IMPORTS
import { Box, Alert, Plus, History, ChevronDown, ChevronUp } from '../../components/Icons';
import { StatCard } from '../../components/StatCard';

const CATEGORIES = ['Raw Material', 'Packaging', 'Shipping', 'Consumables', 'Hardware', 'Electronics', 'Tools'];
const UNITS = { 'Weight': ['lbs', 'oz', 'kg'], 'Volume': ['gal', 'fl oz', 'L'], 'Length': ['ft', 'yd'], 'Count': ['count', 'box', 'ea'] };

export const InventoryManager = () => {
  const { materials, addAsset, restockAsset, projects } = useWorkbench(); 
  const [filter, setFilter] = useState('ALL');
  const [expandedProject, setExpandedProject] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);

  // UI State
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null); 
  const [isExistingItem, setIsExistingItem] = useState(false);
  const [selectedExistingId, setSelectedExistingId] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', brand: '', category: 'Raw Material', unitType: 'Weight', unit: 'lbs', qty: '', totalCost: '', 
    status: 'Active', usageType: 'Project Component', linkedProjectId: '' 
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
    if (filter === 'OUT_OF_STOCK') return materials.filter(m => m.qty === 0 && m.status === 'Active');
    return materials.filter(m => m.status.toUpperCase() === filter);
  }, [materials, filter]);

  const projectReadiness = useMemo(() => {
    const projectMap = {};
    projects.forEach(p => { 
      projectMap[p.title] = { id: p.id, title: p.title, materials: [], status: 'READY', limitingFactor: Infinity }; 
    });
    
    materials.forEach(m => {
      if (m.usageType === 'Project Component' && m.status !== 'Discontinued') {
         const isLow = m.qty < 10 && m.qty > 0;
         const isOut = m.qty === 0;
         const linkedTitle = projects[0]?.title || 'Unknown'; 
         if(projectMap[linkedTitle]) {
             projectMap[linkedTitle].materials.push({ ...m, health: isOut ? 'CRITICAL' : isLow ? 'LOW' : 'GOOD' });
         }
      }
    });
    return Object.values(projectMap).filter(p => p.materials.length > 0);
  }, [materials, projects]);


  // --- HANDLERS ---
  const toggleHistoryRow = (e, id) => {
    e.stopPropagation();
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const resetForm = (keepOpen = false) => {
    if (!keepOpen) setShowIntakeForm(false);
    setIsExistingItem(false);
    setSelectedExistingId('');
    setFormData({ name: '', brand: '', category: 'Raw Material', unitType: 'Weight', unit: 'lbs', qty: '', totalCost: '', status: 'Active', usageType: 'Project Component', linkedProjectId: '' });
  };

  const handleSelectMaterial = (m) => {
    setSelectedMaterial(m);
    setShowIntakeForm(false);
    setIsExistingItem(true);
    setSelectedExistingId(m.id);
  };

  const handleQuickRestock = () => {
    if (!selectedMaterial) return;
    setFormData(prev => ({ ...prev, name: selectedMaterial.name, brand: selectedMaterial.brand || '', category: selectedMaterial.category, unit: selectedMaterial.unit }));
    setIsExistingItem(true); 
    setSelectedExistingId(selectedMaterial.id); 
    setShowIntakeForm(true); 
    setSelectedMaterial(null);
  };

  const handleExistingSelect = (e) => {
    const id = parseInt(e.target.value); 
    setSelectedExistingId(id);
    if (!id) { resetForm(true); return; }
    const existing = materials.find(m => m.id === id);
    if (existing) {
      setFormData(prev => ({ ...prev, name: existing.name, brand: existing.brand || '', category: existing.category, unit: existing.unit }));
    }
  };

  const handleSubmitIntake = (e) => {
    e.preventDefault();
    if (!formData.qty || !formData.totalCost) return;
    const newQty = parseFloat(formData.qty);
    const totalCost = parseFloat(formData.totalCost);

    if (isExistingItem && selectedExistingId) {
      restockAsset(selectedExistingId, newQty, totalCost);
    } else {
      const unitCost = totalCost / newQty;
      const today = new Date().toISOString().split('T')[0];
      const newItem = {
        id: Date.now(), 
        name: formData.name, 
        brand: formData.brand, 
        category: formData.category, 
        qty: newQty, 
        unit: formData.unit, 
        costPerUnit: unitCost, 
        status: 'Active', 
        usageType: formData.usageType, 
        linkedProject: 'N/A', 
        lastUsed: today, 
        history: [{ date: today, qty: newQty, unitCost: unitCost }]
      };
      addAsset(newItem);
    }
    resetForm();
  };

  const currentItemSnapshot = useMemo(() => {
      if (!isExistingItem || !selectedExistingId) return null;
      return materials.find(m => m.id === selectedExistingId);
  }, [isExistingItem, selectedExistingId, materials]);

  const toggleProject = (title) => setExpandedProject(expandedProject === title ? null : title);

  return (
    <div className="inventory-layout">
      <div className="inventory-scroll-area">
        {/* HEADER */}
        <div className="inventory-header">
          <h2 className="header-title">SUPPLY LOCKER</h2>
          <div className="filter-group">
             {['ALL', 'ACTIVE', 'DORMANT'].map(f => (
               <button key={f} onClick={() => setFilter(f)} className={`filter-btn ${filter === f ? 'active' : ''}`}>{f}</button>
             ))}
          </div>
        </div>

        {/* METRICS ROW (Replaced with StatCard) */}
        <div className="inventory-metrics">
           <StatCard 
             label="ASSET VALUE" 
             value={`$${metrics.totalValue.toLocaleString(undefined, {minimumFractionDigits: 0})}`} 
             glowColor="purple" 
           />
           
           <StatCard 
             label="OUT OF STOCK" 
             value={metrics.outOfStockCount} 
             glowColor={metrics.outOfStockCount > 0 ? 'red' : 'teal'}
             isAlert={metrics.outOfStockCount > 0}
             onClick={() => metrics.outOfStockCount > 0 && setFilter('OUT_OF_STOCK')}
           />
           
           <StatCard 
             label="LOW STOCK" 
             value={metrics.lowStockCount} 
             glowColor={metrics.lowStockCount > 0 ? 'orange' : 'teal'}
           />
        </div>

        {/* TABLE SECTION */}
        <div className="blueprint-section">
          <div className="floating-manifest-label">MATERIAL MANIFEST</div>
          
          <table className="inventory-table">
            <thead>
               <tr className="table-header-row">
                 <th>NAME / PROJECT</th>
                 <th>STATUS</th>
                 <th>LAST USED</th>
                 <th className="td-right">AVG COST</th>
                 <th className="td-center">QTY</th>
                 <th></th>
               </tr>
            </thead>
            <tbody>
              {filteredMaterials.map(m => {
                const isOutOfStock = m.qty === 0;
                const isLowStock = m.qty < 10 && m.qty > 0;
                const isExpanded = expandedRowId === m.id;
                
                let statusClass = 'glow-teal'; let StatusIcon = Box; let statusText = 'STOCKED';
                if (isOutOfStock) { statusClass = 'glow-red'; StatusIcon = Alert; statusText = 'OUT OF STOCK'; }
                else if (isLowStock) { statusClass = 'glow-orange'; StatusIcon = Alert; statusText = 'LOW STOCK'; } 
                else if (m.status === 'Dormant') { statusClass = 'text-muted'; StatusIcon = Box; statusText = 'DORMANT'; }
                
                // NEW: Calculate visual bar width (capped at 100%)
                const maxStock = 100; // Arbitrary "full" amount for visualization
                const barWidth = Math.min((m.qty / maxStock) * 100, 100);
                const barColor = isOutOfStock ? 'var(--neon-red)' : isLowStock ? 'var(--neon-orange)' : 'var(--neon-teal)';

                return (
                  <React.Fragment key={m.id}>
                    <tr className={`inventory-row ${selectedMaterial?.id === m.id ? 'selected' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`} onClick={() => handleSelectMaterial(m)}>
                      <td className="td-cell">
                        <div className={`cell-name ${isOutOfStock ? 'glow-red' : ''}`}>{m.name}</div>
                        <div className="cell-meta">{m.brand}</div>
                      </td>
                      <td className="td-cell">
                        <div className={`status-cell ${statusClass}`} style={{display:'flex', alignItems:'center', gap:'5px', fontSize:'0.75rem', fontWeight:700}}><StatusIcon /> {statusText}</div>
                      </td>
                      <td className="td-cell cell-meta">{m.lastUsed}</td>
                      <td className="td-cell td-right cell-meta">${m.costPerUnit.toFixed(2)}</td>
                      
                      {/* UPDATED: QTY CELL WITH HEALTH BAR */}
                      <td className="td-cell td-center">
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'2px'}}>
                            <div style={{fontWeight: 700}} className={isOutOfStock ? 'glow-red' : 'text-main'}>
                                {m.qty} <span style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>{m.unit}</span>
                            </div>
                            <div style={{width:'60px', height:'3px', background:'rgba(255,255,255,0.1)', borderRadius:'2px', overflow:'hidden'}}>
                                <div style={{width: `${barWidth}%`, height:'100%', background: barColor, transition:'width 0.5s ease'}}></div>
                            </div>
                        </div>
                      </td>

                      <td className="td-cell">
                        <div className="cell-actions">
                           <button onClick={(e) => toggleHistoryRow(e, m.id)} className="btn-icon" style={{color: isExpanded ? 'var(--neon-cyan)' : 'var(--text-muted)'}}>
                             {isExpanded ? <ChevronUp /> : <Plus />}
                           </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* EXPANSION ROW (HISTORY) */}
                    {isExpanded && (
                      <tr className="history-expansion">
                        <td colSpan="6" style={{padding:0}}>
                          <div className="history-inner">
                             <div className="flex-between" style={{marginBottom:'10px'}}>
                               <span className="label-industrial" style={{margin:0, color:'var(--neon-cyan)'}}><History /> PURCHASE HISTORY LOG</span>
                               <span style={{fontSize:'0.65rem', color:'var(--text-muted)'}}>ID: {m.id}</span>
                             </div>
                             {/* ... (History table content remains same) ... */}
                             {m.history && m.history.length > 0 ? (
                               <table className="mini-history-table">
                                 <thead>
                                   <tr>
                                     <th>DATE</th>
                                     <th>ACTIVITY</th>
                                     <th>QUANTITY</th>
                                     <th>UNIT COST</th>
                                     <th>TOTAL</th>
                                   </tr>
                                 </thead>
                                 <tbody>
                                   {m.history.map((h, idx) => (
                                     <tr key={idx}>
                                       <td>{h.date}</td>
                                       <td>{h.type || 'RESTOCK'}</td>
                                       <td style={{color:'#fff'}}>+{h.qty} {m.unit}</td>
                                       <td>${h.unitCost.toFixed(2)}</td>
                                       <td>${(h.qty * h.unitCost).toFixed(2)}</td>
                                     </tr>
                                   ))}
                                 </tbody>
                               </table>
                             ) : (
                               <div style={{color:'var(--text-muted)', fontStyle:'italic', fontSize:'0.75rem', padding:'10px 0'}}>No detailed history records found.</div>
                             )}
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

      {/* SIDEBAR REMAINS UNCHANGED */}
      <div className="sidebar-col" style={{width:'340px'}}>
         <div className="keyword-header">
           <h3 className="label-industrial glow-purple" style={{ margin: 0, fontSize: '0.9rem' }}>
             {showIntakeForm ? (isExistingItem ? 'RESTOCK / UPDATE' : 'NEW ASSET INTAKE') : selectedMaterial ? 'ASSET DETAILS' : 'NOTIFICATIONS'}
           </h3>
        </div>
        <div className="keyword-list">
          {/* ... Sidebar content (Detail view, Intake form, Readiness) is fine as is ... */}
          {!showIntakeForm && selectedMaterial && (
            <div className="sidebar-panel" style={{ borderLeftColor: selectedMaterial.qty === 0 ? 'red' : 'var(--neon-purple)' }}>
              <div className="sidebar-inner">
                <div className="detail-header">
                  <h3 className="detail-title">{selectedMaterial.name}</h3>
                  <div className="detail-brand">Brand: {selectedMaterial.brand || 'N/A'}</div>
                  {selectedMaterial.qty === 0 && <div style={{color:'red', fontWeight:800, marginTop:'10px'}}>⚠️ ITEM OUT OF STOCK</div>}
                </div>
                <div className="stock-grid">
                  <div className="stock-box">
                    <div className="stock-label">STOCK LEVEL</div>
                    <div className={`stock-value ${selectedMaterial.qty === 0 ? 'glow-red' : ''}`}>{selectedMaterial.qty}</div>
                    <div className="stock-label">{selectedMaterial.unit.toUpperCase()}</div>
                  </div>
                  <div className="stock-box">
                    <div className="stock-label">AVG COST</div>
                    <div className="stock-value glow-purple">${selectedMaterial.costPerUnit.toFixed(2)}</div>
                  </div>
                </div>
                <button onClick={handleQuickRestock} className="btn-primary" style={{width:'100%', marginBottom:'20px'}}>
                    {selectedMaterial.qty === 0 ? '⚡ URGENT RESTOCK' : '+ RESTOCK THIS ITEM'}
                </button>
                <button onClick={() => setSelectedMaterial(null)} className="btn-ghost" style={{width:'100%', marginTop:'15px', fontSize:'0.75rem'}}>CLOSE DETAIL</button>
              </div>
            </div>
          )}
          
          {/* INTAKE FORM */}
          {showIntakeForm && (
             <div className="sidebar-panel" style={{ borderLeftColor: 'var(--neon-purple)' }}>
               <div className="sidebar-inner">
                 <form onSubmit={handleSubmitIntake}>
                   <div style={{marginBottom:'15px', display:'flex', alignItems:'center', gap:'10px'}}>
                       <input type="checkbox" checked={isExistingItem} onChange={(e) => { setIsExistingItem(e.target.checked); if(!e.target.checked) resetForm(true); }} style={{accentColor:'var(--neon-purple)'}} />
                       <label className="label-industrial" style={{margin:0, cursor:'pointer'}}>Item already in Locker?</label>
                   </div>
                   {isExistingItem && (
                      <div className="animate-fade-in" style={{marginBottom: '15px'}}>
                        <select className="input-industrial" value={selectedExistingId} onChange={handleExistingSelect} style={{borderColor:'var(--neon-teal)'}}>
                          <option value="">-- Select Item --</option>
                          {[...materials].sort((a,b) => a.name.localeCompare(b.name)).map(m => (<option key={m.id} value={m.id}>{m.name}</option>))}
                        </select>
                      </div>
                   )}
                   {isExistingItem && currentItemSnapshot && (
                     <div className="animate-fade-in" style={{background: '#18181b', padding:'15px', borderRadius:'2px', marginBottom:'15px', border:'1px solid #27272a'}}>
                       <div className="flex-between" style={{marginBottom:'10px'}}>
                        <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>CURRENT STOCK</div>
                        <div style={{fontSize:'0.75rem', color:'var(--neon-teal)', fontWeight:700}}>{currentItemSnapshot.qty} {currentItemSnapshot.unit}</div>
                       </div>
                     </div>
                   )}
                   <div className="animate-fade-in">
                     {!isExistingItem && (
                       <>
                         <div className="lab-form-group"><label className="label-industrial">Material Name</label><input className="input-industrial" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} autoFocus /></div>
                         <div className="lab-form-group"><label className="label-industrial">Category</label><select className="input-industrial" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                       </>
                     )}
                     <div style={{background:'rgba(255,255,255,0.05)', padding:'10px', borderRadius:'2px', marginTop:'15px'}}>
                        <div className="lab-form-row">
                          <div><label className="label-industrial">Add Qty</label><input type="number" step="0.01" className="input-industrial" placeholder="0" value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} /></div>
                          <div><label className="label-industrial">Total Cost ($)</label><input type="number" step="0.01" className="input-industrial" placeholder="0.00" value={formData.totalCost} onChange={e => setFormData({...formData, totalCost: e.target.value})} /></div>
                        </div>
                        {!isExistingItem && (
                             <div style={{marginTop:'10px'}}>
                                 <label className="label-industrial">Unit</label>
                                 <select className="input-industrial" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>{UNITS['Weight'].map(u => <option key={u} value={u}>{u}</option>)}</select>
                             </div>
                        )}
                        {formData.qty && formData.totalCost && <div style={{textAlign:'center', fontSize:'0.7rem', color:'var(--neon-purple)', marginTop:'5px'}}>New Unit Cost: <strong>${(formData.totalCost / formData.qty).toFixed(2)}</strong></div>}
                     </div>
                     <div style={{display:'flex', gap:'10px', marginTop:'20px'}}>
                         <button type="button" className="btn-ghost" onClick={() => resetForm(false)}>CANCEL</button>
                         <button type="submit" className="btn-primary" style={{flex:1}}>{isExistingItem ? 'UPDATE STOCK' : 'SAVE ASSET'}</button>
                     </div>
                   </div>
                 </form>
               </div>
             </div>
          )}
          {/* READINESS */}
          {!showIntakeForm && !selectedMaterial && (
            <div>
               {projectReadiness.length === 0 && <div style={{padding:'20px', color:'var(--text-muted)', textAlign:'center'}}>All Systems Normal.</div>}
               {projectReadiness.map(p => {
                  let statusColor = 'var(--neon-teal)'; let statusLabel = 'READY';
                  if (p.status === 'LOW STOCK') { statusColor = 'var(--neon-orange)'; statusLabel = 'LOW'; }
                  if (p.status === 'HALTED') { statusColor = 'red'; statusLabel = 'HALTED'; }
                  const isExpanded = expandedProject === p.title;

                  return (
                    <div key={p.title} className="readiness-card">
                      <div className="readiness-header" onClick={() => toggleProject(p.title)}>
                         <div style={{flex:1}}>
                           <div className="readiness-title">{p.title}</div>
                           <div style={{fontSize:'0.65rem', color: statusColor}}>{statusLabel}</div>
                         </div>
                         <div>
                           {isExpanded ? <ChevronUp /> : <ChevronDown />} 
                         </div>
                      </div>
                      {isExpanded && (
                        <div className="readiness-grid">
                           {p.materials.map(mat => (
                             <div key={mat.id} className="readiness-item">
                                <span style={{color: mat.health === 'GOOD' ? 'var(--text-muted)' : 'var(--text-main)'}}>{mat.name}</span>
                                <span style={{color: mat.health === 'CRITICAL' ? 'red' : 'var(--text-muted)'}}>{mat.qty} {mat.unit}</span>
                             </div>
                           ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};