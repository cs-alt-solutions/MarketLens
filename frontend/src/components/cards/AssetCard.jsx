/* src/components/cards/AssetCard.jsx */
import React from 'react';
import './AssetCard.css';
import { formatCurrency } from '../../utils/formatters';
import { TERMINOLOGY } from '../../utils/glossary';

export const AssetCard = ({ asset, onClick, isSelected }) => {
  const { name, category, qty, unit, costPerUnit } = asset;
  
  // Determine stock status for border/glow coloring
  let statusClass = 'status-good';
  if (qty === 0) statusClass = 'status-alert';
  else if (qty < 10) statusClass = 'status-warning';

  return (
    <div 
        className={`asset-card ${isSelected ? 'selected' : ''} ${statusClass}`}
        onClick={onClick}
    >
      <div className="asset-header">
         <span className="label-industrial">{category}</span>
         {qty <= 0 && <span className="text-alert font-small font-bold">{TERMINOLOGY.STATUS.OUT_OF_STOCK}</span>}
      </div>
      
      <h3 className="asset-title">{name}</h3>
      
      <div className="asset-metrics">
         <div className="metric-col">
            <span className="label-industrial">{TERMINOLOGY.BLUEPRINT.STOCK}</span>
            <div className={`metric-value ${qty > 0 ? 'text-accent' : 'text-alert'}`}>
                {qty} <span className="font-small text-muted">{unit}</span>
            </div>
         </div>
         <div className="metric-col text-right">
            <span className="label-industrial">{TERMINOLOGY.INVENTORY.UNIT_PRICE}</span>
            <div className="metric-value text-good">
                {formatCurrency(costPerUnit)}
            </div>
         </div>
      </div>
    </div>
  );
};