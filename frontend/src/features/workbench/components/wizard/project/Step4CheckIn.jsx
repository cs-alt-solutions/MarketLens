/* src/features/workbench/components/wizard/Step4CheckIn.jsx */
import React from 'react';
import { formatCurrency } from '../../../../../utils/formatters';
import { WorkshopIcon } from '../../../../../components/Icons';
import { TERMINOLOGY } from '../../../../../utils/glossary';

export const Step4CheckIn = ({ localProject, handleUpdate, economics, hasAllCore, hasAllPackaging }) => {
  const { materialCost, platformFees, netProfit, marginPercent } = economics;
  
  const getAssessment = () => {
    const hasProto = localProject.recipe.some(i => i.isPrototype);
    if (!hasAllCore) return { text: "Missing core materials. Recommend: IDEA.", status: "idea" };
    if (!hasAllPackaging) return { text: "Missing shipping supplies. Recommend: DRAFT.", status: "draft" };
    if (hasProto) return { text: "Uses prototype materials. Priority: Order supplies. Recommend: DRAFT.", status: "draft" };
    return { text: "All systems green. Ready for production!", status: "active" };
  };

  const assessment = getAssessment();

  return (
    <div className="flex-col h-full animate-fade-in max-w-800 w-full">
      <div className="bg-panel p-20 border-radius-2 border-subtle mb-30 flex-center gap-20">
        <WorkshopIcon />
        <div className="flex-col">
          <span className="font-bold text-neon-teal tracking-wide mb-5">SYSTEM ASSESSMENT</span>
          <span className="text-muted">{assessment.text}</span>
        </div>
      </div>

      <div className="flex-between gap-30 mb-30">
        <div className="flex-col flex-1">
          <label className="text-muted font-bold tracking-wide font-small mb-10">{TERMINOLOGY.BLUEPRINT.TARGET_RETAIL}</label>
          <input 
            type="number" className="input-chromeless retail-price-input" 
            value={localProject.economics?.targetRetail || ''} 
            onChange={(e) => handleUpdate('economics', parseFloat(e.target.value), 'targetRetail')} 
          />
          
          <div className="profit-cards-container mt-20">
            <div className="profit-card p-10">
                <span className="text-muted font-small tracking-wide">MATERIALS</span>
                <span className="font-bold">-{formatCurrency(materialCost || 0)}</span>
            </div>
            <div className="profit-card p-10">
                <span className="text-muted font-small tracking-wide">FEES</span>
                <span className="font-bold">-{formatCurrency(platformFees || 0)}</span>
            </div>
          </div>

          <div className="final-profit-banner mt-15 p-20">
            <span className="font-bold text-neon-teal">{TERMINOLOGY.FINANCE.NET}</span>
            <div className="text-right">
              <div className="font-bold text-neon-teal profit-total-large">{formatCurrency(netProfit)}</div>
              <div className="text-small text-neon-teal">{marginPercent.toFixed(1)}% {TERMINOLOGY.BLUEPRINT.MARGIN}</div>
            </div>
          </div>
        </div>

        <div className="flex-col flex-1 border-left-subtle pl-30">
          <label className="text-muted font-bold mb-10">AUTHORIZE STATUS</label>
          {['idea', 'draft', 'active'].map(s => (
            <button 
              key={s} 
              className={`btn-ghost mb-10 w-full p-15 ${localProject.status === s ? 'bg-panel text-neon-teal border-subtle font-bold' : ''} ${assessment.status === s ? 'glow-teal' : ''}`}
              onClick={() => handleUpdate('status', s)}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};