import React from 'react';
import './ProjectCard.css';
import { formatCurrency, formatDate } from '../utils/formatters';

export const ProjectCard = ({ project, onClick, onDelete, readOnly = false }) => {
  const { title, status, retailPrice, updated_at, stockQty } = project;

  return (
    <div className="folder-container" onClick={onClick}>
      <div className="folder-tab">
        <span className="folder-tab-text">ID: {project.id.toString().slice(-4)}</span>
      </div>

      <div className={`folder-body card-hover-effect ${status === 'completed' ? 'catalog-mode' : ''}`}>
        
        {/* Updated "HALTED" to "SUSPENDED" */}
        <div className={`status-stamp ${status}`}>
          {status === 'on_hold' ? 'SUSPENDED' : status}
        </div>

        {status === 'completed' && <div className="catalog-stamp-large">CATALOGED</div>}
        
        {/* STATUS STAMP: Rotated and styled via CSS */}
        <div className={`status-stamp ${status}`}>
          {status === 'on_hold' ? 'SUSPENDED' : status}
        </div>

        {status === 'completed' && <div className="catalog-stamp-large">CATALOGED</div>}

        <div className="folder-content">
          <h3 className="folder-title">{title}</h3>
          
          <div className="mt-20">
            <div className="flex-between mb-10">
              <span className="label-industrial">INVENTORY STOCK</span>
              <div className="stock-indicator-clean">
                {stockQty || 0} UNITS
              </div>
            </div>
            {/* Progress track from global and local CSS */}
            <div className="progress-track">
              <div className="progress-fill" style={{ width: status === 'completed' ? '100%' : '45%' }}></div>
            </div>
          </div>

          <div className="flex-between mt-20">
             <div>
                <span className="label-industrial">RETAIL TARGET</span>
                <div className="text-accent font-bold">{formatCurrency(retailPrice)}</div>
             </div>
             <div className="text-right">
                <span className="label-industrial">LAST EDIT</span>
                <div className="text-muted" style={{fontSize: '0.75rem'}}>{formatDate(updated_at)}</div>
             </div>
          </div>
          
          {!readOnly && (
            <div className="flex-end mt-20">
              <button 
                className="btn-icon-hover" 
                onClick={(e) => { e.stopPropagation(); onDelete(e); }}
                title="Declassify File"
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