/* src/components/dashboard/ProductionAlerts.jsx */
import React from 'react';
import './DashboardWidgets.css';
import { TERMINOLOGY } from '../../utils/glossary';
import { Alert } from '../Icons'; 
import { useInventory } from '../../context/InventoryContext';

export default function ProductionAlerts({ alerts = [], fleet = [] }) {
  const { logisticsIntel } = useInventory();
  
  const haltedProjects = fleet.filter(p => p.productionStatus === 'HALTED');
  const isCriticalLogistics = logisticsIntel.maxOrders < 10;

  return (
    <div className="panel-industrial border-left-alert h-full">
      <div className="panel-header bg-alert-faint">
        <span className="label-industrial text-alert no-margin flex-center gap-5">
           <Alert /> PRODUCTION & LOGISTICS ALERTS
        </span>
      </div>
      <div className="panel-content flex-col gap-10 p-0">
        
        {/* Logistics Bottleneck Alert */}
        <div className="p-15 border-bottom-subtle bg-row-even">
           <div className="flex-between mb-10">
              <span className="text-muted font-small font-mono">{TERMINOLOGY.LOGISTICS.CAPACITY}</span>
              <span className={`font-bold font-large ${isCriticalLogistics ? 'text-alert' : 'text-teal'}`}>
                {logisticsIntel.maxOrders}
              </span>
           </div>
           {isCriticalLogistics && (
               <div className="p-10 bg-panel border-alert text-center animate-pulse">
                  <span className="text-alert font-bold font-mono font-small">
                    BOTTLENECK: {logisticsIntel.bottleneck?.toUpperCase()}
                  </span>
               </div>
           )}
        </div>

        {haltedProjects.length === 0 && alerts.length === 0 && !isCriticalLogistics && (
            <div className="p-20 text-teal font-mono font-small text-center">
                SYSTEMS NOMINAL // NO SHORTAGES
            </div>
        )}

        {haltedProjects.map((p, idx) => (
            <div key={p.id || idx} className="relative p-15 border-bottom-subtle bg-row-odd overflow-hidden">
              <div className="scanline-overlay"></div>
              <div className="flex-col relative z-layer-top">
                <span className="text-alert font-bold font-mono text-blink font-small mb-5">PRODUCTION HALTED</span>
                <span className="font-bold text-main">{p.title}</span>
                <div className="mt-15 p-10 bg-panel border-alert text-center">
                   <span className="text-warning font-bold font-mono font-small">
                     MISSING: {p.limitingMaterial || 'Unknown Material'}
                   </span>
                </div>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}