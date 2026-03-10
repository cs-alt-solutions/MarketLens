/* src/components/cards/ProjectCard.jsx */
import React from 'react';
import './ProjectCard.css';
import { formatCurrency } from '../../utils/formatters';
import { APP_CONFIG, TERMINOLOGY } from '../../utils/glossary';

export const ProjectCard = ({ project, onClick, layout = 'default' }) => {
  const recipe = project.recipe || [];
  const economics = project.economics || {};
  
  const logisticsKeywords = APP_CONFIG.INVENTORY.LOGISTICS;
  
  const packagingItems = recipe.filter(item => 
    logisticsKeywords.some(keyword => item.name.toLowerCase().includes(keyword.toLowerCase()))
  );
  const coreItems = recipe.filter(item => 
    !logisticsKeywords.some(keyword => item.name.toLowerCase().includes(keyword.toLowerCase()))
  );

  const retail = project.retailPrice || economics.targetRetail || 0;
  const margin = economics.marginPercent || 0;
  const netProfit = economics.netProfit || 0;

  const rawStatus = project.status?.toLowerCase() || 'draft';
  const statusClass = `status-${rawStatus === 'in progress' ? 'active' : rawStatus}`;
  const layoutClass = layout === 'pipeline' ? 'layout-pipeline' : '';

  return (
    <div className={`project-card-container ${statusClass} ${layoutClass}`} onClick={onClick}>
      
      <div className="project-card-header">
        <h3 className="project-title">{project.title || 'Untitled Project'}</h3>
        {/* 🚀 REMOVED the 'X' delete button from here */}
      </div>

      <div className="project-card-body">
        <div className="project-metrics">
          <div className="metric-item">
            <span className="metric-label">Core Materials</span>
            <span className="metric-value text-main">{coreItems.length}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Packaging</span>
            <span className="metric-value text-main">{packagingItems.length}</span>
          </div>
          {layout !== 'pipeline' && (
            <div className="metric-item">
              <span className="metric-label">Target Retail</span>
              <span className="metric-value text-neon-teal">{formatCurrency(retail)}</span>
            </div>
          )}
        </div>
      </div>

      {recipe.some(r => r.isPrototype) && (
        <div className="bg-alert-faint text-alert text-tiny font-mono p-5 text-center border-radius-2 mb-10 border-alert">
          ⚠ UNVERIFIED PROTOTYPES
        </div>
      )}
      
      <div className="project-footer">
        <span className={`status-badge ${statusClass}`}>
          {TERMINOLOGY.STATUS[project.status?.toUpperCase()] || project.status || 'DRAFT'}
        </span>
        <div className="text-right">
          <span className="text-neon-teal font-bold font-large block">{formatCurrency(netProfit)} NET</span>
          <span className="text-muted text-tiny block">{margin.toFixed(1)}% MARGIN</span>
        </div>
      </div>
      
    </div>
  );
};