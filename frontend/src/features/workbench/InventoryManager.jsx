import React, { useState, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import './InventoryManager.css';
import { Box, History, Plus, Back, Radar, WorkshopIcon, Finance } from '../../components/Icons'; // Import existing icons to reuse
import { StatCard } from '../../components/StatCard';
import { ImagePlaceholder } from '../../components/ImagePlaceholder';
import { formatCurrency } from '../../utils/formatters';
import { TERMINOLOGY } from '../../utils/glossary';

// --- HELPER: CATEGORY ICONS ---
// We reuse existing icons to create a "tech" feel without needing new assets immediately
const getCategoryIcon = (category) => {
  switch (category) {
    case 'Packaging': return <Box />;
    case 'Raw Material': return <Radar />; // Sci-fi feel for raw mats
    case 'Hardware': return <WorkshopIcon />;
    case 'Consumables': return <Finance />; // Abstract choice
    default: return <Box />;
  }
};

// --- SUB-COMPONENT: HUD STRIP (The New Look) ---
const AssetCard = ({ item, onClick, isSelected }) => {
  const isLow = item.qty < 10 && item.qty > 0;
  const isOut = item.qty === 0;
  
  // Status Colors
  let statusColor = 'var(--neon-teal)';
  let statusGlow = 'rgba(45, 212, 191, 0.1)';
  let statusText = 'STOCKED';
  
  if (isOut) {
     statusColor = 'var(--neon-red)';
     statusGlow = 'rgba(239, 68, 68, 0.1)';
     statusText = 'EMPTY';
  } else if (isLow) {
     statusColor = 'var(--neon-orange)';
     statusGlow = 'rgba(251, 146, 60, 0.1)';
     statusText = 'LOW';
  }

  const barWidth = Math.min((item.qty / 100) * 100, 100);

  return (
    <div 
      className={`hud-strip ${isSelected ? 'selected' : ''}`} 
      onClick={() => onClick(item)}
      style={{ '--status-color': statusColor, '--status-glow': statusGlow }}
    >
       {/* 1. Status Bar (Left Edge) */}
       <div className="hud-status-bar"></div>

       {/* 2. Visual Identity (Icon or Photo) */}
       <div className="hud-icon-area">
          {/* We simulate checking for a photo. If none, show the Category Icon */}
          <div className="category-icon-wrapper">
             {getCategoryIcon(item.category)}
          </div>
       </div>

       {/* 3. Data Core (Middle) */}
       <div className="hud-info">
          <div className="flex-between mb-5">
             <span className="hud-brand">{item.brand || 'GENERIC'}</span>
             <span className="hud-status-text" style={{ color: statusColor }}>{statusText}</span>
          </div>
          <div className="hud-title">{item.name}</div>
          <div className="hud-cost">{formatCurrency(item.costPerUnit)} <span className="text-muted">/ unit</span></div>
       </div>

       {/* 4. Stock Gauge (Right) */}
       <div className="hud-stats">
          <div className="hud-qty">
             {item.qty} <span className="hud-unit">{item.unit}</span>
          </div>
          <div className="hud-progress-track">
             <div className="hud-progress-fill" style={{ width: `${barWidth}%`, backgroundColor: statusColor }} />
          </div>
       </div>
    </div>
  );
};

// --- SUB-COMPONENT: VAULT FOLDER ---
const VaultFolder = ({ title, count, items, onItemClick, stampText }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (items.length === 0) return null;

  return (
    <div className={`vault-folder-root ${isOpen ? 'is-open' : ''}`}>
      <div className="vault-main-folder" onClick={() => setIsOpen(!isOpen)}>
        <div className="folder-tab-top">
          <span className="folder-id-tag">{TERMINOLOGY.GENERAL.CATEGORY}</span>
        </div>
        <div className="folder-cover-body">
          <div className="folder-stamp-large">{stampText}</div>
          <div className="folder-info">
            <h3 className="folder-title">{title}</h3>
            <span className="folder-count">{count} {TERMINOLOGY.GENERAL.UNITS}</span>
          </div>
          <div className={`folder-chevron ${isOpen ? 'up' : ''}`}>▼</div>
        </div>
      </div>
      {isOpen && (
        <div className="vault-folder-grid animate-fade-in">
          {items.map(m => (
            <div key={m.id} className="mini-vault-card" onClick={() => onItemClick(m)}>
               <div className="mini-card-meta">
                  <div className="mini-card-title">{m.name}</div>
                  <div className="mini-card-id">{m.qty} {m.unit}</div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CATEGORIES = ['Raw Material', 'Packaging', 'Shipping', 'Consumables', 'Hardware', 'Electronics', 'Tools'];

export const InventoryManager = () => {
  const { materials, addAsset, restockAsset } = useInventory(); 
  const [filter, setFilter] = useState('ALL');
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

  const vaultGroups = useMemo(() => {
    const groups = {};
    CATEGORIES.forEach(cat => groups[cat] = []);
    materials.forEach(m => {
        if (groups[m.category]) groups[m.category].push(m);
        else {
            if (!groups[m.category]) groups[m.category] = [];
            groups[m.category].push(m);
        }
    });
    return groups;
  }, [materials]);

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
    setShowIntakeForm(false);
    setIsExistingItem(false);
    setSelectedExistingId('');
    setFormData({ name: '', brand: '', category: 'Raw Material', unit: 'lbs', qty: '', totalCost: '', status: 'Active' });
  };

  const closeSidebarPanel = () => {
    setShowIntakeForm(false);
    setSelectedMaterial(null);
  };

  return (
    <div className="inventory-layout">
      {/* --- MAIN LOCKER GRID --- */}
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
           <StatCard label="ASSET VALUE" value={formatCurrency(metrics.totalValue)} glowColor="purple" />
           <StatCard label="OUT OF STOCK" value={metrics.outOfStockCount} glowColor={metrics.outOfStockCount > 0 ? 'red' : 'teal'} isAlert={metrics.outOfStockCount > 0} />
           <StatCard label="LOW STOCK" value={metrics.lowStockCount} glowColor={metrics.lowStockCount > 0 ? 'orange' : 'teal'} />
        </div>

        {/* --- HUD STRIP GRID --- */}
        <div className="blueprint-section">
          <div className="floating-manifest-label">{TERMINOLOGY.INVENTORY.MANIFEST_LABEL}</div>
          <div className="locker-grid animate-fade-in">
             {filteredMaterials.map(m => (
                <AssetCard 
                   key={m.id} 
                   item={m} 
                   onClick={setSelectedMaterial}
                   isSelected={selectedMaterial?.id === m.id}
                />
             ))}
          </div>
        </div>
      </div>

      {/* --- SIDEBAR INSPECTOR --- */}
      <div className="sidebar-col">
         <div className="keyword-header flex-between-center">
           <h3 className="label-industrial glow-purple">
             {showIntakeForm ? TERMINOLOGY.INVENTORY.INTAKE : 
              selectedMaterial ? TERMINOLOGY.INVENTORY.ASSET_DETAILS : 
              "SUPPLY VAULT"}
           </h3>
           {(showIntakeForm || selectedMaterial) && (
               <button onClick={closeSidebarPanel} className="btn-icon" title={TERMINOLOGY.GENERAL.CLOSE}>
                   <Back />
               </button>
           )}
        </div>

        <div className="keyword-list">
          {showIntakeForm ? (
            /* --- INTAKE FORM --- */
            <div className="sidebar-panel animate-fade-in">
              <div className="sidebar-inner">
                <form onSubmit={handleSubmitIntake}>
                  <div className="flex-center mb-20 gap-10">
                    <input type="checkbox" checked={isExistingItem} onChange={(e) => setIsExistingItem(e.target.checked)} />
                    <label className="label-industrial no-margin">{TERMINOLOGY.INVENTORY.RESTOCK}</label>
                  </div>
                  {isExistingItem ? (
                    <div className="lab-form-group">
                      <label className="label-industrial">SELECT ASSET</label>
                      <select className="input-industrial" value={selectedExistingId} onChange={handleExistingSelect}>
                        <option value="">-- Select Material --</option>
                        {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                    </div>
                  ) : (
                    <>
                      <div className="lab-form-group">
                        <label className="label-industrial">MATERIAL NAME</label>
                        <input className="input-industrial" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="lab-form-group">
                        <label className="label-industrial">CATEGORY</label>
                        <select className="input-industrial" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </>
                  )}
                  <div className="lab-form-row">
                    <div className="lab-form-group">
                      <label className="label-industrial">ADD QTY</label>
                      <input type="number" step="0.01" className="input-industrial" value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} />
                    </div>
                    <div className="lab-form-group">
                      <label className="label-industrial">TOTAL COST</label>
                      <input type="number" step="0.01" className="input-industrial" value={formData.totalCost} onChange={e => setFormData({...formData, totalCost: e.target.value})} />
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
            /* --- ASSET DETAIL & HISTORY --- */
            <div className="sidebar-panel animate-fade-in">
              <ImagePlaceholder height="180px" label="ITEM PHOTO" />
              <div className="sidebar-inner">
                <h3 className="detail-title">{selectedMaterial.name}</h3>
                <div className="detail-brand">{TERMINOLOGY.GENERAL.BRAND}: {selectedMaterial.brand || 'N/A'}</div>
                
                <div className="stock-grid">
                  <div className="stock-box">
                    <div className="stock-label">{TERMINOLOGY.STATUS.STOCKED}</div>
                    <div className="stock-value">{selectedMaterial.qty} <span className="text-muted font-small">{selectedMaterial.unit}</span></div>
                  </div>
                  <div className="stock-box">
                    <div className="stock-label">{TERMINOLOGY.INVENTORY.UNIT_PRICE}</div>
                    <div className="stock-value text-accent">{formatCurrency(selectedMaterial.costPerUnit)}</div>
                  </div>
                </div>

                <div className="history-section mt-20">
                    <div className="label-industrial text-teal border-bottom-subtle mb-10 pb-5">
                       <History /> {TERMINOLOGY.INVENTORY.HISTORY_LOG}
                    </div>
                    <table className="mini-history-table">
                        <thead><tr><th>DATE</th><th>ACTION</th><th className="text-right">QTY</th></tr></thead>
                        <tbody>
                            {selectedMaterial.history?.length > 0 ? (
                                selectedMaterial.history.map((h, i) => (
                                    <tr key={i}>
                                        <td>{h.date.slice(5)}</td>
                                        <td className="text-muted font-small">{h.type || 'USAGE'}</td>
                                        <td className={`text-right font-bold ${h.qty > 0 ? 'text-good' : 'text-alert'}`}>
                                            {h.qty > 0 ? '+' : ''}{h.qty}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3" className="text-muted italic pad-10">No records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <button className="btn-ghost w-full mt-20" onClick={() => setSelectedMaterial(null)}>
                  {TERMINOLOGY.GENERAL.CLOSE}
                </button>
              </div>
            </div>
          ) : (
            /* --- SUPPLY VAULT (DEFAULT) --- */
            <div className="folder-stack-v2">
                {Object.keys(vaultGroups).map(cat => (
                    vaultGroups[cat].length > 0 && (
                        <VaultFolder 
                            key={cat} title={cat} count={vaultGroups[cat].length}
                            items={vaultGroups[cat]} onItemClick={setSelectedMaterial}
                            stampText={cat.split(' ')[0].toUpperCase()}
                        />
                    )
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};