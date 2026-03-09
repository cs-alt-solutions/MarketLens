/* src/features/workbench/InventoryManager.jsx */
import React, { useState, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { useFinancial } from '../../context/FinancialContext';
import './InventoryManager.css';
import { Plus, Finance, CloseIcon } from '../../components/Icons'; 
import { AssetCard } from '../../components/cards/AssetCard';
import { VendorCard } from '../../components/cards/VendorCard'; 
import { IntakeForm } from './components/IntakeForm';
import { AssetEditForm } from './components/AssetEditForm';
import { VendorEditForm } from './components/VendorEditForm';
import { SaleModal } from './components/SaleModal'; 
import { VendorIntakeForm } from './components/VendorIntakeForm';
import { AssetDetailsSidebar } from './components/AssetDetailsSidebar';
import { TERMINOLOGY } from '../../utils/glossary';
import { formatCurrency } from '../../utils/formatters';

export const InventoryManager = () => {
  const { 
    materials, vendors, activeProjects, updateProject, 
    logisticsIntel, pendingShipments, createFulfillmentTicket, completeFulfillment,
    addMaterial // NEW: Pulling the add function from your context to talk to the Python Engine
  } = useInventory(); 
  
  const { addTransaction } = useFinancial();
  
  const [activeTab, setActiveTab] = useState('MATERIALS'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); 
  const [activeModal, setActiveModal] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('GROUPED');

  const metrics = useMemo(() => {
    let totalValue = 0;
    materials.forEach(m => {
      const val = (m.qty || 0) * m.costPerUnit;
      if (m.status !== 'Discontinued') totalValue += val;
    });
    return { totalValue };
  }, [materials]);

  const availableCategories = useMemo(() => {
      const cats = materials.map(m => m.category || TERMINOLOGY.GENERAL.UNKNOWN);
      return ['ALL', ...new Set(cats)].sort();
  }, [materials]);

  const processedItems = useMemo(() => {
    let result = [];
    if (activeTab === 'MATERIALS') {
        result = materials.filter(m => !['Shipping', 'Packaging'].includes(m.category));
    } else if (activeTab === 'LOGISTICS') {
        result = materials.filter(m => ['Shipping', 'Packaging'].includes(m.category));
    } else {
        return vendors.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    result = result.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.category || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeTab === 'MATERIALS' && categoryFilter !== 'ALL') {
        result = result.filter(m => (m.category || TERMINOLOGY.GENERAL.UNKNOWN) === categoryFilter);
    }

    if (sortBy === 'A_Z') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'Z_A') result.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortBy === 'QTY_DESC') result.sort((a, b) => (b.qty || 0) - (a.qty || 0));
    else if (sortBy === 'QTY_ASC') result.sort((a, b) => (a.qty || 0) - (b.qty || 0));

    return result;
  }, [materials, vendors, activeTab, searchQuery, categoryFilter, sortBy]);

  const groupedItems = useMemo(() => {
      const groups = {};
      processedItems.forEach(item => {
          const cat = item.category || TERMINOLOGY.GENERAL.UNKNOWN;
          if (!groups[cat]) groups[cat] = [];
          groups[cat].push(item);
      });
      return groups;
  }, [processedItems]);

  const handleTabSwitch = (tab) => {
      setActiveTab(tab);
      setSelectedItem(null);
      setSearchQuery('');
  };

  const handleLogSale = async (project, qty, revenue, channel, fulfillmentData) => {
    setIsProcessing(true);
    try {
      await addTransaction({
        description: `Sale: ${project.title} (${qty}x) [${channel}]`,
        amount: revenue, 
        type: 'SALE', 
        date: new Date().toISOString()
      });

      await updateProject({ 
        id: project.id, 
        stockQty: Math.max(0, project.stockQty - qty), 
        soldQty: (project.soldQty || 0) + parseInt(qty) 
      });

      if (fulfillmentData.type === 'SHIPPABLE') {
          await createFulfillmentTicket({
              orderNumber: fulfillmentData.orderInfo || 'N/A',
              itemTitle: project.title,
              qty: qty,
              channel: channel
          });
      }

      setActiveModal(null);
    } catch (err) {
      console.error("Sale logging failure:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // NEW: The Bridge to the Python Engine
  const handleIntakeSubmit = async (payload) => {
    setIsProcessing(true);
    try {
      if (addMaterial) {
        // Passes the clean JSON payload down to your context -> python engine
        await addMaterial(payload);
      } else {
        console.warn("addMaterial function missing in useInventory context. Payload:", payload);
      }
      setActiveModal(null); // Close the modal on success
    } catch (error) {
      console.error("Failed to route material to math engine:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="inventory-layout">
      <div className="inventory-scroll-area">
        <div className="inventory-header">
          <div>
            <h2 className="header-title">{TERMINOLOGY.INVENTORY.HEADER}</h2>
            <div className="tab-group">
                <button className={`tab-btn ${activeTab === 'MATERIALS' ? 'active' : ''}`} onClick={() => handleTabSwitch('MATERIALS')}>{TERMINOLOGY.INVENTORY.TAB_ASSETS}</button>
                <button className={`tab-btn ${activeTab === 'LOGISTICS' ? 'active' : ''}`} onClick={() => handleTabSwitch('LOGISTICS')}>{TERMINOLOGY.INVENTORY.TAB_LOGISTICS}</button>
                <button className={`tab-btn ${activeTab === 'VENDORS' ? 'active' : ''}`} onClick={() => handleTabSwitch('VENDORS')}>{TERMINOLOGY.INVENTORY.TAB_VENDORS}</button>
            </div>
          </div>
          <div className="header-actions">
              <div className="stat-pill">{TERMINOLOGY.INVENTORY.VALUE_PREFIX}{formatCurrency(metrics.totalValue)}</div>
              {activeTab === 'LOGISTICS' && <div className="stat-pill border-orange text-orange">{TERMINOLOGY.INVENTORY.CAPACITY_PREFIX}{logisticsIntel.maxOrders}</div>}
              
              <button className="btn-ghost flex-center gap-10" onClick={() => setActiveModal('LOG_SALE')}>
                  <Finance /> {TERMINOLOGY.INVENTORY.ACTION_LOG_SALE}
              </button>
              
              <button className="btn-primary flex-center gap-10" onClick={() => setActiveModal(activeTab === 'VENDORS' ? 'ADD_VENDOR' : 'ADD_MATERIAL')}>
                  <Plus /> {activeTab === 'VENDORS' ? TERMINOLOGY.INVENTORY.ACTION_ADD_VENDOR : TERMINOLOGY.INVENTORY.ACTION_ADD_ITEM}
              </button>
          </div>
        </div>

        <div className="controls-section">
            <input type="text" className="search-input mb-15" placeholder={TERMINOLOGY.GENERAL.TYPE_SEARCH} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            {activeTab !== 'VENDORS' && (
                <div className="flex-center flex-start gap-20">
                    {activeTab === 'MATERIALS' && (
                        <div className="flex-center gap-10">
                            <span className="text-muted font-small font-mono">{TERMINOLOGY.INVENTORY.FILTER_SHOW}</span>
                            <select className="input-industrial filter-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                                {availableCategories.map(c => <option key={c} value={c}>{c === 'ALL' ? TERMINOLOGY.INVENTORY.ALL_CATEGORIES : c}</option>)}
                            </select>
                        </div>
                    )}
                    <div className="flex-center gap-10">
                        <span className="text-muted font-small font-mono">{TERMINOLOGY.INVENTORY.FILTER_SORT}</span>
                        <select className="input-industrial filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            <option value="GROUPED">{TERMINOLOGY.INVENTORY.SORT_GROUPED}</option>
                            <option value="A_Z">{TERMINOLOGY.INVENTORY.SORT_A_Z}</option>
                            <option value="Z_A">{TERMINOLOGY.INVENTORY.SORT_Z_A}</option>
                            <option value="QTY_DESC">{TERMINOLOGY.INVENTORY.SORT_QTY_DESC}</option>
                            <option value="QTY_ASC">{TERMINOLOGY.INVENTORY.SORT_QTY_ASC}</option>
                        </select>
                    </div>
                </div>
            )}
        </div>

        {activeTab === 'LOGISTICS' ? (
            <div className="shipping-deck animate-fade-in">
                <div className="blueprint-section mb-30">
                    <div className="section-separator-inventory">
                        <span className="separator-label-inv">{TERMINOLOGY.INVENTORY.PENDING_FULFILLMENT} ({pendingShipments.length})</span>
                        <div className="separator-line-inv" />
                    </div>
                    <div className="locker-grid">
                        {pendingShipments.length > 0 ? (
                            pendingShipments.map(order => (
                                <div key={order.id} className="panel-industrial p-15 border-left-teal flex-col gap-10">
                                    <div className="flex-between">
                                        <span className="font-mono text-accent font-small">ORDER {order.orderNumber}</span>
                                        <div className="status-badge bg-row-odd font-tiny">{order.channel}</div>
                                    </div>
                                    <h4 className="m-0 text-main">{order.itemTitle}</h4>
                                    <div className="text-muted font-tiny">Fulfillment: 1x Unit + Packaging</div>
                                    <div className="flex gap-10 mt-10">
                                        <button className="btn-ghost flex-1 py-10 font-tiny" onClick={() => window.alert('Carrier API Integration Initializing...')}>{TERMINOLOGY.INVENTORY.GET_LABEL}</button>
                                        <button className="btn-primary flex-1 py-10 font-tiny" onClick={() => completeFulfillment(order.id)}>{TERMINOLOGY.INVENTORY.SHIP_NOW}</button>
                                    </div>
                                </div>
                            ))
                        ) : <div className="text-muted italic pad-20">{TERMINOLOGY.INVENTORY.EMPTY_SHIPPING}</div>}
                    </div>
                </div>
                <div className="blueprint-section">
                    <div className="section-separator-inventory">
                        <span className="separator-label-inv">{TERMINOLOGY.INVENTORY.SHIPPING_SUPPLIES}</span>
                        <div className="separator-line-inv" />
                    </div>
                    <div className="locker-grid">
                        {materials.filter(m => ['Shipping', 'Packaging'].includes(m.category)).map(m => <AssetCard key={m.id} asset={m} onClick={() => setSelectedItem(m)} isSelected={selectedItem?.id === m.id} />)}
                    </div>
                </div>
            </div>
        ) : activeTab === 'VENDORS' ? (
            <div className="locker-grid animate-fade-in">{processedItems.map(v => <VendorCard key={v.id} vendor={v} onClick={() => setSelectedItem(v)} isSelected={selectedItem?.id === v.id} />)}</div>
        ) : (
            sortBy === 'GROUPED' ? (
                Object.keys(groupedItems).map(cat => (
                    <div key={cat} className="blueprint-section">
                        <div className="section-separator-inventory"><span className="separator-label-inv">{cat}</span><div className="separator-line-inv" /></div>
                        <div className="locker-grid animate-fade-in">{groupedItems[cat].map(m => <AssetCard key={m.id} asset={m} onClick={() => setSelectedItem(m)} isSelected={selectedItem?.id === m.id} />)}</div>
                    </div>
                ))
            ) : (
                <div className="locker-grid animate-fade-in">{processedItems.map(m => <AssetCard key={m.id} asset={m} onClick={() => setSelectedItem(m)} isSelected={selectedItem?.id === m.id} />)}</div>
            )
        )}
      </div>

      <AssetDetailsSidebar 
        selectedItem={selectedItem} 
        activeTab={activeTab} 
        vendors={vendors} 
        onClose={() => setSelectedItem(null)} 
        onEdit={() => setActiveModal('EDIT_ITEM')} 
      />

      {/* --- MODAL RENDERING --- */}
      {activeModal === 'LOG_SALE' && (
        <SaleModal 
            projects={activeProjects.filter(p => p.stockQty > 0)} 
            onSave={handleLogSale} 
            onClose={() => setActiveModal(null)} 
            isProcessing={isProcessing} 
        />
      )}
      
      {activeModal && activeModal !== 'LOG_SALE' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-window modal-medium p-20" onClick={e => e.stopPropagation()}>
                
                <div className="flex-between mb-20 border-bottom-subtle pb-15">
                    <h3 className="m-0 font-large text-neon-cyan">{TERMINOLOGY.INVENTORY[`MODAL_${activeModal}`]}</h3>
                    <button className="btn-icon-hover-clean" onClick={() => setActiveModal(null)}><CloseIcon /></button>
                </div>
                
                <div className="modal-content-scroll max-h-500 overflow-y-auto pr-10">
                    
                    {/* NEW: Passed the handler functions to the updated IntakeForm */}
                    {activeModal === 'ADD_MATERIAL' && (
                        <IntakeForm 
                            onSubmit={handleIntakeSubmit} 
                            onCancel={() => setActiveModal(null)} 
                        />
                    )}

                    {activeModal === 'ADD_VENDOR' && <VendorIntakeForm onClose={() => setActiveModal(null)} />}
                    
                    {activeModal === 'EDIT_ITEM' && activeTab !== 'VENDORS' && selectedItem && (
                        <AssetEditForm 
                            asset={selectedItem} 
                            onClose={() => { setSelectedItem(null); setActiveModal(null); }} 
                            onCancel={() => setActiveModal(null)} 
                            onComplete={() => setActiveModal(null)} 
                        />
                    )}
                    
                    {activeModal === 'EDIT_ITEM' && activeTab === 'VENDORS' && selectedItem && (
                        <VendorEditForm 
                            vendor={selectedItem} 
                            onClose={() => { setSelectedItem(null); setActiveModal(null); }} 
                            onCancel={() => setActiveModal(null)} 
                            onComplete={() => setActiveModal(null)} 
                        />
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};