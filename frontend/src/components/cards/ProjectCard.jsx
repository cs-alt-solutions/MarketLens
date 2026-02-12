import React from 'react';
import './ProjectCard.css';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { TERMINOLOGY } from '../../utils/glossary';
import { StatusBadge } from '../ui/StatusBadge';
import { ProgressBar } from '../ui/ProgressBar';

export const ProjectCard = ({ project, onClick, onDelete, readOnly = false, showStatus = true }) => {
  const { title, status, retailPrice, updated_at, stockQty } = project;

  return (
    <div className="folder-container" onClick={onClick}>
      <div className="folder-tab">
        <span className="folder-tab-text">
            {TERMINOLOGY.GENERAL.ID_LABEL}: {project.id.toString().slice(-4)}
        </span>
      </div>

      <div className={`folder-body card-hover-effect ${status === 'completed' ? 'catalog-mode' : ''}`}>
        
        {/* FIX: showStatus prop now controls visibility */}
        {showStatus && (
          <div className="status-stamp-wrapper">
             <StatusBadge status={status} />
          </div>
        )}

        {status === 'completed' && (
            <div className="catalog-stamp-large">{TERMINOLOGY.STATUS.COMPLETED}</div>
        )}

        <div className="folder-content">
          <h3 className="folder-title">{title}</h3>
          
          <div className="mt-20">
            <div className="flex-between mb-10">
              <span className="label-industrial">{TERMINOLOGY.WORKSHOP.BOM_HEADER}</span>
              <div className="stock-indicator-clean">
                {stockQty || 0} {TERMINOLOGY.GENERAL.UNITS}
              </div>
            </div>
            <ProgressBar 
                value={status === 'completed' ? 100 : 45} 
                colorVar={status === 'active' ? '--neon-teal' : '--neon-purple'}
            />
          </div>

          <div className="flex-between mt-20">
             <div>
                <span className="label-industrial">{TERMINOLOGY.WORKSHOP.TARGET_RETAIL}</span>
                <div className="text-accent font-bold">{formatCurrency(retailPrice)}</div>
             </div>
             <div className="text-right">
                <span className="label-industrial">{TERMINOLOGY.WORKSHOP.LAST_EDIT}</span>
                <div className="text-muted font-small">{formatDate(updated_at)}</div>
             </div>
          </div>
          
          {/* FIX: readOnly and onDelete integrated to resolve ESLint warnings */}
          {!readOnly && onDelete && (
            <div className="flex-end mt-20">
              <button 
                className="btn-icon-hover" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onDelete(project.id); 
                }}
                title={TERMINOLOGY.GENERAL.DELETE}
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};