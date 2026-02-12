import React from 'react';
import './ProjectCard.css';
import { formatCurrency, formatDate } from '../utils/formatters';
import { TERMINOLOGY } from '../utils/glossary';

// NEW PROP: showStatus (defaults to true for backward compatibility)
export const ProjectCard = ({ project, onClick, onDelete, readOnly = false, showStatus = true }) => {
  const { title, status, retailPrice, updated_at, stockQty } = project;

  const statusLabel = {
    'active': TERMINOLOGY.STATUS.ACTIVE,
    'draft': TERMINOLOGY.STATUS.DRAFT,
    'completed': TERMINOLOGY.STATUS.COMPLETED,
    'on_hold': TERMINOLOGY.STATUS.ON_HOLD
  }[status] || status.toUpperCase();

  return (
    <div className="folder-container" onClick={onClick}>
      <div className="folder-tab">
        <span className="folder-tab-text">{TERMINOLOGY.GENERAL.ID_LABEL}: {project.id.toString().slice(-4)}</span>
      </div>

      <div className={`folder-body card-hover-effect ${status === 'completed' ? 'catalog-mode' : ''}`}>
        
        {/* CONDITIONAL RENDER: Only show stamp if showStatus is true */}
        {showStatus && (
          <div className={`status-stamp ${status}`}>
            {statusLabel}
          </div>
        )}

        {status === 'completed' && <div className="catalog-stamp-large">{TERMINOLOGY.STATUS.COMPLETED}</div>}

        <div className="folder-content">
          <h3 className="folder-title">{title}</h3>
          
          <div className="mt-20">
            <div className="flex-between mb-10">
              <span className="label-industrial">{TERMINOLOGY.WORKSHOP.BOM_HEADER}</span>
              <div className="stock-indicator-clean">
                {stockQty || 0} {TERMINOLOGY.GENERAL.UNITS}
              </div>
            </div>
            {/* If status is hidden (Dashboard view), we might want the progress bar to pulse? 
                For now, we keep the standard logic. */}
            <div className="progress-track">
              <div className="progress-fill" style={{ width: status === 'completed' ? '100%' : '45%' }}></div>
            </div>
          </div>

          <div className="flex-between mt-20">
             <div>
                <span className="label-industrial">{TERMINOLOGY.WORKSHOP.TARGET_RETAIL}</span>
                <div className="text-accent font-bold">{formatCurrency(retailPrice)}</div>
             </div>
             <div className="text-right">
                <span className="label-industrial">{TERMINOLOGY.WORKSHOP.LAST_EDIT}</span>
                <div className="text-muted" style={{fontSize: '0.75rem'}}>{formatDate(updated_at)}</div>
             </div>
          </div>
          
          {!readOnly && (
            <div className="flex-end mt-20">
              <button 
                className="btn-icon-hover" 
                onClick={(e) => { e.stopPropagation(); onDelete(e); }}
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