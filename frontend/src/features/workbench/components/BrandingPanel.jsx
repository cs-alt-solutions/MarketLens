/* src/features/workbench/components/BrandingPanel.jsx */
import React from 'react';
import { TERMINOLOGY } from '../../../utils/glossary';
import { formatCurrency } from '../../../utils/formatters';
import { Finance } from '../../../components/Icons';

export const BrandingPanel = ({ 
  localProject, 
  handleUpdate, 
  materialCost, 
  platformFees, 
  netProfit, 
  marginPercent 
}) => {
  return (
    <div className="phase-grid">
      <div className="phase-col">
        <div className="blueprint-card">
          <div className="blueprint-card-title"><Finance /> {TERMINOLOGY.BLUEPRINT.PROFIT_SIMULATOR}</div>
          <div className="lab-form-group mt-20">
            <label className="label-industrial">{TERMINOLOGY.BLUEPRINT.RETAIL}</label>
            <input 
              type="number" className="input-industrial retail-price-input" 
              value={localProject.retailPrice}
              onChange={e => handleUpdate('retailPrice', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="profit-breakdown">
            <div className="calc-row">
              <span>{TERMINOLOGY.BLUEPRINT.RAW_MATERIALS}</span> 
              <span className="text-muted">{formatCurrency(materialCost)}</span>
            </div>
            <div className="calc-row">
              <span>{TERMINOLOGY.BLUEPRINT.PLATFORM_FEES}</span> 
              <span className="text-warning">-{formatCurrency(platformFees)}</span>
            </div>
            <div className="calc-row final">
              <span>{TERMINOLOGY.BLUEPRINT.PROFIT}</span> 
              <span className="text-good">{formatCurrency(netProfit)}</span>
            </div>
            <div className="text-right font-small text-muted mt-10">
              {TERMINOLOGY.BLUEPRINT.MARGIN}: {marginPercent.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
      <div className="phase-col">
        <div className="blueprint-card">
          <div className="blueprint-card-title">{TERMINOLOGY.WORKSHOP.BRAND_SPECS}</div>
          <div className="mt-20 flex-col gap-15">
            <div className="flex-between gap-10">
              <div className="w-full">
                <label className="label-industrial">{TERMINOLOGY.WORKSHOP.LABEL_SIZE}</label>
                <input className="input-industrial" value={localProject.brand_specs.label_size} onChange={e => handleUpdate('brand_specs', e.target.value, 'label_size')} placeholder="e.g. 2x3 Rectangle" />
              </div>
              <div className="w-full">
                <label className="label-industrial">{TERMINOLOGY.WORKSHOP.HEX_COLOR}</label>
                <div className="flex-center gap-10">
                  <input type="color" value={localProject.brand_specs.hex_code} onChange={e => handleUpdate('brand_specs', e.target.value, 'hex_code')} />
                  <input className="input-industrial font-mono" value={localProject.brand_specs.hex_code} onChange={e => handleUpdate('brand_specs', e.target.value, 'hex_code')} />
                </div>
              </div>
            </div>
            <div>
              <label className="label-industrial">{TERMINOLOGY.WORKSHOP.PRIMARY_FONT}</label>
              <input className="input-industrial" value={localProject.brand_specs.font_main} onChange={e => handleUpdate('brand_specs', e.target.value, 'font_main')} placeholder="e.g. Montserrat Bold" />
            </div>
            <div>
              <label className="label-industrial">{TERMINOLOGY.WORKSHOP.MAKER_NOTES}</label>
              <textarea className="input-industrial" value={localProject.brand_specs.notes} onChange={e => handleUpdate('brand_specs', e.target.value, 'notes')} placeholder="Special packaging..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};