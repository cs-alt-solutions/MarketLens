/* src/components/cards/ProjectCard.jsx */
import React from 'react';
import './ProjectCard.css';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { TERMINOLOGY } from '../../utils/glossary';
import { StatusBadge } from '../ui/StatusBadge';
import { ProgressBar } from '../ui/ProgressBar';
import { CloseIcon } from '../Icons';

export const ProjectCard = ({ project, onClick, onDelete, readOnly = false, showStatus = true }) => {
  const { title, status, retailPrice, updated_at, stockQty, recipe } = project;
  const isDraft = status === 'draft' || status === 'Planning' || !status;

  return (
    <div className="folder-container" onClick={onClick}>
      <div className="folder-tab">
        <span className="folder-tab-text">
            {TERMINOLOGY.GENERAL.ID_LABEL}: {project.id ? project.id.toString().slice(-4) : 'NEW'}
        </span>
      </div>

      <div className={`folder-body card-hover-effect ${status === 'completed' ? 'catalog-mode' : ''}`}>
        
        {showStatus && (
          <div className="status-stamp-wrapper">
             <StatusBadge status={status || 'draft'} />
          </div>
        )}

        <div className="folder-content">
          <h3 className="folder-title mb-20">{title || 'UNTITLED BUILD'}</h3>
          
          <div className="metrics-grid mb-15">
              <div className="metric-box">
                  <span className="label-industrial">{TERMINOLOGY.WORKSHOP.BOM_HEADER}</span>
                  <div className="metric-value">{recipe?.length || 0} ITEMS</div>
              </div>
              <div className="metric-box">
                  <span className="label-industrial">{TERMINOLOGY.BLUEPRINT.STOCK}</span>
                  <div className="metric-value text-accent">{stockQty || 0} {TERMINOLOGY.GENERAL.UNITS}</div>
              </div>
          </div>

          {!isDraft && (
              <ProgressBar 
                  value={status === 'completed' ? 100 : 45} 
                  colorVar={status === 'active' ? '--neon-teal' : '--neon-purple'}
              />
          )}

          <div className="flex-between mt-20 pt-15 border-top-dashed">
             <div>
                <span className="label-industrial">{TERMINOLOGY.WORKSHOP.TARGET_RETAIL}</span>
                <div className="text-good font-bold">{formatCurrency(retailPrice || 0)}</div>
             </div>
             <div className="text-right">
                <span className="label-industrial">{TERMINOLOGY.WORKSHOP.LAST_EDIT}</span>
                <div className="text-muted font-small">{updated_at ? formatDate(updated_at) : 'JUST NOW'}</div>
             </div>
          </div>
          
          {!readOnly && onDelete && (
            <div className="flex-end mt-10">
              <button 
                className="btn-icon-hover" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onDelete(project.id); 
                }}
                title={TERMINOLOGY.GENERAL.DELETE}
              >
                <CloseIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};