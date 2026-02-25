/* src/components/dashboard/DailyBriefing.jsx */
import React from 'react';
import './DashboardWidgets.css';
import { DASHBOARD_STRINGS } from '../../utils/glossary';

export default function DailyBriefing({ fleet = [], inventoryIntel = { low: [], out: [] } }) {
  
  // 1. Manufacturing Quests (Items low on stock but CAN be built)
  const buildQuests = fleet.filter(p => p.health === 'LOW' && p.productionStatus !== 'HALTED');
  
  // 2. Logistics/Restock Quests (Items low on stock or completely out)
  // We grab the top 3 most urgent items to avoid cluttering the quest log
  const restockQuests = [...(inventoryIntel.out || []), ...(inventoryIntel.low || [])].slice(0, 3); 

  return (
    <div className="panel-industrial">
      <div className="panel-header">
        <span className="label-industrial no-margin text-teal">{DASHBOARD_STRINGS.dailyBriefing}</span>
      </div>
      <div className="panel-content flex-col gap-10">
        
        {/* EMPTY STATE */}
        {buildQuests.length === 0 && restockQuests.length === 0 && (
           <div className="p-20 text-muted italic text-center border-bottom-subtle">
              No active missions. Operations are nominal.
           </div>
        )}

        {/* DYNAMIC MANUFACTURING MISSIONS */}
        {buildQuests.slice(0, 3).map((item, idx) => {
          // Suggest making a batch of 10, or whatever the max buildable is if under 10
          const targetBatch = item.maxBuildable < 10 ? item.maxBuildable : 10;
          
          return (
            <div key={`build-${item.id || idx}`} className="quest-card border-left-teal bg-row-odd p-15 flex-between">
              <div className="flex-col">
                <span className="text-teal font-small font-mono mb-5">QUEST: MANUFACTURING</span>
                <span className="font-bold text-main">Craft {targetBatch}x {item.title}</span>
              </div>
              <button className="btn-primary font-small">EXECUTE</button>
            </div>
          );
        })}

        {/* DYNAMIC RESTOCK MISSIONS */}
        {restockQuests.map((mat, idx) => (
          <div key={`restock-${mat.id || idx}`} className="quest-card border-left-orange bg-row-even p-15 flex-between">
            <div className="flex-col">
              <span className="text-orange font-small font-mono mb-5">QUEST: LOGISTICS</span>
              <span className="font-bold text-main">Restock {mat.name}</span>
            </div>
            <button className="btn-ghost font-small">MARK DONE</button>
          </div>
        ))}

      </div>
    </div>
  );
}