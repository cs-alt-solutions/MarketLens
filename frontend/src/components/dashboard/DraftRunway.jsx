/* src/components/dashboard/DraftRunway.jsx */
import React from 'react';
import './DashboardWidgets.css';
import { DASHBOARD_STRINGS } from '../../utils/glossary';

export default function DraftRunway({ drafts = [] }) {
  
  if (drafts.length === 0) {
    return (
      <div className="panel-industrial">
        <div className="panel-header">
          <span className="label-industrial no-margin text-cyan">{DASHBOARD_STRINGS.draftRunway}</span>
        </div>
        <div className="panel-content text-muted italic p-20 text-center">
          No active R&D projects. Click "NEW PROJECT" to start designing.
        </div>
      </div>
    );
  }

  return (
    <div className="panel-industrial">
      <div className="panel-header">
        <span className="label-industrial no-margin text-cyan">{DASHBOARD_STRINGS.draftRunway}</span>
      </div>
      <div className="panel-content flex-col gap-15">
        
        {drafts.slice(0, 3).map((draft, idx) => {
          // Dynamic Gamification Logic
          const hasRecipe = draft.recipe && draft.recipe.length > 0;
          const hasPrice = draft.retailPrice && draft.retailPrice > 0;
          const isReady = hasRecipe && hasPrice;

          return (
            <div key={draft.id || idx} className={`p-15 border-subtle border-radius-4 ${idx % 2 === 0 ? 'bg-row-odd' : 'bg-row-even'}`}>
              <div className="font-bold text-main">{draft.title} <span className="text-muted font-normal">(ID: {draft.id ? draft.id.substring(0,4).toUpperCase() : 'NEW'})</span></div>
              <div className="pipeline-track">
                 <div className="pipeline-node active glow-purple text-purple border-purple">IDEA</div>
                 
                 <div className={`pipeline-line ${hasRecipe ? 'active' : 'inactive'}`}></div>
                 <div className={`pipeline-node ${hasRecipe ? 'active' : 'inactive text-muted'}`}>SOP</div>
                 
                 <div className={`pipeline-line ${hasPrice ? 'active' : 'inactive'}`}></div>
                 <div className={`pipeline-node ${hasPrice ? 'active' : 'inactive text-muted'}`}>PRICE</div>
                 
                 <div className={`pipeline-line ${isReady ? 'active' : 'inactive'}`}></div>
                 <div className={`pipeline-node ${isReady ? 'active' : 'inactive text-muted'}`}>READY</div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}