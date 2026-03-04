/* src/features/workbench/InventoryManager.jsx */
import React, { useState, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { useFinancial } from '../../context/FinancialContext';
import './InventoryManager.css';
import { Plus, Back, History, EditIcon, CloseIcon, Finance } from '../../components/Icons'; 
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder';
import { AssetCard } from '../../components/cards/AssetCard';
import { VendorCard } from '../../components/cards/VendorCard'; 
import { IntakeForm } from './components/IntakeForm';
import { AssetEditForm } from './components/AssetEditForm';
import { VendorEditForm } from './components/VendorEditForm';
import { SaleModal } from './components/SaleModal'; 
import { TERMINOLOGY } from '../../utils/glossary';
import { formatCurrency, getFaviconUrl, getDomainFromUrl } from '../../utils/formatters';

export const InventoryManager = () => {
  const { 
    materials, vendors, activeProjects, updateProject, addVendor, 
    logisticsIntel, pendingShipments, createFulfillmentTicket, completeFulfillment 
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
      const cats = materials.map(m => m.category || 'Uncategorized');
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
        result = result.filter(m => (m.category || 'Uncategorized') === categoryFilter);
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
          const cat = item.category || 'Uncategorized';
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

  // --- REWIRED: LOG SALE ENGINE ---
  const handleLogSale = async (project, qty, revenue, channel, fulfillmentData) => {
    setIsProcessing(true);
    try {
      // 1. Log Transaction
      await addTransaction({
        description: `Sale: ${project.title} (${qty}x) [${channel}]`,
        amount: revenue, 
        type: 'SALE', 
        date: new Date().toISOString()
      });

      // 2. Update Stock
      await updateProject({ 
        id: project.id, 
        stockQty: Math.max(0, project.stockQty - qty), 
        soldQty: (project.soldQty || 0) + parseInt(qty) 
      });

      // 3. IF Shippable, Create Fulfillment Ticket
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

  const VendorIntakeForm = () => {
      const [formData, setFormData] = useState({ name: '', website: '', leadTime: '', contactInfo: '', reliability: 100 });
      const onSubmit = async (e) => { e.preventDefault(); await addVendor(formData); setActiveModal(null); };
      return (
          <form onSubmit={onSubmit}>
              <div className="lab-form-group mb-15"><label className="label-industrial">VENDOR NAME</label><input required type="text" className="input-industrial" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
              <div className="lab-form-group mb-15"><label className="label-industrial">WEBSITE</label><input type="url" className="input-industrial" placeholder="https://..." value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} /></div>
              <div className="lab-form-group mb-15"><label className="label-industrial">LEAD TIME (DAYS)</label><input type="number" className="input-industrial" value={formData.leadTime} onChange={e => setFormData({...formData, leadTime: e.target.value})} /></div>
              <div className="lab-form-group mb-20"><label className="label-industrial">NOTES</label><textarea className="input-industrial" rows="3" value={formData.contactInfo} onChange={e => setFormData({...formData, contactInfo: e.target.value})} /></div>
              <button type="submit" className="btn-primary w-full">SAVE VENDOR</button>
          </form>
      );
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
              <div className="stat-pill">Value: {formatCurrency(metrics.totalValue)}</div>
              {activeTab === 'LOGISTICS' && <div className="stat-pill border-orange text-orange">Capacity: {logisticsIntel.maxOrders}</div>}
              <button className="btn-ghost flex-center gap-10" onClick={() => setActiveModal('LOG_SALE')}><Finance /> Log Sale</button>
              <button className="btn-primary flex-center gap-10" onClick={() => setActiveModal(activeTab === 'VENDORS' ? 'ADD_VENDOR' : 'ADD_MATERIAL')}><Plus /> {activeTab === 'VENDORS' ? 'Add Vendor' : 'Add Item'}</button>
          </div>
        </div>

        <div className="controls-section">
            <input type="text" className="search-input mb-15" placeholder={TERMINOLOGY.GENERAL.TYPE_SEARCH} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            {activeTab !== 'VENDORS' && (
                <div className="flex-center flex-start gap-20">
                    {activeTab === 'MATERIALS' && (
                        <div className="flex-center gap-10"><span className="text-muted font-small font-mono">SHOW:</span><select className="input-industrial filter-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>{availableCategories.map(c => <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>)}</select></div>
                    )}
                    <div className="flex-center gap-10"><span className="text-muted font-small font-mono">SORT:</span><select className="input-industrial filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}><option value="GROUPED">Group by Category</option><option value="A_Z">A to Z</option><option value="Z_A">Z to A</option><option value="QTY_DESC">Stock High</option><option value="QTY_ASC">Stock Low</option></select></div>
                </div>
            )}
        </div>

        {activeTab === 'LOGISTICS' ? (
            <div className="shipping-deck animate-fade-in">
                <div className="blueprint-section mb-30">
                    <div className="section-separator-inventory">
                        <span className="separator-label-inv">PENDING FULFILLMENT ({pendingShipments.length})</span>
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
                                        <button className="btn-ghost flex-1 py-10 font-tiny" onClick={() => window.alert('Carrier API Integration Initializing...')}>GET LABEL</button>
                                        <button className="btn-primary flex-1 py-10 font-tiny" onClick={() => completeFulfillment(order.id)}>SHIP NOW</button>
                                    </div>
                                </div>
                            ))
                        ) : <div className="text-muted italic pad-20">Shipping queue is empty. Ready for new orders.</div>}
                    </div>
                </div>
                <div className="blueprint-section">
                    <div className="section-separator-inventory">
                        <span className="separator-label-inv">Shipping Supplies</span>
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

      <div className="sidebar-col">
         <div className="keyword-header flex-between"><h3 className="label-industrial glow-purple">{selectedItem ? 'Details' : 'Select Item'}</h3>{selectedItem && <button onClick={() => setSelectedItem(null)} className="btn-icon-hover-clean"><Back /></button>}</div>
         <div className="keyword-list">
          {selectedItem ? (
            <div className="sidebar-panel animate-fade-in">
              {activeTab !== 'VENDORS' && <ImagePlaceholder text="Photo" />}
              {activeTab === 'VENDORS' && selectedItem.website && <div className="pad-20 border-bottom-subtle bg-row-even flex-center"><img src={getFaviconUrl(selectedItem.website, 128)} alt={selectedItem.name} className="vendor-logo-large" /></div>}
              <div className="sidebar-inner pad-20">
                <div className="flex-between align-start mb-10"><h3 className="detail-title m-0">{selectedItem.name}</h3><button onClick={() => setActiveModal('EDIT_ITEM')} className="btn-icon-hover-clean text-accent mt-5"><EditIcon /></button></div>
                {activeTab !== 'VENDORS' ? (
                    <>
                        <div className="mb-15 mt-10"><span className="label-industrial">SUPPLIED BY</span><div className="mt-5 font-mono text-accent">{selectedItem.vendorId && vendors.find(v => v.id === selectedItem.vendorId) ? vendors.find(v => v.id === selectedItem.vendorId).name : "NO VENDOR LINKED"}</div></div>
                        <div className="history-section mt-20"><div className="label-industrial text-teal border-bottom-subtle mb-10 pb-5"><History /> Stock History</div><div className="history-list flex-col gap-10">{selectedItem.history?.length > 0 ? selectedItem.history.map((log, idx) => (<div key={idx} className="flex-between p-10 bg-row-odd border-radius-2 border-subtle"><span className="font-small text-muted">{new Date(log.date).toLocaleDateString()}</span><span className={log.qty > 0 ? 'text-good' : 'text-warning'}>{log.qty > 0 ? '+' : ''}{log.qty}</span></div>)) : <div className="text-muted italic font-small">No history logged.</div>}</div></div>
                    </>
                ) : (
                    <div className="vendor-details mt-20"><div className="mb-20"><span className="label-industrial">Website</span>{selectedItem.website ? (<div className="mt-5"><a href={selectedItem.website.startsWith('http') ? selectedItem.website : `https://${selectedItem.website}`} target="_blank" rel="noreferrer" className="text-accent font-mono">{getDomainFromUrl(selectedItem.website)} ↗</a></div>) : <div className="mt-5 text-muted font-mono">N/A</div>}</div><div className="mb-20"><span className="label-industrial">Notes</span><div className="mt-10 font-mono text-main bg-bg-app p-15 border-radius-2 border-subtle notes-display">{selectedItem.contactInfo || 'No notes.'}</div></div><div className="mb-15"><span className="label-industrial">Reliability</span><div className={`text-xl font-bold mt-5 ${selectedItem.reliability >= 80 ? 'text-good' : 'text-warning'}`}>{selectedItem.reliability}/100</div></div></div>
                )}
              </div>
            </div>
          ) : <div className="flex-center h-full text-muted italic font-small">Select item to view</div>}
        </div>
      </div>

      {activeModal === 'LOG_SALE' && (
        <SaleModal 
            projects={activeProjects.filter(p => p.stockQty > 0)} 
            onSave={handleLogSale} 
            onClose={() => setActiveModal(null)} 
            isProcessing={isProcessing} 
        />
      )}
      
      {activeModal && activeModal !== 'LOG_SALE' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}><div className="modal-window modal-medium p-20" onClick={e => e.stopPropagation()}><div className="flex-between mb-20 border-bottom-subtle pb-15"><h3 className="m-0 font-large text-neon-cyan">{activeModal.replace('_', ' ')}</h3><button className="btn-icon-hover-clean" onClick={() => setActiveModal(null)}><CloseIcon /></button></div><div className="modal-content-scroll max-h-500 overflow-y-auto pr-10">{activeModal === 'ADD_MATERIAL' && <IntakeForm onClose={() => setActiveModal(null)} />}{activeModal === 'ADD_VENDOR' && <VendorIntakeForm />}{activeModal === 'EDIT_ITEM' && activeTab !== 'VENDORS' && selectedItem && <AssetEditForm asset={selectedItem} onClose={() => { setSelectedItem(null); setActiveModal(null); }} onCancel={() => setActiveModal(null)} onComplete={() => setActiveModal(null)} />}{activeModal === 'EDIT_ITEM' && activeTab === 'VENDORS' && selectedItem && <VendorEditForm vendor={selectedItem} onClose={() => { setSelectedItem(null); setActiveModal(null); }} onCancel={() => setActiveModal(null)} onComplete={() => setActiveModal(null)} />}</div></div></div>
      )}
    </div>
  );
};