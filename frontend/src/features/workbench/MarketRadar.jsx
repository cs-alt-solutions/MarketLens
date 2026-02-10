import React, { useState, useEffect } from 'react';
import './ConsoleLayout.css'; // Inherits grid layouts

// --- SUB-COMPONENT: PERFORMANCE DIAL ---
const PerformanceDial = ({ label, value, subtext, color, percent }) => {
  const radius = 45; // Slightly smaller to fit better
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const progressOffset = circumference - (percent / 100) * circumference;
    const timer = setTimeout(() => setOffset(progressOffset), 100);
    return () => clearTimeout(timer);
  }, [percent, circumference]);

  return (
    <div style={{flex:1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
       <div style={{position: 'relative', width: '100px', height: '100px', marginBottom: '8px'}}>
         <svg style={{width:'100%', height:'100%', transform:'rotate(-90deg)'}}>
           <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
           <circle 
             cx="50" cy="50" r={radius} 
             fill="none"
             style={{ 
               strokeDasharray: circumference, 
               strokeDashoffset: offset, 
               stroke: `var(--${color})`, 
               strokeWidth: 6, 
               transition: 'stroke-dashoffset 1s ease' 
             }}
           />
         </svg>
         <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
           <span style={{color: `var(--${color})`, fontSize: '1.2rem', fontWeight: 800, textShadow: `0 0 10px var(--${color})`}}>
             {value}
           </span>
         </div>
       </div>
       <div className="label-industrial" style={{marginBottom:'2px'}}>{label}</div>
       <div style={{fontSize:'0.75rem', color:'var(--text-main)', opacity: 0.8}}>{subtext}</div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export const MarketRadar = () => {
  const sections = {
    viral: { title: "TRENDING NOW", color: 'neon-teal', data: [
      { id: 'tm1', name: "Pet Architecture", growth: "+210%", score: 98, vol: "18k", status: "HOT", desc: "Modern furniture for pets." },
      { id: 'tm2', name: "Gothic Home Decor", growth: "+125%", score: 85, vol: "45k", status: "STEADY", desc: "Dark aesthetic pieces." },
    ]},
    main: { title: "STEADY WINNERS", color: 'neon-blue', data: [
      { id: 'ht1', name: "Digital Planners", growth: "-12%", score: 30, vol: "120k", status: "CROWDED", desc: "Productivity templates." },
      { id: 'ht2', name: "Event Invitations", growth: "+22%", score: 55, vol: "85k", status: "SOLID", desc: "Wedding and corporate." }
    ]},
  };

  return (
    <div className="radar-grid-layout">
      <div className="radar-scroll-area">
        
        {/* HEADER */}
        <div className="inventory-header">
           <div>
             <h2 className="header-title">MARKET PULSE</h2>
             <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>GLOBAL INTELLIGENCE</span>
           </div>
        </div>

        {/* TOP STATS */}
        <div className="cockpit-grid">
          <div className="timeframe-tag">LIVE STATS</div>
          <PerformanceDial label="Biggest Jump" value="+210%" subtext="Pet Arch." color="neon-teal" percent={100} />
          <PerformanceDial label="High Volume" value="120k" subtext="Dig. Planners" color="neon-blue" percent={85} />
          <PerformanceDial label="Shopper Mood" value="HIGH" subtext="Q4 Rush" color="neon-cyan" percent={95} />
          <PerformanceDial label="New Trend" value="FOUND" subtext="Mushrooms" color="neon-orange" percent={40} />
        </div>

        {/* SECTIONS */}
        {Object.entries(sections).map(([key, config]) => (
          <React.Fragment key={key}>
            <div className="flex-between" style={{marginBottom:'15px', marginTop:'30px', borderBottom:'1px solid var(--border-subtle)', paddingBottom:'10px'}}>
              <h3 style={{fontSize:'1rem', margin:0}}><span style={{color:`var(--${config.color})`}}>●</span> {config.title}</h3>
            </div>
            
            <div className="ops-grid">
              {config.data.map(sector => (
                <div key={sector.id} className="panel-industrial" style={{minHeight:'200px'}}>
                  <div className="panel-content">
                     <div className="flex-between" style={{marginBottom:'10px'}}>
                       <h3 style={{margin:0, fontSize:'1rem'}}>{sector.name}</h3>
                       <span className="label-industrial" style={{color:`var(--${config.color})`}}>{sector.status}</span>
                     </div>
                     
                     <div style={{fontFamily:'Inter, monospace', fontSize:'2rem', fontWeight:800, color:`var(--${config.color})`, letterSpacing:'-1px', marginBottom:'10px', textShadow:`0 0 15px var(--${config.color})`}}>
                       {sector.growth}
                     </div>
                     
                     <p style={{fontSize:'0.85rem', color:'var(--text-muted)', lineHeight:'1.4'}}>
                       {sector.desc}
                     </p>
                  </div>
                  
                  {/* Card Footer */}
                  <div style={{padding:'10px 20px', background:'rgba(255,255,255,0.02)', borderTop:'1px solid var(--border-subtle)'}}>
                     <div className="flex-between">
                        <span className="label-industrial" style={{margin:0}}>VOLUME</span>
                        <span style={{fontWeight:700}}>{sector.vol}</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
      
      {/* Right sidebar is handled by ConsoleLayout if you want the ticker there, otherwise empty or widgets */}
    </div>
  );
};