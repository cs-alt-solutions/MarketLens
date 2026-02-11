import React, { useState, useEffect } from 'react';
import { useWorkbench } from '../../context/WorkbenchContext';
import './MarketRadar.css'; 

// --- NEW COMPONENT: LIVE TICKER ---
const NewsTicker = () => {
  return (
    <div style={{
      marginTop: '20px', 
      background: 'rgba(34, 211, 238, 0.05)', 
      borderTop: '1px solid var(--neon-cyan)', 
      borderBottom: '1px solid var(--neon-cyan)',
      height: '30px',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="ticker-wrap">
        <div className="ticker-move">
          <span className="ticker-item">:: MARKET UPDATE :: RESIN PRICES UP 4% :: WALNUT WOOD SCARCITY DETECTED :: NEW TREND "CYBER-PLANTS" EMERGING :: SHIPPING DELAYS IN SECTOR 7 ::</span>
          <span className="ticker-item">:: MARKET UPDATE :: RESIN PRICES UP 4% :: WALNUT WOOD SCARCITY DETECTED :: NEW TREND "CYBER-PLANTS" EMERGING :: SHIPPING DELAYS IN SECTOR 7 ::</span>
        </div>
      </div>
    </div>
  )
}

const PerformanceDial = ({ label, value, subtext, color, percent }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const progressOffset = circumference - (percent / 100) * circumference;
    const timer = setTimeout(() => setOffset(progressOffset), 100);
    return () => clearTimeout(timer);
  }, [percent, circumference]);

  return (
    <div style={{flex:1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px'}}>
       <div style={{position: 'relative', width: '80px', height: '80px', marginBottom: '8px'}}>
         <svg style={{width:'100%', height:'100%', transform:'rotate(-90deg)'}}>
           <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
           <circle 
             cx="40" cy="40" r={radius} 
             fill="none"
             style={{ 
               strokeDasharray: circumference, 
               strokeDashoffset: offset, 
               stroke: `var(--${color})`, 
               strokeWidth: 5, 
               transition: 'stroke-dashoffset 1s ease' 
             }}
           />
         </svg>
         <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
           <span style={{color: `var(--${color})`, fontSize: '0.9rem', fontWeight: 800, textShadow: `0 0 10px var(--${color})`}}>
             {value}
           </span>
         </div>
       </div>
       <div className="label-industrial" style={{marginBottom:'2px', fontSize:'0.6rem'}}>{label}</div>
       <div style={{fontSize:'0.65rem', color:'var(--text-muted)'}}>{subtext}</div>
    </div>
  );
};

export const MarketRadar = () => {
  const { projects } = useWorkbench(); 

  const completedProjects = projects.filter(p => p.status === 'completed');
  const activeProjects = projects.filter(p => p.status === 'active');
  
  const completionRate = projects.length > 0 
    ? Math.round((completedProjects.length / projects.length) * 100) 
    : 0;

  const sections = {
    viral: { title: "VIRAL VECTORS", color: 'neon-teal', data: [
      { id: 'tm1', name: "Pet Architecture", growth: "+210%", score: 98, desc: "Modern furniture for pets." },
      { id: 'tm2', name: "Gothic Home Decor", growth: "+125%", score: 85, desc: "Dark aesthetic pieces." },
    ]}
  };

  return (
    <div className="radar-grid-layout">
      {/* LEFT COLUMN: MARKET PULSE */}
      <div className="radar-scroll-area">
        
        <div className="inventory-header" style={{marginBottom: '20px', position: 'relative'}}>
           {/* SCANNER ANIMATION */}
           <div className="radar-scanner" style={{top: '-20px', right: '0px'}}></div>
           
           <div style={{zIndex: 1}}>
             <h2 className="header-title">MARKET PULSE</h2>
             <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>INTELLIGENCE CENTER</span>
           </div>
           <div className="label-industrial" style={{color:'var(--neon-teal)', border:'1px solid var(--neon-teal)', padding:'4px 8px', borderRadius:'2px', zIndex: 1}}>
              LIVE FEED :: ACTIVE
           </div>
        </div>

        <div className="animate-fade-in">
             <div className="flex-between" style={{marginBottom:'15px', borderBottom:'1px solid var(--border-subtle)', paddingBottom:'10px'}}>
                <h3 style={{fontSize:'0.9rem', margin:0, letterSpacing:'1px', color:'var(--neon-blue)'}}>GLOBAL SIGNAL</h3>
             </div>

             <div className="panel-industrial" style={{padding:'15px', marginBottom:'20px', display:'flex', justifyContent:'space-between'}}>
                <div style={{textAlign:'center'}}>
                   <div className="animate-pulse" style={{fontSize:'1.1rem', fontWeight:800, color:'var(--neon-teal)'}}>+219%</div>
                   <div className="label-industrial">VELOCITY</div>
                </div>
                <div style={{width:'1px', background:'var(--border-subtle)'}}></div>
                <div style={{textAlign:'center'}}>
                   <div className="animate-pulse" style={{fontSize:'1.1rem', fontWeight:800, color:'var(--neon-blue)'}}>120k</div>
                   <div className="label-industrial">VOLUME</div>
                </div>
                <div style={{width:'1px', background:'var(--border-subtle)'}}></div>
                <div style={{textAlign:'center'}}>
                   <div className="animate-pulse" style={{fontSize:'1.1rem', fontWeight:800, color:'var(--neon-orange)'}}>HIGH</div>
                   <div className="label-industrial">MOOD</div>
                </div>
             </div>

             {Object.entries(sections).map(([key, config]) => (
              <React.Fragment key={key}>
                <div className="label-industrial" style={{marginTop:'20px', marginBottom:'10px', color: `var(--${config.color})`}}>
                  ● {config.title}
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  {config.data.map(sector => (
                    <div key={sector.id} className="panel-industrial hover-glow" style={{minHeight:'auto', borderLeft:`3px solid var(--${config.color})`, cursor:'pointer'}}>
                      <div className="panel-content" style={{padding:'15px'}}>
                         <div className="flex-between">
                           <h3 style={{margin:0, fontSize:'0.95rem'}}>{sector.name}</h3>
                           <span style={{fontSize:'1rem', fontWeight:800, color:`var(--${config.color})`}}>{sector.growth}</span>
                         </div>
                         <p style={{fontSize:'0.75rem', color:'var(--text-muted)', margin:'5px 0 0 0'}}>{sector.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ))}
            
            {/* NEW TICKER */}
            <NewsTicker />
        </div>
      </div>

      {/* RIGHT SIDEBAR: INTERNAL OPS */}
      <div className="sidebar-col" style={{padding:'15px'}}>
            <div className="keyword-header" style={{padding:'0 0 15px 0'}}>
               <h3 className="label-industrial glow-purple" style={{ margin: 0 }}>INTERNAL OPS</h3>
            </div>

            <div className="cockpit-grid" style={{borderColor: 'var(--neon-purple)', background:'rgba(167, 139, 250, 0.02)', gap:'5px', padding:'15px', display:'flex', marginBottom:'20px'}}>
              <PerformanceDial label="ACTIVE" value={activeProjects.length} subtext="Missions" color="neon-teal" percent={50} />
              <PerformanceDial label="READY" value={completedProjects.length} subtext="To Launch" color="neon-purple" percent={completionRate} />
            </div>

            <div className="label-industrial" style={{marginBottom:'10px', color:'var(--neon-purple)'}}>
               ● RECENT COMPLETIONS
            </div>

            <div style={{display:'flex', flexDirection:'column', gap:'10px', flex:1, overflowY:'auto'}}>
               {completedProjects.length === 0 ? (
                 <div style={{color:'var(--text-muted)', fontStyle:'italic', padding:'20px', textAlign:'center', border:'1px dashed var(--border-subtle)'}}>
                    No Data.
                 </div>
               ) : (
                 completedProjects.map(p => (
                   <div key={p.id} className="panel-industrial" style={{minHeight:'auto'}}>
                      <div className="panel-content" style={{padding:'15px'}}>
                        <div className="flex-between">
                            <h3 style={{margin:0, fontSize:'0.95rem'}}>{p.title}</h3>
                            <span className="label-industrial">READY</span>
                        </div>
                        <div style={{display:'flex', gap:'15px', marginTop:'5px'}}>
                            <div className="label-industrial" style={{margin:0}}>DEMAND: <span style={{color:'var(--neon-teal)'}}>{p.demand}</span></div>
                        </div>
                      </div>
                   </div>
                 ))
               )}
            </div>
            
            <div style={{marginTop:'20px'}}>
               <button className="btn-primary" style={{width:'100%', background:'var(--neon-purple)', color:'#fff'}}>
                 GENERATE REPORT
               </button>
            </div>
      </div>

    </div>
  );
};