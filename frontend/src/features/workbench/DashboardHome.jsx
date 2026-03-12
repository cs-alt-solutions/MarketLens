/* src/features/workbench/DashboardHome.jsx */
import React, { useState } from 'react';
import './DashboardHome.css';

// Context & Utils
import { useInventory } from '../../context/InventoryContext';
import { useFinancialStats, useFinancial } from '../../context/FinancialContext'; 
import { useStudioIntelligence } from './hooks/useStudioIntelligence'; 
import { formatCurrency } from '../../utils/formatters';
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

// Icons
import { Plus, Finance, CloseIcon } from '../../components/Icons';

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
    loading: finLoading
  } = useFinancialStats();
  
  const { addTransaction } = useFinancial(); 

  const { fleetAnalysis, inventoryIntel, logisticsIntel } = useStudioIntelligence(activeProjects, draftProjects, materials);

  const [selectedProject, setSelectedProject] = useState(null);
  
  // COMMAND STATE
  const [showUniversalWizard, setShowUniversalWizard] = useState(false);
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
    <div className="dashboard-container">
      <div className="dashboard-content-scroll">
          
        <div className="dashboard-cockpit z-layer-top relative">
          
          <TelemetryHUD 
            sales={formatCurrency(totalRev)} 
            expenses={formatCurrency(totalCost)} 
            profit={formatCurrency(netProfit)} 
          />

          {/* 🚀 THE STREAMLINED STUDIO ACTIONS BAR */}
          <div className="command-bar flex-between align-center bg-panel border-subtle border-radius-2 p-15">
              <div className="flex-col">
                  <span className="font-bold text-main font-large">{DASHBOARD_STRINGS.cmdCenterTitle}</span>
                  <span className="text-muted font-small">{DASHBOARD_STRINGS.cmdCenterSubtitle}</span>
              </div>
              
              <div className="flex-center gap-15">
                  {/* Removed the Record Sale button to drive traffic to the Finance tab */}
                  <button className="btn-primary flex-center gap-10" onClick={() => setShowUniversalWizard(true)}>
                      <Plus /> {DASHBOARD_STRINGS.btnOpenWorkbench}
                  </button>
              </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-col-main flex-col gap-20">
              <DailyBriefing fleet={fleetAnalysis} inventoryIntel={inventoryIntel} />
              <DraftRunway drafts={draftProjects} />
            </div>

            <div className="dashboard-col-side flex-col gap-20">
              <ProductionAlerts 
                alerts={inventoryIntel?.out || []} 
                fleet={fleetAnalysis} 
                logistics={logisticsIntel} 
              />
            </div>
          </div>

        </div>
      </div>

      {/* 🚀 THE NEW MASTER WIZARD ROUTER */}
      {showUniversalWizard && (
          <MasterWizard 
              initialFlow={null} // Null triggers Step 0 Intro
              onClose={() => setShowUniversalWizard(false)} 
              onSaveProject={async (data) => {
                  const created = await addProject(data);
                  if (created) setSelectedProject(created);
                  setShowUniversalWizard(false);
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