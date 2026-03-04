/* src/components/cards/AssetCard.jsx */
import React from 'react';
import './AssetCard.css';
import { StatusBadge } from '../ui/StatusBadge';
import { formatCurrency } from '../../utils/formatters';
import { Alert } from '../Icons';

export const AssetCard = ({ asset, onClick, isSelected }) => {
  const { name, category, qty, unit, costPerUnit, calculatedStatus, reorderDate, committedQty, availableQty } = asset;
  
  // Visual flag if a reorder is critical
  const needsReorder = calculatedStatus === 'OUT_OF_STOCK' || calculatedStatus === 'LOW_STOCK';

  // Determine top border color based on stock health
  let statusClass = 'status-good';
  if (qty <= 0 || calculatedStatus === 'OUT_OF_STOCK') statusClass = 'status-alert';
  else if (qty < 10 || calculatedStatus === 'LOW_STOCK') statusClass = 'status-warning';

  return (
    <div className={`asset-card ${isSelected ? 'selected' : ''} ${statusClass}`} onClick={onClick}>
      
      <div className="asset-header">
         <span className="label-industrial">{category || 'MATERIAL'}</span>
         <div className="font-mono text-muted font-small">{formatCurrency(costPerUnit || 0)}/ea</div>
      </div>
      
      <h3 className="asset-title mb-15">{name || 'Unnamed Asset'}</h3>
      
      {/* Committed Stock Breakdown */}
      <div className="asset-metrics p-15 mb-15 flex-col gap-10">
         <div className="flex-between font-small">
             <span className="text-muted">Total On Hand:</span>
             <span className="font-mono text-main">{qty || 0} <span className="text-muted">{unit || ''}</span></span>
         </div>
         <div className="flex-between font-small">
             <span className="text-warning">Committed:</span>
             <span className="font-mono text-warning">-{committedQty || 0} <span className="opacity-50">{unit || ''}</span></span>
         </div>
         <div className="flex-between font-small border-top-subtle pt-10 mt-5">
             <span className="text-teal font-bold">Available to Make:</span>
             <span className="font-mono text-teal font-bold">{availableQty || 0} <span className="opacity-50">{unit || ''}</span></span>
         </div>
      </div>

      <div className="flex-between align-end mt-auto">
         <div>
            {needsReorder ? (
               <div className="flex-center gap-5 text-alert font-small font-bold animate-pulse">
                   <Alert /> {reorderDate === 'NOW' ? 'ORDER NOW' : `ORDER BY: ${reorderDate}`}
               </div>
            ) : (
                <StatusBadge status="STOCKED" />
            )}
         </div>
         <div className="text-right">
             <span className="metric-label">Total Value</span>
             <div className="text-main font-mono font-large">{formatCurrency((qty || 0) * (costPerUnit || 0))}</div>
         </div>
      </div>
      
    </div>
  );
};