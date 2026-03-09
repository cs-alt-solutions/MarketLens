/* src/features/workbench/components/wizard/Step1Identity.jsx */
import React from 'react';
import { TERMINOLOGY } from '../../../../utils/glossary';

export const Step1Identity = ({ localProject, handleUpdate }) => (
  <div className="flex-col flex-center h-full animate-fade-in text-center max-w-600">
    <h2 className="text-neon-teal mb-30 wizard-title-large">{TERMINOLOGY.WIZARD.TITLE}</h2>
    <label className="text-muted font-bold tracking-wide font-small mb-10 display-block">
        {TERMINOLOGY.BLUEPRINT.REQ_TITLE}
    </label>
    <input 
      className="input-chromeless font-bold text-center w-full mb-30 p-10 wizard-input-huge"
      placeholder="e.g. Lavender Soy Candle"
      value={localProject.title || ''}
      onChange={(e) => handleUpdate('title', e.target.value)}
      autoFocus
    />
    <p className="text-muted mt-20 font-large">{TERMINOLOGY.WIZARD.SUBTITLE}</p>
  </div>
);