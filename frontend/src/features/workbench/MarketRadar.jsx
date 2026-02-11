/* src/features/workbench/MarketRadar.jsx */
import React, { useState } from 'react';
import './MarketRadar.css';
import { InputGroup } from '../../components/InputGroup';
import { ImagePlaceholder } from '../../components/ImagePlaceholder';
import { TERMINOLOGY } from '../../utils/glossary'; // NEW

export const MarketRadar = () => {
  const [competitors, setCompetitors] = useState([
    { id: 1, name: 'Brand X', price: 45.00, url: '', notes: 'Mass market quality' },
    { id: 2, name: 'Artisan Co', price: 85.00, url: '', notes: 'Direct competitor' }
  ]);

  const [newComp, setNewComp] = useState({ name: '', price: '' });

  const addCompetitor = (e) => {
    e.preventDefault();
    if (!newComp.name) return;
    setCompetitors([...competitors, { id: Date.now(), ...newComp, price: parseFloat(newComp.price) || 0 }]);
    setNewComp({ name: '', price: '' });
  };

  return (
    <div className="radar-grid-layout">
       <div className="radar-scanner" /> {/* FIXED: Animation scanner restored */}
       <div className="radar-scroll-area">
          <div className="inventory-header">
             <div>
               <h2 className="header-title">{TERMINOLOGY.MARKET.HEADER}</h2>
               <span className="header-subtitle">{TERMINOLOGY.MARKET.SUBTITLE}</span>
             </div>
          </div>

          <div className="workshop-grid">
             {/* ADD NEW CARD */}
             <div className="panel-industrial" style={{ padding: '20px', borderStyle: 'dashed' }}>
                <h3 className="label-industrial text-accent">TRACK NEW TARGET</h3>
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
                   <button type="submit" className="btn-primary w-full mt-20">TRACK TARGET</button>
                </form>
             </div>

             {/* EXISTING CARDS */}
             {competitors.map(c => (
                <div key={c.id} className="panel-industrial">
                   <div style={{ height: '120px', overflow: 'hidden', borderBottom: '1px solid var(--border-subtle)' }}>
                      <ImagePlaceholder height="100%" label="PRODUCT IMAGE" />
                   </div>
                   <div className="pad-20">
                      <div className="flex-between mb-20">
                         <span className="font-bold">{c.name}</span>
                         <span className="text-accent font-mono">${c.price.toFixed(2)}</span>
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
                         {c.notes || "No observations recorded."}
                      </div>
                      <div className="mt-20 flex-end">
                         <button className="btn-ghost">ANALYZE</button>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* SIDEBAR ANALYTICS */}
       <div className="sidebar-col pad-20">
          <div className="keyword-header">
             <h3 className="label-industrial glow-purple">{TERMINOLOGY.MARKET.PULSE_HEADER}</h3>
          </div>
          <div className="panel-industrial pad-20 mt-20">
             <div className="label-industrial">AVG MARKET PRICE</div>
             <div className="text-accent" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                ${(competitors.reduce((acc, c) => acc + c.price, 0) / competitors.length || 0).toFixed(2)}
             </div>
          </div>
       </div>
    </div>
  );
};