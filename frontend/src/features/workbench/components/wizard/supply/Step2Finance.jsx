/* src/features/workbench/components/wizard/supply/Step2Finance.jsx */
import React from 'react';
import { formatCurrency } from '../../../../../utils/formatters';

export const Step2Finance = ({ localSupply, handleUpdate }) => {
  const unitPrice = (localSupply.totalCost > 0 && localSupply.unitsReceived > 0) 
      ? (localSupply.totalCost / localSupply.unitsReceived) 
      : 0;

  return (
    <div className="flex-col h-full animate-fade-in w-full flex-center">
      <div className="text-center mb-40">
        <h2 className="text-neon-orange font-mono tracking-widest mb-10">FINANCIAL CALIBRATION</h2>
        <p className="text-muted">What was the final damage on the receipt?</p>
      </div>

      <div className="max-w-500 w-full flex-col gap-25">
        
        {/* BIG NUMBERS ONLY */}
        <div className="flex gap-20">
          <div className="flex-col gap-10 flex-1">
            <label className="font-bold text-muted font-small text-center">TOTAL COST</label>
            <input 
              type="number" 
              className="input-industrial font-large text-center py-20 text-neon-orange"
              style={{ fontSize: '2rem' }}
              placeholder="$0.00"
              value={localSupply.totalCost || ''}
              onChange={(e) => handleUpdate('totalCost', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="flex-col gap-10 flex-1">
            <label className="font-bold text-muted font-small text-center">TOTAL ITEMS/LBS</label>
            <input 
              type="number" 
              className="input-industrial font-large text-center py-20"
              style={{ fontSize: '2rem' }}
              placeholder="0"
              value={localSupply.unitsReceived || ''}
              onChange={(e) => handleUpdate('unitsReceived', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* 🚀 THE "GIVE ME THE ANSWER" BANNER */}
        <div className="bg-panel p-30 border-radius-2 border-subtle text-center shadow-glow">
            <span className="font-bold text-muted font-small tracking-widest block mb-10">YOUR TRUE COST PER UNIT</span>
            <div className="font-mono text-neon-teal" style={{ fontSize: '3rem', fontWeight: '800' }}>
               {formatCurrency(unitPrice)}
            </div>
        </div>
      </div>
    </div>
  );
};