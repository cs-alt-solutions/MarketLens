/* src/features/workbench/InventoryManager.jsx */
import React, { useState, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import './InventoryManager.css';
import { Plus, Back, History } from '../../components/Icons'; 
import { StatCard } from '../../components/cards/StatCard';
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder';
import { AssetCard } from '../../components/cards/AssetCard';
import { VaultFolder } from '../../components/cards/VaultFolder';
import { IntakeForm } from './components/IntakeForm';
import { formatCurrency } from '../../utils/formatters';
import { TERMINOLOGY, APP_CONFIG, CATEGORY_KEYWORDS } from '../../utils/glossary';

const CATEGORIES = Object.keys(CATEGORY_KEYWORDS);

export const InventoryManager = () => {
  const { materials } = useInventory(); 
  const [filter, setFilter] = useState(TERMINOLOGY.INVENTORY.FILTERS.ALL);
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null); 
  
  const metrics = useMemo(() => {
    let totalValue = 0, lowStockCount = 0, outOfStockCount = 0;
    materials.forEach(m => {
      const val = (m.qty || 0) * m.costPerUnit;
      if (m.status !== 'Discontinued') totalValue += val;
      if (m.status === 'Active') {
        if (m.qty <= 0) outOfStockCount++;
        else if (m.qty < 10) lowStockCount++;
      }
    });
    return { totalValue, lowStockCount, outOfStockCount };
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    if (filter === TERMINOLOGY.INVENTORY.FILTERS.ALL) return materials;
    return materials.filter(m => m.status.toUpperCase() === filter);
  }, [materials, filter]);

  const workshopItems = useMemo(() => 
    filteredMaterials.filter(m => APP_CONFIG.INVENTORY.WORKSHOP.includes(m.category)), 
  [filteredMaterials]);
  
  const logisticsItems = useMemo(() => 
    filteredMaterials.filter(m => APP_CONFIG.INVENTORY.LOGISTICS.includes(m.category)), 
  [filteredMaterials]);

  const vaultGroups = useMemo(() => {
    const groups = {};
    CATEGORIES.forEach(cat => groups[cat] = []);
    materials.forEach(m => {
        if (groups[m.category]) groups[m.category].push(m);
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
               {Object.values(TERMINOLOGY.INVENTORY.FILTERS).map(f => (
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

        <StatCard label={TERMINOLOGY.INVENTORY.VALUE_LABEL} value={formatCurrency(metrics.totalValue)} glowColor="purple" />

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
                   asset={m} 
                   onClick={() => setSelectedMaterial(m)}
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
                   asset={m} 
                   onClick={() => setSelectedMaterial(m)}
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
              <ImagePlaceholder text={TERMINOLOGY.INVENTORY.PHOTO_LABEL} />
              <div className="sidebar-inner">
                <h3 className="detail-title">{selectedMaterial.name}</h3>
                <div className="detail-brand">{TERMINOLOGY.GENERAL.BRAND}: {selectedMaterial.brand || 'N/A'}</div>
                
                <div className="history-section mt-20">
                    <div className="label-industrial text-teal border-bottom-subtle mb-10 pb-5">
                       <History /> {TERMINOLOGY.INVENTORY.HISTORY_LOG}
                    </div>
                    
                    <div className="history-list flex-col gap-10 mt-10">
                        {selectedMaterial.history && selectedMaterial.history.length > 0 ? (
                            selectedMaterial.history.map((log, idx) => (
                                <div key={idx} className="flex-between p-10 bg-row-odd border-radius-2 border-subtle">
                                    <div className="flex-col gap-5">
                                        <span className="label-industrial no-margin">{new Date(log.date).toLocaleDateString()}</span>
                                        <span className="font-bold font-small text-main">
                                            {log.type === 'USAGE' ? log.note : (log.type === 'RESTOCK' ? 'Restocked Supply' : 'Initial Intake')}
                                        </span>
                                    </div>
                                    <div className={`font-bold ${log.qty > 0 ? 'text-good' : 'text-warning'}`}>
                                        {log.qty > 0 ? '+' : ''}{log.qty} <span className="font-small">{selectedMaterial.unit}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-muted italic font-small">No transaction history.</div>
                        )}
                    </div>
                </div>

                <button className="btn-ghost w-full mt-20" onClick={() => setSelectedMaterial(null)}>
                  {TERMINOLOGY.GENERAL.CLOSE}
                </button>
              </div>
            </div>
          ) : (
            <div className="folder-stack-v2">
                {CATEGORIES.map(cat => (
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