import React, { useState, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import './InventoryManager.css';
import { Plus, Back, History } from '../../components/Icons'; 
import { StatCard } from '../../components/StatCard';
import { ImagePlaceholder } from '../../components/ImagePlaceholder';
import { AssetCard } from '../../components/AssetCard';
import { VaultFolder } from '../../components/VaultFolder';
import { IntakeForm } from './components/IntakeForm';
import { formatCurrency } from '../../utils/formatters';
import { TERMINOLOGY } from '../../utils/glossary';

// Note: CATEGORIES are now also derived in IntakeForm to prevent redundancy, 
// but kept here for Vault Grouping logic.
const CATEGORIES = ['Raw Material', 'Packaging', 'Shipping', 'Consumables', 'Hardware', 'Electronics', 'Tools'];
const LOGISTICS_CATS = ['Packaging', 'Shipping'];
const WORKSHOP_CATS = ['Raw Material', 'Consumables', 'Hardware', 'Electronics', 'Tools'];

export const InventoryManager = () => {
  const { materials } = useInventory(); 
  const [filter, setFilter] = useState('ALL');
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null); 
  
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

  const workshopItems = useMemo(() => 
    filteredMaterials.filter(m => WORKSHOP_CATS.includes(m.category)), 
  [filteredMaterials]);
  
  const logisticsItems = useMemo(() => 
    filteredMaterials.filter(m => LOGISTICS_CATS.includes(m.category)), 
  [filteredMaterials]);

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

  const closeSidebarPanel = () => {
    setShowIntakeForm(false);
    setSelectedMaterial(null);
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
           <StatCard label={TERMINOLOGY.INVENTORY.VALUE_LABEL} value={formatCurrency(metrics.totalValue)} glowColor="purple" />
           <StatCard label="OUT OF STOCK" value={metrics.outOfStockCount} glowColor={metrics.outOfStockCount > 0 ? 'red' : 'teal'} isAlert={metrics.outOfStockCount > 0} />
           <StatCard label="LOW STOCK" value={metrics.lowStockCount} glowColor={metrics.lowStockCount > 0 ? 'orange' : 'teal'} />
        </div>

        <div className="blueprint-section">
          <div className="section-separator-inventory">
             <span className="separator-label-inv">{TERMINOLOGY.INVENTORY.SECTION_WORKSHOP}</span>
             <div className="separator-line-inv" />
             <span className="separator-count-inv">{workshopItems.length}</span>
          </div>
          <div className="locker-grid animate-fade-in">
             {workshopItems.length > 0 ? workshopItems.map(m => (
                <AssetCard 
                   key={m.id} 
                   item={m} 
                   onClick={setSelectedMaterial}
                   isSelected={selectedMaterial?.id === m.id}
                />
             )) : (
               <div className="text-muted italic">{TERMINOLOGY.GENERAL.NO_DATA}</div>
             )}
          </div>
        </div>

        <div className="blueprint-section">
          <div className="section-separator-inventory">
             <span className="separator-label-inv logistics">{TERMINOLOGY.INVENTORY.SECTION_LOGISTICS}</span>
             <div className="separator-line-inv" />
             <span className="separator-count-inv">{logisticsItems.length}</span>
          </div>
          <div className="locker-grid animate-fade-in">
             {logisticsItems.length > 0 ? logisticsItems.map(m => (
                <AssetCard 
                   key={m.id} 
                   item={m} 
                   onClick={setSelectedMaterial}
                   isSelected={selectedMaterial?.id === m.id}
                />
             )) : (
               <div className="text-muted italic">{TERMINOLOGY.GENERAL.NO_DATA}</div>
             )}
          </div>
        </div>
      </div>

      <div className="sidebar-col">
         <div className="keyword-header flex-between-center">
           <h3 className="label-industrial glow-purple">
             {showIntakeForm ? TERMINOLOGY.INVENTORY.INTAKE : 
              selectedMaterial ? TERMINOLOGY.INVENTORY.ASSET_DETAILS : 
              TERMINOLOGY.INVENTORY.VAULT_ACCESS}
           </h3>
           {(showIntakeForm || selectedMaterial) && (
               <button onClick={closeSidebarPanel} className="btn-icon" title={TERMINOLOGY.GENERAL.CLOSE}>
                   <Back />
               </button>
           )}
        </div>

        <div className="keyword-list">
          {showIntakeForm ? (
            <IntakeForm onClose={() => setShowIntakeForm(false)} />
          ) : selectedMaterial ? (
            <div className="sidebar-panel animate-fade-in">
              <ImagePlaceholder height="180px" label={TERMINOLOGY.INVENTORY.PHOTO_LABEL} />
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
            <div className="folder-stack-v2">
                <div className="sidebar-section-header">
                  {TERMINOLOGY.INVENTORY.SECTION_WORKSHOP}
                </div>
                {WORKSHOP_CATS.map(cat => (
                    vaultGroups[cat]?.length > 0 && (
                        <VaultFolder 
                            key={cat} title={cat} count={vaultGroups[cat].length}
                            items={vaultGroups[cat]} onItemClick={setSelectedMaterial}
                            stampText={cat.split(' ')[0].toUpperCase()}
                        />
                    )
                ))}

                <div className="sidebar-section-header mt-20">
                  {TERMINOLOGY.INVENTORY.SECTION_LOGISTICS}
                </div>
                {LOGISTICS_CATS.map(cat => (
                    vaultGroups[cat]?.length > 0 && (
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