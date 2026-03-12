/* src/features/workbench/DashboardHome.jsx */
import React, { useState } from 'react';
import './DashboardHome.css';

// Context & Utils
import { useInventory } from '../../context/InventoryContext';
import { useFinancialStats, useFinancial } from '../../context/FinancialContext'; 
import { useStudioIntelligence } from './hooks/useStudioIntelligence'; 
import { TERMINOLOGY, DASHBOARD_STRINGS } from '../../utils/glossary';

// Modals & UI Components
import { MasterWizard } from './components/wizard/MasterWizard';
import { ProjectConsole } from './components/wizard/ProjectConsole'; 
import { IntakeForm } from './components/IntakeForm'; 
import { SaleModal } from './components/SaleModal';   

// Dashboard Modular Components
import TelemetryHUD from '../../components/dashboard/TelemetryHUD';
import DailyBriefing from '../../components/dashboard/DailyBriefing';
import DraftRunway from '../../components/dashboard/DraftRunway';
import ProductionAlerts from '../../components/dashboard/ProductionAlerts';
import { RevenueChart } from '../../components/charts/RevenueChart';

// Icons
import { Plus, CloseIcon, Package, DollarSign, DashboardIcon } from '../../components/Icons';

export const DashboardHome = () => {
  const { 
    activeProjects = [], 
    draftProjects = [], 
    materials = [], 
    addProject,
    updateProject,
    loading: invLoading 
  } = useInventory();

  const { 
    netProfit = 0, 
    totalRev = 0, 
    totalCost = 0,
    monthlyBurn = 0, 
    loading: finLoading
  } = useFinancialStats();
  
  const { addTransaction } = useFinancial(); 
  const { fleetAnalysis, inventoryIntel } = useStudioIntelligence(activeProjects, draftProjects, materials);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const [isActionsFlipped, setIsActionsFlipped] = useState(false);
  const [wizardMode, setWizardMode] = useState(null); 
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [isProcessingSale, setIsProcessingSale] = useState(false);

  const sellableProjects = activeProjects.filter(p => p.stockQty > 0);

  const handleLogSale = async (project, qty, revenue, channel) => {
    setIsProcessingSale(true);
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
      setShowSaleModal(false);
    } catch (err) {
      console.error("Dashboard Error: Failed to log transaction.", err);
    } finally {
      setIsProcessingSale(false);
    }
  };

  if (invLoading || finLoading) {
    return (
      <div className="dashboard-container flex-center h-full">
         <div className="text-accent font-mono">{TERMINOLOGY.BOOT.KERNEL}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-content-scroll">
          
        <div className="dashboard-cockpit z-layer-top relative">
          
          {/* 🚀 1. The Floating HUD Orbs (Top Row, perfectly spaced) */}
          <div className="dashboard-orbs-row mb-30">
              <TelemetryHUD 
                sales={totalRev} 
                expenses={totalCost} 
                profit={netProfit} 
                burn={monthlyBurn} 
              />
          </div>

          <div className="dashboard-bento-grid">
            
            {/* 🚀 2. The Massive Velocity Chart (Now a standard Bento Cell, exactly like Profit Matrix) */}
            <div className="bento-cell bento-span-12 p-20 flex-col">
              <span className="label-industrial text-accent mb-15">{DASHBOARD_STRINGS.profitMonitor}</span>
              <div className="chart-wrapper-large" style={{ minHeight: '350px' }}>
                 <RevenueChart />
              </div>
            </div>

            {/* 3. Command Center (Span 8) */}
            <div className={`bento-span-8 flip-container ${isActionsFlipped ? 'flipped' : ''}`}>
                <div className="flipper">
                    
                    <div className="flip-front mega-action-trigger flex-between h-full px-30">
                        <div className="scanline-overlay"></div>
                        <div className="flex-center gap-20 z-layer-top relative">
                            <div className="action-icon-wrapper flex-center flex-shrink-0">
                                <DashboardIcon />
                            </div>
                            <div className="flex-col text-left">
                                <span className="font-bold text-main tracking-wide mega-title">
                                    {DASHBOARD_STRINGS.cmdCenterTitle}
                                </span>
                                <span className="text-muted font-mono mt-5 mega-subtitle">
                                    {DASHBOARD_STRINGS.cmdCenterSubtitle}
                                </span>
                            </div>
                        </div>

                        <div className="flex-center gap-15 z-layer-top relative h-full py-10">
                            <button className="path-btn path-guided" onClick={() => setWizardMode('intro')}>
                                <span className="font-mono font-bold text-teal mb-5 text-uppercase">Guided Mode</span>
                                <span className="font-small text-muted text-center">Step-by-step wizard</span>
                            </button>
                            <button className="path-btn path-express" onClick={() => setIsActionsFlipped(true)}>
                                <span className="font-mono font-bold text-cyan mb-5 text-uppercase">Express Mode</span>
                                <span className="font-small text-muted text-center">Direct tool access</span>
                            </button>
                        </div>
                        <div className="hover-glow-backdrop"></div>
                    </div>

                    <div className="flip-back relative overflow-hidden">
                        <div className="scanline-overlay"></div>
                        <div className="flex-col h-full z-layer-top relative">
                            <div className="flex-between mb-15">
                                <span className="font-mono text-accent font-bold tracking-wide">EXPRESS PROTOCOLS</span>
                                <button className="btn-icon-hover-clean" onClick={(e) => { e.stopPropagation(); setIsActionsFlipped(false); }}>
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className="protocol-grid">
                                <button className="action-protocol-btn btn-spark" onClick={() => { setIsActionsFlipped(false); setWizardMode('project'); }}>
                                    <div className="icon-glow-wrapper"><Plus /></div>
                                    <span className="protocol-title">{DASHBOARD_STRINGS.actionNewProject}</span>
                                    <span className="protocol-desc">Launch a Spark</span>
                                </button>
                                <button className="action-protocol-btn btn-supplies" onClick={() => { setIsActionsFlipped(false); setShowIntakeModal(true); }}>
                                    <div className="icon-glow-wrapper"><Package /></div>
                                    <span className="protocol-title">{DASHBOARD_STRINGS.actionIntake}</span>
                                    <span className="protocol-desc">Log Supplies</span>
                                </button>
                                <button className="action-protocol-btn btn-revenue" onClick={() => { setIsActionsFlipped(false); setShowSaleModal(true); }}>
                                    <div className="icon-glow-wrapper"><DollarSign /></div>
                                    <span className="protocol-title">{DASHBOARD_STRINGS.actionLogSale}</span>
                                    <span className="protocol-desc">Record Revenue</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* 4. Alerts (Span 4) */}
            <div className="bento-cell bento-span-4">
              <ProductionAlerts alerts={inventoryIntel?.out || []} fleet={fleetAnalysis} />
            </div>

            {/* 5. Pipelines */}
            <div className="bento-cell bento-span-12">
              <DailyBriefing fleet={fleetAnalysis} inventoryIntel={inventoryIntel} />
            </div>
            
            <div className="bento-cell bento-span-12">
              <DraftRunway drafts={draftProjects} />
            </div>

          </div>

        </div>
      </div>

      {wizardMode && (
          <MasterWizard 
              initialFlow={wizardMode === 'intro' ? null : wizardMode} 
              onClose={() => setWizardMode(null)} 
              onSaveProject={async (data) => {
                  const created = await addProject(data);
                  if (created) setSelectedProject(created);
                  setWizardMode(null);
              }}
          />
      )}

      {selectedProject && <ProjectConsole project={selectedProject} onClose={() => setSelectedProject(null)} />}
      
      {showIntakeModal && (
          <div className="modal-overlay" onClick={() => setShowIntakeModal(false)}>
              <div className="modal-window modal-medium animate-fade-in p-20" onClick={e => e.stopPropagation()}>
                  <div className="flex-between mb-20 border-bottom-subtle pb-15">
                      <h3 className="m-0 font-large text-neon-cyan">{DASHBOARD_STRINGS.actionIntake}</h3>
                      <button className="btn-icon-hover-clean" onClick={() => setShowIntakeModal(false)}>
                          <CloseIcon />
                      </button>
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