/* src/components/cards/AssetCard.jsx */
import React from 'react';
import './AssetCard.css';
import { Box } from '../Icons'; 
import { formatCurrency } from '../../utils/formatters';
import { TERMINOLOGY } from '../../utils/glossary';
import { ProgressBar } from '../ui/ProgressBar';

export const AssetCard = ({ asset, onClick, isSelected }) => {
  const { name, qty, costPerUnit, status, brand, unit } = asset;
  
  // Logic: Threshold is 10 for low stock
  const isLow = qty > 0 && qty < 10;
  const isOut = qty === 0;
  const isDormant = status === 'Dormant';

  return (
    <div 
      className={`hud-strip ${isLow ? 'border-warning' : isOut ? 'border-alert' : ''} ${isDormant ? 'status-dormant' : ''} ${isSelected ? 'selected' : ''}`} 
      onClick={onClick}
    >
       <div 
          className="hud-status-bar" 
          style={{ backgroundColor: isOut ? 'var(--neon-red)' : isLow ? 'var(--neon-orange)' : 'var(--neon-teal)' }} 
       />
       
       <div className="hud-icon-area">
          <div className="category-icon-wrapper">
             <Box />
          </div>
       </div>

       <div className="hud-info">
          <span className="hud-brand">{brand || 'N/A'}</span>
          <h3 className="hud-title">{name}</h3>
          <div className="hud-cost">{formatCurrency(costPerUnit)} / {unit}</div>
       </div>

       <div className="hud-stats">
          <div className="hud-qty">{qty}</div>
          <div className="hud-unit">{unit}</div>
          {/* Rule 3: Removed redundant wrapper div causing double-border glitches */}
          <ProgressBar 
              value={qty} 
              max={50} 
              colorVar={isOut ? '--neon-red' : isLow ? '--neon-orange' : '--neon-teal'} 
          />
       </div>
       
       {isOut && (
          <div className="status-stamp active alert-stamp">
              {TERMINOLOGY.STATUS.OUT_OF_STOCK}
          </div>
       )}
       {isDormant && !isOut && (
          <div className="status-stamp active dormant-stamp">
              {TERMINOLOGY.STATUS.ON_HOLD}
          </div>
       )}
    </div>
  );
};