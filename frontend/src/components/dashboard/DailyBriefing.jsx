/* src/components/dashboard/DailyBriefing.jsx */
import React from 'react';
import './DashboardWidgets.css';
import { DASHBOARD_STRINGS } from '../../utils/glossary';

export default function DailyBriefing({ fleet = [], inventoryIntel = { low: [], out: [] }, materials = [] }) {
  
  const buildQuests = fleet.filter(p => p.health === 'LOW' && p.productionStatus !== 'HALTED');
  const restockQuests = [...(inventoryIntel.out || []), ...(inventoryIntel.low || [])].slice(0, 3); 

  const isBrandNewAccount = materials.length === 0;

  return (
    <div className="panel-industrial">
      <div className="panel-header">
        <span className="label-industrial no-margin text-teal">{DASHBOARD_STRINGS.dailyBriefing}</span>
      </div>
      <div className="panel-content flex-col gap-10">
        
        {/* The First-Run Onboarding */}
        {isBrandNewAccount && (
            <div className="quest-card border-left-teal bg-row-odd p-15 flex-between">
              <div className="flex-col">
                <span className="text-teal font-small font-mono mb-5">{DASHBOARD_STRINGS.prioritySetup}</span>
                <span className="font-bold text-main">{DASHBOARD_STRINGS.addFirstMaterial}</span>
              </div>
              <button className="btn-primary font-small">{DASHBOARD_STRINGS.btnStart}</button>
            </div>
        )}

        {/* Empty State */}
        {!isBrandNewAccount && buildQuests.length === 0 && restockQuests.length === 0 && (
           <div className="p-20 text-good font-mono font-small text-center border-subtle border-radius-2 bg-row-even">
              [ {DASHBOARD_STRINGS.emptyBriefing} ]
           </div>
        )}

        {/* Production Tasks */}
        {!isBrandNewAccount && buildQuests.slice(0, 3).map((item, idx) => {
          const targetBatch = item.engine_recommended_batch || 10; // Math handled by engine!
          return (
            <div key={`build-${item.id || idx}`} className="quest-card border-left-teal bg-row-odd p-15 flex-between">
              <div className="flex-col">
                <span className="text-teal font-small font-mono mb-5">{DASHBOARD_STRINGS.actionProduction}</span>
                <span className="font-bold text-main">{DASHBOARD_STRINGS.craftPrefix} {targetBatch}x {item.title}</span>
              </div>
              <button className="btn-primary font-small">{DASHBOARD_STRINGS.btnStart}</button>
            </div>
          );
        })}

        {/* Restock Tasks */}
        {!isBrandNewAccount && restockQuests.map((mat, idx) => (
          <div key={`restock-${mat.id || idx}`} className="quest-card border-left-orange bg-row-even p-15 flex-between">
            <div className="flex-col">
              <span className="text-orange font-small font-mono mb-5">{DASHBOARD_STRINGS.actionLogistics}</span>
              <span className="font-bold text-main">{DASHBOARD_STRINGS.restockPrefix} {mat.name}</span>
            </div>
            <button className="btn-ghost font-small">{DASHBOARD_STRINGS.btnMarkDone}</button>
          </div>
        ))}

      </div>
    </div>
  );
}