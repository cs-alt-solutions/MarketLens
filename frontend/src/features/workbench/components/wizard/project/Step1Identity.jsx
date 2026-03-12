/* src/features/workbench/components/wizard/Step1Identity.jsx */
import React, { useState } from 'react';
import { APP_CONFIG, TERMINOLOGY } from '../../../../../utils/glossary';

export const Step1Identity = ({ localProject, handleUpdate, onNext }) => {
  const getInitialStep = () => {
    if (localProject.title) return 5;
    if (localProject.productFormat) return 4;
    if (localProject.productType) return 3;
    if (localProject.collectionId) return 2;
    return 1;
  };

  const [internalStep, setInternalStep] = useState(getInitialStep());
  const [isCustomSub, setIsCustomSub] = useState(false);
  const [isCustomType, setIsCustomType] = useState(false);
  const [isCustomFormat, setIsCustomFormat] = useState(false); 

  const selectedCollection = APP_CONFIG.COLLECTIONS.find(c => c.id === localProject.collectionId);
  const availableTypes = APP_CONFIG.PRODUCT_TYPES[localProject.subCollection] || [];
  const availableFormats = APP_CONFIG.PRODUCT_FORMATS[localProject.subCollection] || [];

  // 🚀 LIVE MULTI-COLOR TAG PREVIEW ENGINE
  const getPreviewTags = () => {
    const { tags } = APP_CONFIG.generateEnrichment(
        localProject.collectionId, 
        localProject.subCollection, 
        localProject.productType, 
        localProject.productFormat
    );
    return tags; // Structured tag objects {tag, type}
  };

  return (
    <div className="flex-col h-full animate-fade-in w-full pb-10">
      
      {/* HEADER AREA */}
      <div className="flex-between align-start w-full mb-20 border-bottom-subtle pb-15">
        <div className="flex-col flex-1 max-w-500">
          <h2 className="text-neon-teal wizard-title-large text-left">{TERMINOLOGY.WIZARD.TITLE}</h2>
          <p className="text-muted wizard-subtitle text-left">{TERMINOLOGY.WIZARD.SUBTITLE}</p>
        </div>

        {internalStep > 1 && (
            <div className="wizard-tag-panel-compact animate-fade-in flex-col align-end">
               <span className="label-industrial text-muted mb-5 block">AUTO-GENERATED TAGS</span>
               <div className="tag-cloud justify-end">
                   {getPreviewTags().map(({tag, type}) => (
                       <span key={tag} className={`tag-pill tag-${type} animate-fade-in`}>#{tag}</span>
                   ))}
               </div>
            </div>
        )}
      </div>

      <div className="wizard-main-flow">
          
        {/* ✨ PRO-GRADE WORKFLOW BREADCRUMBS */}
        {internalStep > 1 && (
            <div className="flex-start flex-wrap mb-20 animate-fade-in align-center">
              <button className="breadcrumb-link" onClick={() => setInternalStep(1)}>
                  {selectedCollection?.name}
              </button>
              
              {internalStep > 2 && localProject.subCollection && (
                  <>
                    <span className="breadcrumb-arrow">/</span>
                    <button className="breadcrumb-link" onClick={() => setInternalStep(2)}>
                      {localProject.subCollection}
                    </button>
                  </>
              )}
              {internalStep > 3 && localProject.productType && (
                  <>
                    <span className="breadcrumb-arrow">/</span>
                    <button className="breadcrumb-link" onClick={() => setInternalStep(3)}>
                      {localProject.productType}
                    </button>
                  </>
              )}
              {internalStep > 4 && localProject.productFormat && (
                  <>
                    <span className="breadcrumb-arrow">/</span>
                    <button className="breadcrumb-link" onClick={() => setInternalStep(4)}>
                      {localProject.productFormat}
                    </button>
                  </>
              )}
            </div>
        )}

        {/* 🚀 STEP 1: COLLECTION (Launchpad Scale) */}
        {internalStep === 1 && (
          <div className="wizard-form-group animate-fade-in flex-1">
            <label className="label-prompt-large text-center">
                {TERMINOLOGY.WIZARD.PROMPT_MEDIUM}
            </label>
            <div className="step1-choosing-grid animate-fade-in">
              {APP_CONFIG.COLLECTIONS.map(c => (
                <button
                  key={c.id}
                  className={`collection-btn step1-card ${localProject.collectionId === c.id ? 'active' : ''}`}
                  onClick={() => {
                      handleUpdate('collectionId', c.id);
                      handleUpdate('subCollection', ''); 
                      handleUpdate('productType', ''); 
                      handleUpdate('productFormat', ''); 
                      setIsCustomSub(false); setIsCustomType(false); setIsCustomFormat(false);
                      setInternalStep(2); 
                  }}
                >
                  <span className="font-bold block">{c.name}</span>
                  <span className="text-tiny text-muted block mt-5">{c.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: CATEGORY */}
        {internalStep === 2 && selectedCollection && (
          <div className="wizard-form-group animate-fade-in">
            <label className="label-prompt-large text-center">
                {selectedCollection.name.toUpperCase()}? {TERMINOLOGY.WIZARD.PROMPT_SPECIFIC}
            </label>
            <div className="choice-grid">
              {selectedCollection.subCategories.map(sub => (
                <button
                  key={sub}
                  className={`collection-btn choice-card ${localProject.subCollection === sub && !isCustomSub ? 'active' : ''}`}
                  onClick={() => {
                      handleUpdate('subCollection', sub);
                      handleUpdate('productType', '');
                      handleUpdate('productFormat', '');
                      setIsCustomSub(false); setIsCustomType(false); setIsCustomFormat(false);
                      setInternalStep(APP_CONFIG.PRODUCT_TYPES[sub] ? 3 : 4);
                  }}
                >
                  <span className="font-bold block">{sub}</span>
                </button>
              ))}
              <button className={`collection-btn choice-card ${isCustomSub ? 'active' : ''}`} onClick={() => { handleUpdate('subCollection', ''); setIsCustomSub(true); setIsCustomType(true); setIsCustomFormat(true); }}>
                  <span className="font-bold block text-neon-teal">Something Else...</span>
              </button>
            </div>
            {isCustomSub && (
                <div className="mt-15 animate-fade-in flex-center gap-10">
                    <input className="input-industrial flex-1" placeholder="Type your category..." value={localProject.subCollection || ''} onChange={(e) => handleUpdate('subCollection', e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && localProject.subCollection) setInternalStep(3); }} autoFocus />
                    <button className="btn-primary" onClick={() => { if (localProject.subCollection) setInternalStep(3); }}>NEXT</button>
                </div>
            )}
          </div>
        )}

        {/* STEP 3: TYPE */}
        {internalStep === 3 && (
          <div className="wizard-form-group animate-fade-in">
            <label className="label-prompt-large text-center">
                {localProject.subCollection.toUpperCase()}? {TERMINOLOGY.WIZARD.PROMPT_TYPE}
            </label>
            {!isCustomType && availableTypes.length > 0 && (
                <div className="choice-grid">
                  {availableTypes.map(type => (
                    <button key={type} className={`collection-btn choice-card ${localProject.productType === type ? 'active' : ''}`} onClick={() => { handleUpdate('productType', type); setInternalStep(availableFormats.length > 0 ? 4 : 5); }}>
                      <span className="font-bold block">{type}</span>
                    </button>
                  ))}
                  <button className="collection-btn choice-card" onClick={() => setIsCustomType(true)}>
                      <span className="font-bold block text-neon-teal">Something Else...</span>
                  </button>
                </div>
            )}
            {(isCustomType || availableTypes.length === 0) && (
                <div className="mt-10 animate-fade-in flex-center gap-10">
                    <input className="input-industrial flex-1" placeholder="e.g. Hardwood, Soy Wax..." value={localProject.productType || ''} onChange={(e) => handleUpdate('productType', e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && localProject.productType) setInternalStep(4); }} autoFocus />
                    <button className="btn-primary" onClick={() => { if (localProject.productType) setInternalStep(4); }}>NEXT</button>
                </div>
            )}
          </div>
        )}

        {/* STEP 4: FORMAT / SIZE */}
        {internalStep === 4 && (
          <div className="wizard-form-group animate-fade-in">
            <label className="label-prompt-large text-center">
                {TERMINOLOGY.WIZARD.PROMPT_FORMAT}
            </label>
            {!isCustomFormat && availableFormats.length > 0 && (
                <div className="choice-grid">
                  {availableFormats.map(format => (
                    <button key={format} className={`collection-btn choice-card ${localProject.productFormat === format ? 'active' : ''}`} onClick={() => { handleUpdate('productFormat', format); setInternalStep(5); }}>
                      <span className="font-bold block">{format}</span>
                    </button>
                  ))}
                  <button className="collection-btn choice-card" onClick={() => setIsCustomFormat(true)}>
                      <span className="font-bold block text-neon-teal">Something Else...</span>
                  </button>
                </div>
            )}
            {(isCustomFormat || availableFormats.length === 0) && (
                <div className="mt-10 animate-fade-in flex-center gap-10">
                    <input className="input-industrial flex-1" placeholder="e.g. 8oz Jar, XL Size..." value={localProject.productFormat || ''} onChange={(e) => handleUpdate('productFormat', e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && localProject.productFormat) setInternalStep(5); }} autoFocus />
                    <button className="btn-primary" onClick={() => { if (localProject.productFormat) setInternalStep(5); }}>NEXT</button>
                </div>
            )}
          </div>
        )}

        {/* ✨ STEP 5: HERO NAMING */}
        {internalStep === 5 && (
          <div className="naming-stage">
            <div className="wizard-form-group w-full flex-col align-center">
              <label className="label-prompt-large text-center block">
                  {TERMINOLOGY.WIZARD.PROMPT_NAME}
              </label>
              
              <div className="naming-input-wrapper">
                <input
                  className="input-naming"
                  placeholder={`e.g. ${localProject.productFormat || ''} ${localProject.productType || ''} ${localProject.subCollection || 'Project'}`}
                  value={localProject.title || ''}
                  onChange={(e) => handleUpdate('title', e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && localProject.title) onNext(); }}
                  autoFocus
                />
              </div>

              <span className="text-muted text-tiny text-center block mt-20 opacity-70">
                  Press 'Enter' when you're ready to hit the workbench.
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};