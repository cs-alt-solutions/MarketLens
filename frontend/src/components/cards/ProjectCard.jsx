/* src/components/cards/ProjectCard.jsx */
import React from 'react';
import './ProjectCard.css';
import { formatCurrency } from '../../utils/formatters';
import { APP_CONFIG, TERMINOLOGY } from '../../utils/glossary';
import { WorkshopIcon, Box, Finance } from '../Icons';

export const ProjectCard = ({ project, onClick }) => {
  // 1. Safely extract our new nested data structures
  const recipe = project.recipe || [];
  const economics = project.economics || {};
  
  // 2. Separate Core Materials from Packaging using our Single Source of Truth
  const logisticsKeywords = APP_CONFIG.INVENTORY.LOGISTICS;
  
  const packagingItems = recipe.filter(item => 
    logisticsKeywords.some(keyword => item.name.toLowerCase().includes(keyword.toLowerCase()))
  );
  const coreItems = recipe.filter(item => 
    !logisticsKeywords.some(keyword => item.name.toLowerCase().includes(keyword.toLowerCase()))
  );

  // 3. Fallback math in case the engine is still syncing
  const retail = project.retailPrice || economics.targetRetail || 0;
  const fees = economics.platformFees || (retail * 0.10); // Standard 10% fee assumption
  const margin = economics.marginPercent || 0;

  return (
    <div className="project-card bg-panel border-radius-2 border-subtle p-20 flex-col transition-hover clickable" onClick={onClick}>
      
      {/* HEADER: Title & Status */}
      <div className="flex-between mb-15 border-bottom-subtle pb-10">
        <h3 className="m-0 font-large text-main">{project.title}</h3>
        <span className={`status-badge status-${project.status}`}>
          {TERMINOLOGY.STATUS[project.status.toUpperCase()] || project.status}
        </span>
      </div>

      {/* BODY: The Bill of Materials (BOM) */}
      <div className="flex-col gap-10 mb-20 flex-1">
        <div className="flex-between text-small">
          <span className="text-muted flex-center gap-5"><WorkshopIcon /> Core Materials:</span>
          <span className="font-bold text-main">{coreItems.length > 0 ? coreItems.length : 'None'}</span>
        </div>
        <div className="flex-between text-small">
          <span className="text-muted flex-center gap-5"><Box /> Packaging & Shipping:</span>
          <span className="font-bold text-main">{packagingItems.length > 0 ? packagingItems.length : 'None'}</span>
        </div>
        
        {/* Prototype Warning Flag */}
        {recipe.some(r => r.isPrototype) && (
          <div className="bg-app text-warning text-tiny font-mono p-5 text-center border-radius-1 mt-5 border-warning">
            ⚠ CONTAINS UNVERIFIED PROTOTYPE MATERIALS
          </div>
        )}
      </div>

      {/* FOOTER: Agentic Economics */}
      <div className="bg-app p-15 border-radius-2 border-subtle">
        <div className="flex-between mb-5">
          <span className="text-muted text-tiny tracking-wide">{TERMINOLOGY.BLUEPRINT.RETAIL}</span>
          <span className="font-bold">{formatCurrency(retail)}</span>
        </div>
        <div className="flex-between mb-5">
          <span className="text-muted text-tiny tracking-wide">{TERMINOLOGY.BLUEPRINT.PLATFORM_FEES}</span>
          <span className="text-alert">-{formatCurrency(fees)}</span>
        </div>
        <div className="flex-between border-top-subtle pt-5 mt-5">
          <span className="text-neon-teal font-small font-bold flex-center gap-5"><Finance /> {TERMINOLOGY.FINANCE.NET}</span>
          <div className="text-right">
            <span className="text-neon-teal font-bold display-block">{formatCurrency(economics.netProfit || 0)}</span>
            <span className="text-neon-teal text-tiny">{margin.toFixed(1)}% MARGIN</span>
          </div>
        </div>
      </div>
      
    </div>
  );
};