/* src/components/dashboard/ProductionAlerts.jsx */
import React from 'react';
import './DashboardWidgets.css';
import { DASHBOARD_STRINGS } from '../../utils/glossary';
import { Alert } from '../Icons'; 

export default function ProductionAlerts({ alerts = [], fleet = [] }) {
  
  // Find projects that are completely blocked by material shortages
  const haltedProjects = fleet.filter(p => p.productionStatus === 'HALTED');

  return (
    <div className="panel-industrial border-left-alert h-full">
      <div className="panel-header bg-alert-faint">
        <span className="label-industrial text-alert no-margin flex-center gap-5">
           <Alert /> {DASHBOARD_STRINGS.bottleneckRadar}
        </span>
      </div>
      <div className="panel-content flex-col gap-10 p-0">
        
        {haltedProjects.length === 0 && alerts.length === 0 && (
            <div className="p-20 text-muted italic text-center border-bottom-subtle">
                All systems operational. No critical blockers.
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