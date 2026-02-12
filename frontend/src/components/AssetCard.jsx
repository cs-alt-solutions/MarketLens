import React from 'react';
import { PhotoIcon } from './Icons';
import { formatCurrency } from '../utils/formatters';
import { TERMINOLOGY } from '../utils/glossary';
import './AssetCard.css';

export const AssetCard = ({ item, onClick, isSelected }) => {
  const isLow = item.qty < 10 && item.qty > 0;
  const isOut = item.qty === 0;
  
  let statusColor = 'var(--neon-teal)';
  let statusGlow = 'rgba(45, 212, 191, 0.1)';
  let statusText = TERMINOLOGY.STATUS.STOCKED;
  
  if (isOut) {
     statusColor = 'var(--neon-red)';
     statusGlow = 'rgba(239, 68, 68, 0.1)';
     statusText = TERMINOLOGY.STATUS.EMPTY;
  } else if (isLow) {
     statusColor = 'var(--neon-orange)';
     statusGlow = 'rgba(251, 146, 60, 0.1)';
     statusText = TERMINOLOGY.STATUS.LOW;
  }

  const barWidth = Math.min((item.qty / 100) * 100, 100);

  return (
    <div 
      className={`hud-strip ${isSelected ? 'selected' : ''}`} 
      onClick={() => onClick(item)}
      style={{ '--status-color': statusColor, '--status-glow': statusGlow }}
    >
       <div className="hud-status-bar"></div>
       <div className="hud-icon-area">
          <div className="category-icon-wrapper">
             <PhotoIcon />
          </div>
       </div>
       <div className="hud-info">
          <div className="flex-between mb-5">
             <span className="hud-brand">{item.brand || 'GENERIC'}</span>
             <span className="hud-status-text" style={{ color: statusColor }}>{statusText}</span>
          </div>
          <div className="hud-title">{item.name}</div>
          <div className="hud-cost">{formatCurrency(item.costPerUnit)} <span className="text-muted">/ unit</span></div>
       </div>
       <div className="hud-stats">
          <div className="hud-qty">
             {item.qty} <span className="hud-unit">{item.unit}</span>
          </div>
          <div className="hud-progress-track">
             <div className="hud-progress-fill" style={{ width: `${barWidth}%`, backgroundColor: statusColor }} />
          </div>
       </div>
    </div>
  );
};