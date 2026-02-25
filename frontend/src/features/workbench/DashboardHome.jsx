/* src/features/workbench/DashboardHome.jsx */
import React, { useState, useMemo } from 'react';
import './DashboardHome.css';

// Context & Utils
import { useInventory } from '../../context/InventoryContext';
import { useFinancialStats, useFinancial } from '../../context/FinancialContext'; // Added useFinancial
import { useStudioIntelligence } from './hooks/useStudioIntelligence'; 
import { formatCurrency } from '../../utils/formatters';
import { TERMINOLOGY, MARKET_TICKER_DATA, APP_CONFIG } from '../../utils/glossary';

// Components
import { StatCard } from '../../components/cards/StatCard';
import { BarChart } from '../../components/charts/BarChart';
import { AnimatedNumber } from '../../components/charts/AnimatedNumber';
import { MarketTicker } from '../../components/MarketTicker'; 
import { ProjectBlueprint } from './components/ProjectBlueprint';
import { IntakeForm } from './components/IntakeForm'; // NEW IMPORT
import { SaleModal } from './components/SaleModal';   // NEW IMPORT

// Icons
import { 
  Alert, 
  WorkshopIcon, 
  Box, 
  Radar,
  Plus,
  Finance // Added for Log Sale
} from '../../components/Icons';

export const DashboardHome = () => {
  const { 
    activeProjects = [], 
    draftProjects = [], 
    materials = [], 
    addProject,
    updateProject,
    loading: inventoryLoading 
  } = useInventory() || {};

  const { 
    netProfit = 0, 
    totalRev = 0, 
    totalCost = 0,
    loading: financeLoading
  } = useFinancialStats() || {};
  
  const { addTransaction } = useFinancial(); // Hooking up the financial engine

  const { fleetAnalysis, inventoryIntel, logisticsIntel } = useStudioIntelligence(activeProjects, draftProjects, materials);

  const [workshopTab, setWorkshopTab] = useState('FLEET'); 
  const [invTab, setInvTab] = useState('LOGISTICS'); 
  const [selectedProject, setSelectedProject] = useState(null);
  
  // NEW COMMAND STATE
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [isProcessingSale, setIsProcessingSale] = useState(false);

  const liveTickerData = useMemo(() => {
    const materialTrends = materials.slice(0, 3).map(m => ({
      label: m.name,
      value: `${formatCurrency(m.costPerUnit)} / UNIT`,
      trend: 'neutral'
    }));
    return [...materialTrends, ...MARKET_TICKER_DATA];
  }, [materials]);

  const productionChartData = fleetAnalysis.map(p => ({ label: p.title.substring(0,6), value: p.stockQty }));
  const sellableProjects = activeProjects.filter(p => p.stockQty > 0);

  // --- WIRED ACTIONS ---
  const handleNewProject = async () => {
      const newDraft = {
          title: "UNTITLED BUILD",
          status: APP_CONFIG.PROJECT.DEFAULT_STATUS,
          stockQty: 0,
          soldQty: 0,
          recipe: [],
          instructions: []
      };
      const created = await addProject(newDraft);
      if (created) setSelectedProject(created);
  };

  const handleLogSale = async (project, qty, revenue) => {
    setIsProcessingSale(true);
    try {
      // 1. Log the money
      await addTransaction({
        description: `Sold ${qty}x ${project.title}`,
        amount: revenue,
        type: 'SALE'
      });

      // 2. Deduct the stock
      await updateProject({
        id: project.id,
        stockQty: Math.max(0, project.stockQty - qty),
        soldQty: (project.soldQty || 0) + parseInt(qty)
      });

      setShowSaleModal(false);
    } catch (error) {
      console.error("Critical failure logging sale:", error);
    } finally {
      setIsProcessingSale(false);
    }
  };

  if (inventoryLoading || financeLoading) {
    return (
      <div className="dashboard-container pad-20 text-center flex-center h-full">
         <div className="text-accent font-mono mt-20">{TERMINOLOGY.BOOT.KERNEL}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* HUD TOP BAR */}
      <div className="hud-top-bar z-layer-top">
        <div className="hud-metric-group">
            <div className="hud-label text-muted">{TERMINOLOGY.FINANCE.REVENUE}</div>
            <div className="hud-value text-teal">
                <AnimatedNumber value={totalRev} formatter={formatCurrency} />
            </div>
        </div>
        <div className="hud-divider" />
        <div className="hud-metric-group">
            <div className="hud-label text-muted">{TERMINOLOGY.FINANCE.EXPENSE}</div>
            <div className="hud-value text-orange">
                <AnimatedNumber value={totalCost} formatter={formatCurrency} />
            </div>
        </div>
        <div className="hud-divider" />
        <div className="hud-metric-group">
            <div className="hud-label text-muted">{TERMINOLOGY.FINANCE.NET}</div>
            <div className={`hud-value ${netProfit >= 0 ? 'text-good' : 'text-alert'}`}>
                <AnimatedNumber value={netProfit} formatter={formatCurrency} />
            </div>
        </div>
        <div className="hud-spacer" />
        <div className="hud-status">
            <span className="status-indicator-dot active"></span> 
            {TERMINOLOGY.DASHBOARD.TELEMETRY}: ONLINE
        </div>
      </div>

      <div className="dashboard-content-scroll">
          
          {/* FULLY WIRED COMMAND BAR */}
          <div className="command-bar z-layer-top relative">
              <button className="btn-command" onClick={handleNewProject}>
                  <Plus /> {TERMINOLOGY.WORKSHOP.NEW_PROJECT}
              </button>
              <button className="btn-command" onClick={() => setShowIntakeModal(true)}>
                  <Box /> QUICK INTAKE
              </button>
              <button className="btn-command" onClick={() => setShowSaleModal(true)}>
                  <Finance /> {TERMINOLOGY.FINANCE.LOG_SALE}
              </button>
          </div>

          <div className="dashboard-grid z-layer-top relative">
            <div className="dashboard-col-main">
                <div className="panel-tabs mb-15">
                     <button className={`tab-btn ${workshopTab === 'FLEET' ? 'active purple' : ''}`} onClick={() => setWorkshopTab('FLEET')}>
                        <WorkshopIcon /> {TERMINOLOGY.WORKSHOP.TAB_FLEET} ({fleetAnalysis.length})
                    </button>
                    <button className={`tab-btn ${workshopTab === 'LAB' ? 'active dormant' : ''}`} onClick={() => setWorkshopTab('LAB')}>
                        <Box /> {TERMINOLOGY.WORKSHOP.TAB_LAB} ({draftProjects.length})
                    </button>
                </div>
                
                {workshopTab === 'FLEET' && (
                    <div className="dashboard-deck">
                        <div className="panel-industrial pad-20">
                            <div className="flex-between mb-10">
                                <span className="label-industrial text-muted">STOCK LEVELS</span>
                                <span className="text-accent font-mono font-small">REAL-TIME</span>
                            </div>
                            {productionChartData.length > 0 ? (
                                <BarChart data={productionChartData} maxVal={50} colorVar="--neon-purple" height={100} />
                            ) : <div className="text-muted italic">No active production.</div>}
                        </div>

                        {fleetAnalysis.map(p => (
                            <div key={p.id} className="panel-industrial pad-20 clickable hover-glow" onClick={() => setSelectedProject(p)}>
                                <div className="flex-between mb-15">
                                    <div className="project-title-link mb-0">{p.title}</div>
                                    <span className="card-prompt uppercase">[ VIEW SPECS ]</span>
                                </div>
                                <div className="flex-between bg-row-odd p-10 border-radius-2 border-subtle font-mono">
                                    <div className="flex-col">
                                        <span className="text-muted mb-5 font-small">IN STOCK</span>
                                        <span className={`font-bold text-large ${p.health === 'CRITICAL' ? 'text-alert' : 'text-main'}`}>{p.stockQty || 0}</span>
                                    </div>
                                    <div className="flex-col text-center px-15 border-left-subtle border-right-subtle">
                                        <span className="text-muted mb-5 font-small">SOLD</span>
                                        <span className="text-good font-bold text-large">{p.soldQty || 0}</span>
                                    </div>
                                    <div className="flex-col text-right">
                                        <span className="text-muted mb-5 font-small">{TERMINOLOGY.WORKSHOP.CAN_BUILD}</span>
                                        <span className={`font-bold text-large ${p.productionStatus === 'HALTED' ? 'text-alert' : 'text-accent'}`}>
                                            {p.productionStatus === 'HALTED' ? '0' : `+${p.maxBuildable}`}
                                        </span>
                                    </div>
                                </div>
                                {p.productionStatus === 'HALTED' && p.limitingMaterial && (
                                    <div className="mt-15 font-small text-alert flex-center gap-5 justify-start"><Alert /> Bottleneck: {p.limitingMaterial}</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {workshopTab === 'LAB' && (
                    <div className="dashboard-deck">
                        {draftProjects.map(p => (
                            <div key={p.id} className="panel-industrial pad-20 opacity-80 clickable hover-glow" onClick={() => setSelectedProject(p)}>
                                <div className="flex-between mb-5">
                                    <span className="font-bold text-muted">{p.title}</span>
                                    <span className="card-prompt text-warning">[ FINISH SETUP ]</span>
                                </div>
                                <div className="mt-10 p-10 bg-darker border-subtle border-radius-2">
                                    <div className="flex-between align-start">
                                      <div className="font-small text-warning uppercase font-bold tracking-wider">{TERMINOLOGY.WORKSHOP.MISSING}</div>
                                      <div className="flex-wrap gap-5 flex-center justify-end max-w-150">
                                          {(!p.recipe || p.recipe.length === 0) && <span className="status-indicator-dot warning-text font-tiny">RECIPE</span>}
                                          {(!p.brand_specs || !p.brand_specs.label_size) && <span className="status-indicator-dot warning-text font-tiny">BRANDING</span>}
                                          {(!p.retailPrice) && <span className="status-indicator-dot warning-text font-tiny">PRICING</span>}
                                      </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="dashboard-col-side">
                <div className="panel-industrial full-height-panel">
                    <div className="panel-tabs">
                        <button className={`tab-btn ${invTab === 'LOGISTICS' ? 'active teal' : ''}`} onClick={() => setInvTab('LOGISTICS')}><Radar /> {TERMINOLOGY.LOGISTICS.TAB}</button>
                        <button className={`tab-btn ${invTab === 'CRITICAL' ? 'active alert' : ''}`} onClick={() => setInvTab('CRITICAL')}><Alert /> OUT ({inventoryIntel?.out?.length || 0})</button>
                    </div>

                    <div className="panel-content no-pad overflow-y-auto">
                        {invTab === 'LOGISTICS' && (
                            <div className="logistics-sim-view">
                                <div className="sim-header pad-20">
                                    <div className="label-industrial text-muted">{TERMINOLOGY.LOGISTICS.CAPACITY}</div>
                                    <div className={`sim-big-number ${logisticsIntel.maxShipments < 20 ? 'text-alert' : 'text-accent'}`}>{Math.floor(logisticsIntel.maxShipments)} <span className="text-muted font-small">PACKAGES</span></div>
                                    {logisticsIntel.maxShipments < 50 && (
                                        <div className="sim-bottleneck mt-10">
                                            <span className="text-warning font-small flex-center gap-5 justify-start"><Alert /> {TERMINOLOGY.LOGISTICS.BOTTLENECK}: {logisticsIntel.limitingFactor}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="logistics-divider" />
                                <div className="pad-20">
                                    <div className="label-industrial mb-10 text-muted">{TERMINOLOGY.LOGISTICS.SIM}</div>
                                    {logisticsIntel.shippingItems.map(m => (
                                        <div key={m.id} className="flex-between mb-5 font-small"><span>{m.name}</span><span className={m.qty < 20 ? 'text-alert font-bold' : 'text-good font-bold'}>{m.qty}</span></div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {invTab === 'CRITICAL' && (
                            <div className="pad-20 animate-fade-in">
                                <div className="label-industrial mb-15 text-muted">SUPPLY CHAIN ALERTS</div>
                                {inventoryIntel?.out?.length > 0 ? (
                                    <div className="flex-col gap-10">
                                        {inventoryIntel.out.map(m => (
                                            <div key={m.id} className="flex-between p-15 bg-row-odd border-subtle border-radius-2 border-left-alert">
                                                <div className="flex-col">
                                                    <span className="font-bold text-main">{m.name}</span>
                                                    <span className="text-muted font-mono font-tiny mt-5 uppercase">
                                                        {m.category}
                                                    </span>
                                                </div>
                                                <div className="flex-col text-right">
                                                    <span className="text-alert font-bold font-mono text-large">0</span>
                                                    <span className="text-muted font-tiny uppercase">IN STOCK</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center p-20 text-muted italic border-dashed border-subtle border-radius-2 mt-10">
                                        All systems green. No critical material shortages.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
          </div>
      </div>

      <div className="dashboard-footer z-layer-top">
         <MarketTicker items={liveTickerData} />
      </div>

      {/* --- ALL MODALS (WIRED EXECUTIONS) --- */}
      {selectedProject && <ProjectBlueprint project={selectedProject} onClose={() => setSelectedProject(null)} />}
      
      {showIntakeModal && (
          <div className="modal-overlay">
              <div className="modal-window modal-medium animate-fade-in p-20" style={{ background: 'var(--bg-panel)' }}>
                  <div className="flex-between mb-20 border-bottom-subtle pb-10">
                      <h3 className="label-industrial m-0">{TERMINOLOGY.INVENTORY.INTAKE}</h3>
                      <button className="btn-icon-hover-clean font-large font-bold" onClick={() => setShowIntakeModal(false)}>×</button>
                  </div>
                  <IntakeForm onClose={() => setShowIntakeModal(false)} />
              </div>
          </div>
      )}

      {showSaleModal && (
        <SaleModal 
          projects={sellableProjects}
          onSave={handleLogSale}
          onClose={() => setShowSaleModal(false)}
          isProcessing={isProcessingSale}
        />
      )}

    </div>
  );
};