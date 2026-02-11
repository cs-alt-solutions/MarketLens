import React, { useState } from 'react';
import './MarketRadar.css';
import { InputGroup } from '../../components/InputGroup';
import { ImagePlaceholder } from '../../components/ImagePlaceholder';
import { TERMINOLOGY } from '../../utils/glossary';

const Dial = ({ value, label, colorVar }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="dial-wrapper">
      <div className="dial-svg-container">
        <svg className="dial-svg">
          <circle className="dial-bg-circle" cx="40" cy="40" r={radius} />
          <circle 
            className="dial-progress-circle" 
            cx="40" cy="40" r={radius} 
            style={{ strokeDasharray: circumference, strokeDashoffset: offset, stroke: `var(${colorVar})` }}
          />
        </svg>
        <div className="dial-value-text">{value}%</div>
      </div>
      <span className="label-industrial no-margin">{label}</span>
    </div>
  );
};

export const MarketRadar = () => {
  const [competitors, setCompetitors] = useState([
    { id: 1, name: 'Brand X', price: 45.00, notes: 'Mass market quality' },
    { id: 2, name: 'Artisan Co', price: 85.00, notes: 'Direct competitor' }
  ]);

  const [newComp, setNewComp] = useState({ name: '', price: '' });

  const addCompetitor = (e) => {
    e.preventDefault();
    if (!newComp.name) return;
    setCompetitors([...competitors, { id: Date.now(), ...newComp, price: parseFloat(newComp.price) || 0 }]);
    setNewComp({ name: '', price: '' });
  };

  const avgPrice = competitors.reduce((acc, c) => acc + c.price, 0) / competitors.length || 0;

  return (
    <div className="radar-grid-layout">
       <div className="radar-scanner" />
       <div className="radar-scroll-area">
          <div className="inventory-header">
             <div>
               <h2 className="header-title">{TERMINOLOGY.MARKET.HEADER}</h2>
               <span className="header-subtitle">{TERMINOLOGY.MARKET.SUBTITLE}</span>
             </div>
          </div>

          <div className="ticker-container">
             <div className="ticker-wrap">
                <div className="ticker-move">
                   {[1,2,3,4].map(i => (
                     <span key={i} className="ticker-item">{TERMINOLOGY.MARKET.SCANNING} | LIVE MARKET DATA ACTIVE | SYNCING PROTOCOLS...</span>
                   ))}
                </div>
             </div>
          </div>

          <div className="workshop-grid mt-20">
             <div className="panel-industrial pad-20 border-dashed">
                <h3 className="label-industrial text-accent">{TERMINOLOGY.MARKET.TARGET}</h3>
                <form onSubmit={addCompetitor}>
                   <InputGroup 
                      label="Competitor Name"
                      value={newComp.name}
                      onChange={e => setNewComp({...newComp, name: e.target.value})}
                      placeholder="e.g. NorthFace"
                   />
                   <InputGroup 
                      label="Their Price"
                      type="number"
                      prefix="$"
                      value={newComp.price}
                      onChange={e => setNewComp({...newComp, price: e.target.value})}
                      placeholder="0.00"
                   />
                   <button type="submit" className="btn-primary w-full mt-20">{TERMINOLOGY.MARKET.TARGET}</button>
                </form>
             </div>

             {competitors.map(c => (
                <div key={c.id} className="panel-industrial">
                   <div className="h-120 overflow-hidden border-bottom-subtle">
                      <ImagePlaceholder height="100%" label="PRODUCT IMAGE" />
                   </div>
                   <div className="pad-20">
                      <div className="flex-between mb-20">
                         <span className="font-bold">{c.name}</span>
                         <span className="text-accent font-mono">${c.price.toFixed(2)}</span>
                      </div>
                      <div className="text-muted font-italic font-small">
                         {c.notes || "No observations recorded."}
                      </div>
                      <div className="mt-20 flex-end">
                         <button className="btn-ghost">{TERMINOLOGY.GENERAL.ANALYZE}</button>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>

       <div className="sidebar-col pad-20">
          <div className="keyword-header no-pad mb-20 bg-transparent">
             <h3 className="label-industrial glow-purple">{TERMINOLOGY.MARKET.PULSE_HEADER}</h3>
          </div>
          
          <div className="panel-industrial pad-20">
             <div className="label-industrial">{TERMINOLOGY.MARKET.AVG_PRICE}</div>
             <div className="text-accent font-large font-bold">
                ${avgPrice.toFixed(2)}
             </div>
          </div>

          <div className="performance-dials mt-20">
             <Dial value={78} label="DEMAND" colorVar="--neon-teal" />
             <Dial value={42} label="SATURATION" colorVar="--neon-purple" />
          </div>
       </div>
    </div>
  );
};