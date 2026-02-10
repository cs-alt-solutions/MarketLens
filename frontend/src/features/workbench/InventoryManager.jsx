import React, { useState, useMemo } from 'react';
import { MOCK_PROJECTS } from '../../data/mockData';
import './ConsoleLayout.css';
import './InventoryManager.css';

// --- ICONS ---
const Icons = {
  Zap: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Refresh: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Alert: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Clock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Box: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  Settings: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.82 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  ChevronDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  GraphUp: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Open: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Close: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
};

// --- DATA ---
const CATEGORIES = ['Raw Material', 'Packaging', 'Shipping', 'Consumables', 'Hardware', 'Electronics', 'Tools'];
const UNITS = { 'Weight': ['lbs', 'oz', 'kg'], 'Volume': ['gal', 'fl oz', 'L'], 'Length': ['ft', 'yd'], 'Count': ['count', 'box', 'ea'] };
const USAGE_TYPES = ['Project Component', 'Shipping & Fulfillment', 'General Operations'];

const INITIAL_MATERIALS = [
  { id: 101, name: 'Soy Wax', brand: 'Golden Brands 464', category: 'Raw Material', qty: 45, unit: 'lbs', costPerUnit: 3.50, status: 'Active', lastUsed: '2026-02-09', usageType: 'Project Component', linkedProject: 'Vintage Candle Holder', reqPerUnit: 0.5, history: [{ date: '2026-02-01', qty: 20, unitCost: 3.88 }] },
  { id: 104, name: 'Brass Rods', brand: '1/4 Inch Solid', category: 'Hardware', qty: 0, unit: 'ft', costPerUnit: 6.00, status: 'Active', lastUsed: '2026-02-05', usageType: 'Project Component', linkedProject: 'Candle Holders', reqPerUnit: 2, history: [] },
  { id: 102, name: 'Glass Jars', brand: '8oz Amber', category: 'Packaging', qty: 120, unit: 'count', costPerUnit: 1.10, status: 'Active', lastUsed: '2025-11-15', usageType: 'Project Component', linkedProject: 'Vintage Candle Holder', reqPerUnit: 1, history: [] },
  { id: 103, name: 'Walnut Stain', brand: 'Minwax Dark', category: 'Consumables', qty: 0.5, unit: 'gal', costPerUnit: 24.00, status: 'Dormant', lastUsed: '2025-09-01', usageType: 'Project Component', linkedProject: 'Wood Sign', reqPerUnit: 0.05, history: [] },
];

export const InventoryManager = () => {
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [filter, setFilter] = useState('ALL');
  
  // UI State
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null); 
  const [isExistingItem, setIsExistingItem] = useState(false);
  const [selectedExistingId, setSelectedExistingId] = useState('');
  
  // Logic State
  const [reactivatingItem, setReactivatingItem] = useState(null);
  const [newProjectLink, setNewProjectLink] = useState('');
  const [expandedProject, setExpandedProject] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', brand: '', category: 'Raw Material', unitType: 'Weight', unit: 'lbs', qty: '', totalCost: '', 
    status: 'Active', usageType: 'Project Component', linkedProjectId: '' 
  });

  // --- LOGIC ---
  const metrics = useMemo(() => {
    let totalValue = 0, dormantValue = 0, lowStockCount = 0, outOfStockCount = 0;
    materials.forEach(m => {
      const val = m.qty * m.costPerUnit;
      if (m.status !== 'Discontinued') totalValue += val;
      if (m.status === 'Dormant') dormantValue += val;
      if (m.status === 'Active') {
        if (m.qty === 0) outOfStockCount++;
        else if (m.qty < 10) lowStockCount++;
      }
    });
    return { totalValue, dormantValue, lowStockCount, outOfStockCount };
  }, [materials]);

  const projectReadiness = useMemo(() => {
    const projectMap = {};
    MOCK_PROJECTS.forEach(p => { 
      projectMap[p.title] = { id: p.id, title: p.title, materials: [], status: 'READY', limitingFactor: Infinity }; 
    });
    
    materials.forEach(m => {
      if (m.usageType === 'Project Component' && m.linkedProject && m.status !== 'Discontinued') {
        if (!projectMap[m.linkedProject]) projectMap[m.linkedProject] = { id: 999, title: m.linkedProject, materials: [], status: 'READY', limitingFactor: Infinity };
        
        const isLow = m.qty < 10 && m.qty > 0;
        const isOut = m.qty === 0;
        
        // CALCULATE YIELD
        let yieldCount = 'N/A';
        if (m.reqPerUnit > 0) {
           const calc = Math.floor(m.qty / m.reqPerUnit);
           yieldCount = calc;
           // Track the bottleneck
           if (calc < projectMap[m.linkedProject].limitingFactor) {
             projectMap[m.linkedProject].limitingFactor = calc;
           }
        }

        projectMap[m.linkedProject].materials.push({ 
          ...m, 
          health: isOut ? 'CRITICAL' : isLow ? 'LOW' : 'GOOD',
          yieldCount: yieldCount
        });

        if (isOut) projectMap[m.linkedProject].status = 'HALTED';
        else if (isLow && projectMap[m.linkedProject].status !== 'HALTED') projectMap[m.linkedProject].status = 'LOW STOCK';
      }
    });
    return Object.values(projectMap).filter(p => p.materials.length > 0);
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    if (filter === 'ALL') return materials;
    if (filter === 'OUT_OF_STOCK') return materials.filter(m => m.qty === 0 && m.status === 'Active');
    return materials.filter(m => m.status.toUpperCase() === filter);
  }, [materials, filter]);

  // --- HANDLERS ---
  const resetForm = (keepOpen = false) => {
    if (!keepOpen) setShowIntakeForm(false);
    setIsExistingItem(false);
    setSelectedExistingId('');
    setFormData({ name: '', brand: '', category: 'Raw Material', unitType: 'Weight', unit: 'lbs', qty: '', totalCost: '', status: 'Active', usageType: 'Project Component', linkedProjectId: '' });
  };

  // THIS FUNCTION IS NOW USED IN THE TABLE ROW CLICK
  const handleSelectMaterial = (m) => {
    setSelectedMaterial(m);
    setShowIntakeForm(false);
    setIsExistingItem(true);
    setSelectedExistingId(m.id);
  };

  const handleQuickRestock = () => {
    if (!selectedMaterial) return;
    setFormData(prev => ({ ...prev, name: selectedMaterial.name, brand: selectedMaterial.brand || '', category: selectedMaterial.category, unitType: Object.keys(UNITS).find(k => UNITS[k].includes(selectedMaterial.unit)) || 'Weight', unit: selectedMaterial.unit, usageType: selectedMaterial.usageType, linkedProjectId: MOCK_PROJECTS.find(p => p.title === selectedMaterial.linkedProject)?.id || '' }));
    setIsExistingItem(true); setSelectedExistingId(selectedMaterial.id); setShowIntakeForm(true); setSelectedMaterial(null);
  };

  const handleExistingSelect = (e) => {
    const id = parseInt(e.target.value); setSelectedExistingId(id);
    if (!id) { resetForm(true); return; }
    const existing = materials.find(m => m.id === id);
    if (existing) {
      setFormData(prev => ({ ...prev, name: existing.name, brand: existing.brand || '', category: existing.category, unitType: Object.keys(UNITS).find(k => UNITS[k].includes(existing.unit)) || 'Weight', unit: existing.unit, usageType: existing.usageType, linkedProjectId: MOCK_PROJECTS.find(p => p.title === existing.linkedProject)?.id || '' }));
    }
  };

  const adjustQty = (amount) => {
    const current = parseFloat(formData.qty) || 0;
    const newVal = Math.max(0, current + amount);
    setFormData(prev => ({...prev, qty: newVal}));
  };

  const handleSubmitIntake = (e) => {
    e.preventDefault();
    if (!formData.qty || !formData.totalCost) return;
    const newQty = parseFloat(formData.qty);
    const totalCost = parseFloat(formData.totalCost);
    const newUnitCost = totalCost / newQty;
    const today = new Date().toISOString().split('T')[0];

    if (isExistingItem && selectedExistingId) {
      setMaterials(prev => prev.map(m => {
        if (m.id === selectedExistingId) {
          const oldTotalValue = m.qty * m.costPerUnit;
          const newTotalValue = oldTotalValue + totalCost;
          const newTotalQty = m.qty + newQty;
          const weightedAvgCost = newTotalValue / newTotalQty;
          const newHistory = [...(m.history || []), { date: today, qty: newQty, unitCost: newUnitCost }];
          return { ...m, qty: newTotalQty, costPerUnit: weightedAvgCost, lastUsed: today, status: 'Active', history: newHistory };
        }
        return m;
      }));
    } else {
      const proj = MOCK_PROJECTS.find(p => p.id === parseInt(formData.linkedProjectId));
      const newItem = {
        id: Date.now(), name: formData.name, brand: formData.brand, category: formData.category, qty: newQty, unit: formData.unit, costPerUnit: newUnitCost, status: 'Active', usageType: formData.usageType, linkedProject: proj ? proj.title : 'N/A', lastUsed: today, history: [{ date: today, qty: newQty, unitCost: newUnitCost }]
      };
      setMaterials([newItem, ...materials]);
    }
    resetForm();
  };

  const handleTouchItem = (item) => { 
    if (item.status === 'Active') {
      setMaterials(prev => prev.map(m => m.id === item.id ? { ...m, lastUsed: new Date().toISOString().split('T')[0], isStagnant: false } : m));
    } else {
      setReactivatingItem(item); 
      setNewProjectLink('');
      setShowIntakeForm(false); setSelectedMaterial(null);
    }
  };

  const confirmReactivation = (useNewProject) => { 
    if (!reactivatingItem) return; 
    let finalProject = reactivatingItem.linkedProject; 
    if (useNewProject) { const proj = MOCK_PROJECTS.find(p => p.id === parseInt(newProjectLink)); if (proj) finalProject = proj.title; } 
    setMaterials(prev => prev.map(m => m.id === reactivatingItem.id ? { ...m, status: 'Active', lastUsed: new Date().toISOString().split('T')[0], linkedProject: finalProject } : m)); 
    setReactivatingItem(null); 
  };

  const handleBulkArchive = () => { 
    setMaterials(prev => prev.map(m => (m.isStagnant && m.status === 'Active') ? { ...m, status: 'Dormant' } : m)); 
    setFilter('DORMANT'); 
  };

  const toggleProject = (title) => setExpandedProject(expandedProject === title ? null : title);
  
  const currentItemSnapshot = useMemo(() => {
      if (!isExistingItem || !selectedExistingId) return null;
      return materials.find(m => m.id === selectedExistingId);
  }, [isExistingItem, selectedExistingId, materials]);

  return (
    <div className="inventory-layout">
      <div className="inventory-scroll-area">
        {/* HEADER */}
        <div className="inventory-header">
          <h2 className="header-title">SUPPLY LOCKER</h2>
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
        </div>

        {/* METRICS */}
        <div className="inventory-metrics">
           <div className="metric-card">
            <span className="section-label">ASSET VALUE</span>
            <div className="metric-value glow-purple">${metrics.totalValue.toLocaleString(undefined, {minimumFractionDigits: 0})}</div>
           </div>
           
           <div className={`metric-card ${metrics.outOfStockCount > 0 ? 'alert' : ''}`} onClick={() => metrics.outOfStockCount > 0 && setFilter('OUT_OF_STOCK')}>
             <span className="section-label" style={{color: metrics.outOfStockCount > 0 ? '#fff' : 'var(--text-muted)'}}>OUT OF STOCK</span>
             <div className={`metric-value ${metrics.outOfStockCount > 0 ? 'glow-red' : 'text-muted'}`}>{metrics.outOfStockCount}</div>
           </div>
           
           <div className="metric-card">
            <span className="section-label">LOW STOCK</span>
            <div className={`metric-value ${metrics.lowStockCount > 0 ? 'glow-orange' : 'text-muted'}`}>{metrics.lowStockCount}</div>
           </div>
        </div>

        {/* TABLE SECTION */}
        <div className="blueprint-section panel-base">
          {/* FLOATING LABEL */}
          <div className="floating-manifest-label">MATERIAL MANIFEST</div>
          
          <table className="inventory-table">
            <thead>
               <tr className="table-header-row">
                 <th>NAME / PROJECT</th>
                 <th>STATUS</th>
                 <th>LAST USED</th>
                 <th className="td-right">AVG COST</th>
                 <th className="td-center">QTY</th>
                 <th>
                   <button 
                     className="btn-new-asset-sm" 
                     onClick={() => { setShowIntakeForm(true); setSelectedMaterial(null); setIsExistingItem(false); resetForm(true); }}
                   >
                     <Icons.Plus /> LOG ITEM
                   </button>
                 </th>
               </tr>
            </thead>
            <tbody>
              {filteredMaterials.map(m => {
                const isOutOfStock = m.qty === 0;
                const isLowStock = m.qty < 10 && m.qty > 0;
                
                let statusClass = 'glow-teal'; let StatusIcon = Icons.Box; let statusText = 'STOCKED';
                if (m.isStagnant) { statusClass = 'glow-orange'; StatusIcon = Icons.Clock; statusText = 'DORMANT'; } 
                else if (isOutOfStock) { statusClass = 'glow-red'; StatusIcon = Icons.Alert; statusText = 'OUT OF STOCK'; }
                else if (isLowStock) { statusClass = 'glow-orange'; StatusIcon = Icons.Alert; statusText = 'LOW STOCK'; } 
                else if (m.status === 'Dormant') { statusClass = 'text-muted'; StatusIcon = Icons.Box; statusText = 'DORMANT'; }
                
                let rowClass = `inventory-row ${selectedMaterial?.id === m.id ? 'selected' : ''} ${isOutOfStock ? 'out-of-stock' : ''} ${m.status === 'Dormant' ? 'dormant' : ''}`;

                // USED handleSelectMaterial HERE
                return (
                  <tr key={m.id} className={rowClass} onClick={() => handleSelectMaterial(m)}>
                    <td className="td-cell">
                      <div className={`cell-name ${isOutOfStock ? 'glow-red' : ''}`}>
                        {m.name}
                      </div>
                      <div className="context-tag">
                        <span className="context-dot" style={{background: m.usageType === 'Project Component' ? 'var(--neon-cyan)' : 'var(--neon-orange)'}}></span>
                        {m.brand ? `${m.brand} • ` : ''} {m.linkedProject}
                      </div>
                    </td>
                    <td className="td-cell">
                      <div className={`status-cell ${statusClass}`}><StatusIcon /> {statusText}</div>
                    </td>
                    <td className="td-cell cell-meta">{m.lastUsed}</td>
                    <td className="td-cell td-right cell-meta">${m.costPerUnit.toFixed(2)}</td>
                    <td className="td-cell td-center">
                      <span style={{fontWeight: 700}} className={isOutOfStock ? 'glow-red' : 'text-main'}>{m.qty}</span> 
                      <span style={{fontSize:'0.7rem', color:'var(--text-muted)', marginLeft:'2px'}}>{m.unit}</span>
                    </td>
                    <td className="td-cell">
                       <div className="cell-actions" onClick={(e) => e.stopPropagation()}>
                         {isOutOfStock ? (
                           <button onClick={(e) => { e.stopPropagation(); setSelectedMaterial(m); handleQuickRestock(); }} className="btn-restock">RESTOCK</button>
                         ) : (
                           <>
                             {m.status === 'Active' && <button onClick={() => handleTouchItem(m)} title="Mark Used Today" className="btn-icon"><Icons.Zap /></button>}
                             {m.status === 'Dormant' && <button onClick={() => handleTouchItem(m)} title="Reactivate" className="btn-icon"><Icons.Refresh /></button>}
                             <button onClick={(e) => { e.stopPropagation(); setSelectedMaterial(m); }} className="btn-icon"><Icons.Settings /></button>
                           </>
                         )}
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SIDEBAR (Now using "keyword-sidebar panel-base" via css) */}
      <div className="keyword-sidebar panel-base">
         <div className="keyword-header">
           <h3 className="section-label glow-purple" style={{ margin: 0, fontSize: '0.9rem' }}>
             {showIntakeForm ? (isExistingItem ? 'RESTOCK / UPDATE' : 'NEW ASSET INTAKE') : selectedMaterial ? 'ASSET DETAILS' : reactivatingItem ? 'PROTOCOL' : 'PROJECT READINESS'}
           </h3>
        </div>
        <div className="keyword-list">
          
          {/* A. MATERIAL DETAIL */}
          {!showIntakeForm && !reactivatingItem && selectedMaterial && (
            <div className="sidebar-panel" style={{ borderLeftColor: selectedMaterial.qty === 0 ? 'red' : 'var(--neon-purple)' }}>
              <div className="sidebar-inner">
                <div className="detail-header">
                  <h3 className="detail-title">{selectedMaterial.name}</h3>
                  <div className="detail-brand">Brand: {selectedMaterial.brand || 'N/A'}</div>
                  {selectedMaterial.qty === 0 && <div className="alert-card">⚠️ ITEM OUT OF STOCK</div>}
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

                {/* RECIPE CARD IN DETAIL VIEW */}
                <div className="advisor-card" style={{marginBottom:'20px', padding:'10px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                   <div style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>USAGE PER UNIT:</div>
                   <div style={{fontWeight:700, color:'var(--text-main)'}}>{selectedMaterial.reqPerUnit} {selectedMaterial.unit}</div>
                </div>

                <button onClick={handleQuickRestock} className="btn-primary" style={{width:'100%', marginBottom:'20px', background: selectedMaterial.qty === 0 ? 'transparent' : 'var(--neon-teal)', color: selectedMaterial.qty === 0 ? '#fff' : 'black', border: selectedMaterial.qty === 0 ? '1px solid red' : 'none', textShadow: selectedMaterial.qty === 0 ? '0 0 5px red' : 'none'}}>{selectedMaterial.qty === 0 ? '⚡ URGENT RESTOCK' : '+ RESTOCK THIS ITEM'}</button>
                
                <div className="history-section">
                  <div className="history-title"><Icons.GraphUp /> PURCHASE HISTORY</div>
                  <div className="history-list">
                    {selectedMaterial.history && selectedMaterial.history.length > 0 ? (
                      [...selectedMaterial.history].reverse().map((entry, idx) => (
                        <div key={idx} className="history-item">
                          <span className="text-muted">{entry.date}</span>
                          <span>+{entry.qty} {selectedMaterial.unit}</span>
                          <span style={{fontWeight:700}}>${entry.unitCost.toFixed(2)}</span>
                        </div>
                      ))
                    ) : <div style={{color:'var(--text-muted)', fontStyle:'italic', fontSize:'0.7rem'}}>No history recorded.</div>}
                  </div>
                </div>
                <button onClick={() => setSelectedMaterial(null)} className="btn-icon" style={{width:'100%', marginTop:'15px', fontSize:'0.75rem', border:'1px solid #27272a'}}>CLOSE DETAIL</button>
              </div>
            </div>
          )}

          {/* B. INTAKE FORM */}
          {showIntakeForm && !reactivatingItem && (
             <div className="sidebar-panel" style={{ borderLeftColor: 'var(--neon-purple)' }}>
               <div className="sidebar-inner">
                 <form onSubmit={handleSubmitIntake}>
                   <div className="checkbox-row">
                       <input type="checkbox" checked={isExistingItem} onChange={(e) => { setIsExistingItem(e.target.checked); if(!e.target.checked) resetForm(true); }} style={{width:'16px', height:'16px', accentColor:'var(--neon-purple)'}} />
                       <label className="section-label" style={{margin:0, color: isExistingItem ? 'var(--neon-teal)' : 'var(--text-muted)', cursor:'pointer'}}>Item already in Locker?</label>
                   </div>
                   
                   {/* SELECT EXISTING ITEM DROPDOWN */}
                   {isExistingItem && (
                      <div className="animate-fade-in" style={{marginBottom: '15px'}}>
                        <select className="input-industrial select-arrow" value={selectedExistingId} onChange={handleExistingSelect} style={{borderColor:'var(--neon-teal)'}}>
                          <option value="">-- Select Item --</option>
                          {[...materials].sort((a,b) => a.name.localeCompare(b.name)).map(m => (<option key={m.id} value={m.id}>{m.name} ({m.brand || 'No Brand'})</option>))}
                        </select>
                      </div>
                   )}
                   
                   {/* == RESTOCK CONSOLE (Only for Existing Items) == */}
                   {isExistingItem && currentItemSnapshot && (
                     <div className="animate-fade-in" style={{background: '#18181b', padding:'15px', borderRadius:'2px', marginBottom:'15px', border:'1px solid #27272a'}}>
                       <div className="flex-between" style={{marginBottom:'10px'}}>
                        <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>CURRENT STOCK</div>
                        <div style={{fontSize:'0.75rem', color:'var(--neon-teal)', fontWeight:700}}>{currentItemSnapshot.category}</div>
                       </div>
                       
                       <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:'10px'}}>
                          {/* Left: Current Stock */}
                          <div>
                            <div style={{fontSize:'1.6rem', fontWeight:800, lineHeight:1, color:'var(--text-main)'}}>{currentItemSnapshot.qty}</div>
                            <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>{currentItemSnapshot.unit}</div>
                          </div>

                          {/* Center: Plus Sign */}
                          <div style={{color:'var(--text-muted)', fontSize:'1.2rem', fontWeight:300}}>+</div>

                          {/* Right: Stepper */}
                          <div className="stepper-container">
                             <button type="button" onClick={() => adjustQty(-1)} className="btn-stepper">-</button>
                             <input 
                                className="input-stepper" 
                                type="number" 
                                value={formData.qty} 
                                onChange={e => setFormData({...formData, qty: e.target.value})} 
                                placeholder="0"
                             />
                             <button type="button" onClick={() => adjustQty(1)} className="btn-stepper">+</button>
                          </div>
                       </div>
                       
                       <div style={{textAlign:'right', fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'6px'}}>
                          Adding {formData.qty || 0} {currentItemSnapshot.unit}
                       </div>
                     </div>
                   )}

                   {/* == NEW ASSET FORM (Only if NOT existing) == */}
                   <div className="animate-fade-in">
                     {!isExistingItem && (
                       <>
                         <div className="form-group"><label className="section-label">Material Name</label><input className="input-industrial" placeholder="e.g. Soy Wax" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} autoFocus /></div>
                         <div className="form-group"><label className="section-label">Brand / Variant</label><input className="input-industrial" placeholder="e.g. Golden Brands 464" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} /></div>
                         <div className="form-group"><label className="section-label">Category</label><select className="input-industrial select-arrow" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                         <div className="cost-calc-box"><label className="section-label" style={{color:'var(--neon-cyan)'}}>Context</label><select className="input-industrial select-arrow" style={{marginBottom:'5px'}} value={formData.usageType} onChange={e => setFormData({...formData, usageType: e.target.value})}>{USAGE_TYPES.map(u => <option key={u} value={u}>{u}</option>)}</select>{formData.usageType === 'Project Component' && (<div className="animate-fade-in"><select className="input-industrial select-arrow" value={formData.linkedProjectId} onChange={e => setFormData({...formData, linkedProjectId: e.target.value})} style={{borderColor:'var(--neon-cyan)', marginTop:'5px'}}><option value="">-- Link to Workbench --</option>{MOCK_PROJECTS.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select></div>)}</div>
                       </>
                     )}
                     
                     <div className="cost-calc-box">
                        <div className="form-row">
                          {/* Hide Qty Input for Existing items since we use the Stepper now */}
                          {!isExistingItem && (
                             <div><label className="section-label">Total Qty</label><input type="number" step="0.01" className="input-industrial" placeholder="0" value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} /></div>
                          )}
                          
                          <div style={{flex:1}}>
                             <label className="section-label">Total Price ($)</label>
                             <input type="number" step="0.01" className="input-industrial" placeholder="0.00" value={formData.totalCost} onChange={e => setFormData({...formData, totalCost: e.target.value})} />
                          </div>
                        </div>
                        
                        {!isExistingItem && (<div className="form-row"><select className="input-industrial select-arrow" value={formData.unitType} onChange={e => setFormData({...formData, unitType: e.target.value, unit: UNITS[e.target.value][0]})}>{Object.keys(UNITS).map(t => <option key={t} value={t}>{t}</option>)}</select><select className="input-industrial select-arrow" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>{UNITS[formData.unitType].map(u => <option key={u} value={u}>{u}</option>)}</select></div>)}
                        
                        {formData.qty && formData.totalCost && <div style={{textAlign:'center', fontSize:'0.7rem', color:'var(--neon-purple)', marginTop:'5px'}}>New Unit Cost: <strong>${(formData.totalCost / formData.qty).toFixed(2)} / {formData.unit}</strong></div>}
                     </div>
                     
                     <div className="form-actions"><button type="button" className="btn-ghost" onClick={() => resetForm(false)}>CANCEL</button><button type="submit" className="btn-primary" style={{flex:1, background: isExistingItem ? 'var(--neon-teal)' : 'var(--neon-purple)', color: isExistingItem ? 'black' : 'white'}}>{isExistingItem ? 'UPDATE STOCK' : 'SAVE ASSET'}</button></div>
                   </div>
                 </form>
               </div>
             </div>
          )}

          {/* C. REACTIVATION */}
          {reactivatingItem && (
             <div className="sidebar-panel" style={{ borderLeftColor: 'var(--neon-purple)' }}>
               <div className="sidebar-inner">
                 <div style={{marginBottom:'15px', paddingBottom:'15px', borderBottom:'1px solid var(--border-subtle)'}}>
                   <h3 style={{margin:'0 0 5px 0', fontSize:'1rem'}}>Waking up "{reactivatingItem.name}"</h3>
                 </div>
                 <button onClick={() => confirmReactivation(false)} className="btn-ghost" style={{width:'100%', marginBottom:'10px', textAlign:'left', padding:'10px', borderColor:'var(--neon-teal)', color:'var(--neon-teal)'}}><div style={{fontWeight:700, fontSize:'0.75rem'}}>RESUME PROJECT</div></button>
                 <div style={{marginTop:'15px', borderTop:'1px dashed var(--border-subtle)', paddingTop:'15px'}}>
                   <div style={{fontSize:'0.7rem', fontWeight:700, marginBottom:'5px', color:'var(--text-muted)'}}>OR REASSIGN TO NEW PROJECT:</div>
                   <select className="input-industrial select-arrow" value={newProjectLink} onChange={(e) => setNewProjectLink(e.target.value)} style={{marginBottom:'10px'}}><option value="">-- Select New Project --</option>{MOCK_PROJECTS.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select>
                   <button onClick={() => confirmReactivation(true)} disabled={!newProjectLink} className="btn-primary" style={{width:'100%', background: newProjectLink ? 'var(--neon-purple)' : 'var(--text-muted)', color:'white'}}>CONFIRM</button>
                 </div>
                 <button onClick={() => setReactivatingItem(null)} className="btn-ghost" style={{width:'100%', marginTop:'15px', border:'none', fontSize:'0.7rem'}}>CANCEL</button>
               </div>
             </div>
          )}

          {/* D. DEFAULT LIST (Readiness Cards) */}
          {!showIntakeForm && !selectedMaterial && !reactivatingItem && (
             <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                {/* ALERTS */}
                {metrics.outOfStockCount > 0 && (
                   <div className="advisor-card alert-card" style={{display:'flex', alignItems:'center', gap:'10px', justifyContent:'center'}}>
                     <Icons.Alert /> <span><strong>{metrics.outOfStockCount}</strong> ITEMS OUT OF STOCK</span>
                   </div>
                )}
                {metrics.stagnantCount > 0 && (
                   <div className="advisor-card animate-fade-in" style={{background: 'rgba(251, 146, 60, 0.05)', border: '1px solid var(--neon-orange)', borderRadius: '2px', padding: '15px'}}>
                     <div style={{display:'flex', gap:'10px', alignItems:'center', marginBottom:'10px'}}>
                       <Icons.Clock />
                       <div><h4 style={{margin:0, color:'var(--neon-orange)', fontSize:'0.9rem'}}>Spring Cleaning?</h4></div>
                     </div>
                     <p style={{fontSize:'0.7rem', color:'var(--text-muted)', margin:0}}>You have <strong>{metrics.stagnantCount} items</strong> untouched for 30+ days.</p>
                     <button onClick={handleBulkArchive} className="btn-primary" style={{width:'100%', background:'var(--neon-orange)', border:'none', color:'black', fontSize:'0.7rem', marginTop:'10px'}}>AUTO-ARCHIVE ALL</button>
                   </div>
                )}

                {/* READINESS LIST (NEW LAYOUT) */}
                {projectReadiness.map(p => {
                  let statusColor = 'var(--neon-teal)'; let statusLabel = 'READY';
                  if (p.status === 'LOW STOCK') { statusColor = 'var(--neon-orange)'; statusLabel = 'LOW'; }
                  if (p.status === 'HALTED') { statusColor = 'red'; statusLabel = 'HALTED'; }
                  const isExpanded = expandedProject === p.title;
                  const canBuild = p.limitingFactor === Infinity ? 'N/A' : p.limitingFactor;

                  return (
                    <div key={p.title} className="readiness-card">
                      <div className="readiness-header" onClick={() => toggleProject(p.title)}>
                         <div className="readiness-title-block">
                           <div className="readiness-title">{p.title}</div>
                           <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                             <div className="readiness-status" style={{color: statusColor, textShadow: statusColor === 'red' ? '0 0 5px red' : 'none'}}>{statusLabel}</div>
                             {p.status !== 'HALTED' && <div style={{fontSize:'0.65rem', color:'var(--text-muted)'}}>EST. BUILD: {canBuild}</div>}
                           </div>
                         </div>
                         <div className="readiness-chevron">
                           {isExpanded ? <Icons.Close /> : <Icons.Open />}
                         </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="readiness-grid">
                           {p.materials.map(mat => (
                             <div key={mat.id} className="readiness-item">
                                <div style={{display:'flex', flexDirection:'column'}}>
                                   <span style={{color: mat.health === 'GOOD' ? 'var(--text-muted)' : 'var(--text-main)', fontWeight:700}}>{mat.name}</span>
                                   <span style={{fontSize:'0.65rem', color:'var(--text-muted)'}}>Req: {mat.reqPerUnit} {mat.unit}</span>
                                </div>
                                <div style={{textAlign:'right'}}>
                                   <div style={{fontWeight:700, color: mat.health === 'CRITICAL' ? 'white' : mat.health === 'LOW' ? 'var(--neon-orange)' : 'var(--neon-teal)', textShadow: mat.health === 'CRITICAL' ? '0 0 5px red' : 'none'}}>{mat.qty} {mat.unit}</div>
                                   <div style={{fontSize:'0.65rem', color: mat.health === 'CRITICAL' ? 'red' : 'var(--text-muted)'}}>Yield: {mat.yieldCount}</div>
                                </div>
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