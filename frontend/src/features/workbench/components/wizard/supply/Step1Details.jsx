/* src/features/workbench/components/wizard/supply/Step1Details.jsx */
import React from 'react';
import { Radar, WorkshopIcon } from '../../../../../components/Icons';

export const Step1Details = ({ localSupply, handleUpdate }) => {
  return (
    <div className="flex-col h-full animate-fade-in w-full flex-center">
      {/* 🚀 THE CONCIERGE PROMPT */}
      <div className="text-center mb-40">
        <h2 className="text-neon-teal font-mono tracking-widest mb-10">INTAKE COMMENCED</h2>
        <p className="text-muted">Just tell me what you bought. I'll handle the filing.</p>
      </div>

      <div className="max-w-600 w-full bg-panel p-40 border-radius-2 border-subtle relative shadow-glow">
        <div className="absolute top-0 left-0 w-full h-2 bg-neon-teal"></div>
        
        {/* BIG, FRIENDLY INPUT */}
        <div className="flex-col gap-15">
          <label className="font-bold text-muted font-small tracking-widest flex-between">
            <span>INPUT MATERIAL OR SCAN</span>
            <span className="text-neon-teal font-mono">READY //</span>
          </label>
          
          <div className="relative">
            <input 
              type="text"
              className="input-industrial font-large w-full text-neon-teal py-20"
              style={{ fontSize: '1.5rem', background: 'rgba(0,0,0,0.2)' }}
              placeholder="e.g. 50lbs of Soy Wax from Uline..."
              value={localSupply.name}
              onChange={(e) => handleUpdate('name', e.target.value)}
              autoFocus
            />
            <button className="absolute right-15 top-50 translate-y-half text-neon-teal btn-icon-hover-clean">
              <WorkshopIcon />
            </button>
          </div>
        </div>

        {/* 🚀 DYNAMIC SMART FEEDBACK (Instead of a boring dropdown) */}
        {localSupply.name && (
          <div className="mt-30 pt-20 border-top-subtle animate-fade-in flex-between align-center">
             <div className="flex-center gap-10">
                <Radar className="text-neon-teal pulse" />
                <span className="font-mono text-small text-muted uppercase">
                  Classifying as: <span className="text-main font-bold">RAW MATERIAL</span>
                </span>
             </div>
             <button className="btn-ghost text-tiny" style={{ padding: '4px 8px' }}>CHANGE</button>
          </div>
        )}
      </div>
      
      <p className="mt-30 text-muted font-small italic">
        "I bought a case of 8oz amber jars" &rarr; <span className="text-neon-teal">Categorized as Packaging</span>
      </p>
    </div>
  );
};