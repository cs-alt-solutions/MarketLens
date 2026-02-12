/* src/components/cards/AssetCard.jsx */
import React from 'react';
import './AssetCard.css';
/* PATH RECALIBRATED: Reaching siblings and parents in the new architecture */
import { Box, AlertOctagon } from '../Icons'; 
import { formatCurrency } from '../../utils/formatters';
import { TERMINOLOGY } from '../../utils/glossary';
/* NEW ATOMIC INTEGRATION */
import { StatusBadge } from '../ui/StatusBadge';
import { ProgressBar } from '../ui/ProgressBar';

export const AssetCard = ({ asset, onClick }) => {
  const { name, currentStock, minStock, unitPrice, status } = asset;
  const isLow = currentStock <= minStock;

  return (
    <div className={`asset-card-industrial ${isLow ? 'border-warning' : ''}`} onClick={onClick}>
       <div className="asset-card-header">
          <div className="flex-center gap-10">
             <Box className={isLow ? 'text-warning' : 'text-accent'} />
             <div className="flex-column">
                <span className="asset-name">{name}</span>
                {/* FIX: 'status' is now used here, resolving ESLint warning */}
                <StatusBadge status={status || (isLow ? 'low' : 'active')} />
             </div>
          </div>
          {isLow && <AlertOctagon className="text-warning animate-pulse" />}
       </div>

       <div className="asset-card-body">
          <div className="stock-status-row mb-10">
             <span className="label-industrial">{TERMINOLOGY.INVENTORY.STOCK_LEVEL}</span>
             <span className={`font-mono font-bold ${isLow ? 'text-warning' : 'text-good'}`}>
                {currentStock} / {minStock}
             </span>
          </div>

          {/* INTEGRATION: Adding the atomic ProgressBar for visual stock tracking */}
          <ProgressBar 
            value={currentStock} 
            max={minStock * 2} 
            colorVar={isLow ? '--neon-orange' : '--neon-teal'} 
          />

          <div className="price-tag-row mt-15">
             <span className="label-industrial">{TERMINOLOGY.INVENTORY.UNIT_COST}</span>
             <span className="text-accent font-mono">{formatCurrency(unitPrice)}</span>
          </div>
       </div>
       
       <div className="card-corner-accent" />
    </div>
  );
};