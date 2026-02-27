/* src/features/workbench/DashboardHome.jsx */
import React, { useState } from 'react';
import './DashboardHome.css';

// Context & Utils
import { useInventory } from '../../context/InventoryContext';
import { useFinancialStats, useFinancial } from '../../context/FinancialContext'; 
import { useStudioIntelligence } from './hooks/useStudioIntelligence'; 
import { formatCurrency } from '../../utils/formatters';
import { TERMINOLOGY, MARKET_TICKER_DATA, APP_CONFIG } from '../../utils/glossary';

// Modals & UI Components
import { ProjectBlueprint } from './components/ProjectBlueprint';
import { IntakeForm } from './components/IntakeForm'; 
import { SaleModal } from './components/SaleModal';   

// NEW Dashboard Modular Components
import TelemetryHUD from '../../components/dashboard/TelemetryHUD';
import DailyBriefing from '../../components/dashboard/DailyBriefing';
import DraftRunway from '../../components/dashboard/DraftRunway';
import ProductionAlerts from '../../components/dashboard/ProductionAlerts';

// Icons
import { Plus, Box, Finance } from '../../components/Icons';

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
  
  const { addTransaction } = useFinancial(); 

  // THE FIX: Plugging the brain back in!
  const { fleetAnalysis, inventoryIntel, logisticsIntel } = useStudioIntelligence(activeProjects, draftProjects, materials);

  const [selectedProject, setSelectedProject] = useState(null);
  
  // COMMAND STATE
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [isProcessingSale, setIsProcessingSale] = useState(false);

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
      await addTransaction({
        description: `Sold ${qty}x ${project.title}`,
        amount: revenue,
        type: 'SALE'
      });
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
      <div className="dashboard-content-scroll">
          
        <div className="dashboard-cockpit z-layer-top relative">
          
          <TelemetryHUD 
            sales={formatCurrency(totalRev)} 
            expenses={formatCurrency(totalCost)} 
            profit={formatCurrency(netProfit)} 
          />

          <div className="command-bar">
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

          <div className="dashboard-grid">
            <div className="dashboard-col-main flex-col gap-20">
              <DailyBriefing fleet={fleetAnalysis} inventoryIntel={inventoryIntel} />
              {/* WIRED: Passing live drafts to the Runway */}
              <DraftRunway drafts={draftProjects} />
            </div>

            <div className="dashboard-col-side flex-col gap-20">
  {/* WIRED: Now passing logisticsIntel to resolve the ESLint error */}
  <ProductionAlerts 
    alerts={inventoryIntel?.out || []} 
    fleet={fleetAnalysis} 
    logistics={logisticsIntel} 
  />
            </div>
          </div>

        </div>
      </div>

      

      {selectedProject && <ProjectBlueprint project={selectedProject} onClose={() => setSelectedProject(null)} />}
      
      {showIntakeModal && (
          <div className="modal-overlay">
              <div className="modal-window modal-medium animate-fade-in p-20">
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