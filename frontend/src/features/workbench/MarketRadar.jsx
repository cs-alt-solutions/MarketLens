import React, { useState, useEffect } from 'react';
import './ConsoleLayout.css';
import './MissionModal.css';

// --- SUB-COMPONENT: PERFORMANCE DIAL ---
const PerformanceDial = ({ label, value, subtext, color, percent, onClick }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const progressOffset = circumference - (percent / 100) * circumference;
    const timer = setTimeout(() => setOffset(progressOffset), 100);
    return () => clearTimeout(timer);
  }, [percent, circumference]);

  return (
    <div className="cockpit-dial-wrapper" onClick={onClick}>
       <svg className="dial-svg" viewBox="0 0 120 120">
         <circle className="dial-bg" cx="60" cy="60" r={radius} />
         <circle 
           className="dial-progress" 
           cx="60" cy="60" r={radius} 
           style={{ strokeDasharray: circumference, strokeDashoffset: offset, stroke: `var(--${color})` }}
         />
       </svg>
       <div className="dial-center-content">
          <div className="dial-value" style={{color: `var(--${color})`}}>{value}</div>
       </div>
       <div className="dial-label">{label}</div>
       <div style={{fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'4px'}}>{subtext}</div>
    </div>
  );
};

// --- SUB-COMPONENT: GROWTH RADAR ---
const GrowthRadar = ({ color, percent }) => (
  <svg width="40" height="40" viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="15" fill="none" stroke="var(--bg-hover)" strokeWidth="3" />
    <circle cx="20" cy="20" r="15" fill="none" stroke={`var(--${color})`} strokeWidth="3" 
            strokeDasharray={`${2 * Math.PI * 15}`} 
            strokeDashoffset={`${(2 * Math.PI * 15) * (1 - percent/100)}`} 
            transform="rotate(-90 20 20)" />
  </svg>
);

// --- SUB-COMPONENT: TREND TIMELINE ---
const TrendTimeline = ({ color }) => (
  <div style={{ 
    background: 'rgba(0,0,0,0.3)', 
    padding: '20px', 
    borderRadius: '8px', 
    border: '1px solid var(--border-subtle)',
    marginBottom: '30px'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Volume over the last 90 days</span>
      <span className="uplink-badge" style={{ color: `var(--${color})`, borderColor: `var(--${color})` }}>Historical Trend</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100px' }}>
      {[40, 60, 45, 80, 95, 70, 85, 100, 90, 110, 130, 120, 150].map((h, i) => (
        <div 
          key={i} 
          style={{ 
            flex: 1, 
            height: `${(h / 150) * 100}%`, 
            background: i === 12 ? `var(--${color})` : 'rgba(255,255,255,0.1)',
            borderRadius: '2px 2px 0 0'
          }} 
        />
      ))}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
      <span>OCT</span>
      <span>NOV</span>
      <span>DEC</span>
      <span>JAN</span>
    </div>
  </div>
);

// --- SUB-COMPONENT: LIVE KEYWORD FEED ---
const KeywordSidebar = () => {
  const [marketList, setMarketList] = useState([
    { id: 'k1', t: "modern cat tower", s: 98, pct: 12.4 },
    { id: 'k2', t: "mushroom lamp", s: 95, pct: 8.1 },
    { id: 'k3', t: "bamboo organizer", s: 88, pct: 5.2 },
    { id: 'k4', t: "coffin shelf", s: 82, pct: -2.3 },
    { id: 'k5', t: "chunky knit blanket", s: 75, pct: -1.5 },
    { id: 'k6', t: "personalized mug", s: 64, pct: 3.8 },
    { id: 'k7', t: "linen dress", s: 55, pct: 0.4 },
    { id: 'k8', t: "brass candlestick", s: 48, pct: 1.2 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketList(currentList => {
        return currentList.map(item => {
          const shift = (Math.random() * 2 - 1).toFixed(1); 
          let newPct = parseFloat((item.pct + parseFloat(shift)).toFixed(1));
          return { ...item, pct: newPct };
        });
      });
    }, 2000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="keyword-sidebar">
      <div className="keyword-header">
        <h3 style={{margin:0, color:'var(--neon-cyan)', fontSize:'1rem', letterSpacing:'1px', textTransform:'uppercase'}}>
          LIVE SEARCHES
        </h3>
        <div style={{display:'flex', alignItems:'center', gap:'6px', marginTop:'5px'}}>
           <div className="live-dot pulse"></div>
           <span style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>REAL-TIME UPDATES</span>
        </div>
      </div>
      
      <div className="keyword-list">
        {marketList.map((k) => (
          <div key={k.id} className="tag-row">
            <div className="tag-progress-bg" style={{width: `${k.s}%`}}></div>
            <div className="tag-row-content">
              <span style={{fontFamily:'Inter, monospace', fontWeight:'600'}}>{k.t}</span>
              <div className="tag-stat-group">
                 <span className="tag-delta" style={{color: k.pct > 0 ? 'var(--neon-teal)' : 'var(--neon-orange)'}}>
                   {k.pct > 0 ? '+' : ''}{k.pct}%
                 </span>
                 <span className="tag-score-val">{k.s}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{padding:'20px', borderTop:'1px solid var(--border-subtle)', background:'rgba(0,0,0,0.2)'}}>
        <h4 style={{margin:'0 0 15px 0', color:'white', fontSize:'0.7rem', letterSpacing:'1px'}}>POPULAR REGIONS</h4>
        <div style={{display:'flex', gap:'6px', height:'60px', alignItems:'flex-end'}}>
           <div style={{flex:1, height:'65%', background:'linear-gradient(0deg, #2dd4bf20 0%, #2dd4bf 100%)', borderTop:'2px solid var(--neon-teal)'}}></div>
           <div style={{flex:1, height:'80%', background:'linear-gradient(0deg, #22d3ee20 0%, #22d3ee 100%)', borderTop:'2px solid var(--neon-cyan)'}}></div>
           <div style={{flex:1, height:'40%', background:'linear-gradient(0deg, #a78bfa20 0%, #a78bfa 100%)', borderTop:'2px solid var(--neon-purple)'}}></div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export const MarketRadar = () => {
  const [radarView, setRadarView] = useState('global'); 
  const [activeSector, setActiveSector] = useState(null); 
  const [expandedSection, setExpandedSection] = useState(null); 

  const topMovers = [
    { id: 'tm1', name: "Pet Architecture", growth: "+210%", score: 98, vol: "18k", comp: "Low", status: "TRENDING FAST", color: "neon-teal", desc: "Modern, high-end furniture designed specifically for pets." },
    { id: 'tm2', name: "Gothic Home Decor", growth: "+125%", score: 85, vol: "45k", comp: "Med", status: "STILL HOT", color: "neon-teal", desc: "Dark aesthetic pieces like coffin shelves and witchy vibes." },
    { id: 'tm3', name: "Cyberpunk Gear", growth: "+45%", score: 60, vol: "12k", comp: "Low", status: "ON THE RISE", color: "neon-purple", desc: "Tech-focused clothing and accessories with LED accents." }
  ];

  const highTraffic = [
    { id: 'ht1', name: "Digital Planners", growth: "-12%", score: 30, vol: "120k", comp: "High", status: "CROWDED", color: "neon-orange", desc: "Productivity templates for tablets and GoodNotes." },
    { id: 'ht2', name: "Event Invitations", growth: "+22%", score: 55, vol: "85k", comp: "High", status: "CONSISTENT", color: "neon-blue", desc: "Custom templates for weddings and corporate events." },
    { id: 'ht3', name: "Minimalist Jewelry", growth: "+15%", score: 50, vol: "60k", comp: "Very High", status: "STEADY", color: "neon-blue", desc: "Simple, high-quality pieces for everyday wear." }
  ];

  const emergingTrends = [
    { id: 'et1', name: "Mushroom Decor", growth: "+300%", score: 92, vol: "5k", comp: "Low", status: "NEW FIND", color: "neon-orange", desc: "Nature-inspired lighting and whimsical room accents." },
    { id: 'et2', name: "Bamboo Storage", growth: "+85%", score: 70, vol: "32k", comp: "Low", status: "GAINING GROUND", color: "neon-cyan", desc: "Sustainable and eco-friendly home organization solutions." }
  ];

  const sections = {
    viral: { title: "TRENDING NOW", data: topMovers, color: 'neon-teal', icon: '▲' },
    main: { title: "STEADY WINNERS", data: highTraffic, color: 'neon-blue', icon: '●' },
    iykyk: { title: "HIDDEN GEMS", data: emergingTrends, color: 'neon-orange', icon: '★' }
  };

  const handleBackToGlobal = () => {
    setRadarView('global');
    setActiveSector(null);
    setExpandedSection(null);
  };

  return (
    <div className="radar-grid-layout">
      <div className="radar-scroll-area">
        
        {/* HEADER */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
           <div>
             <h2 style={{margin:0, color:'white', fontSize:'2rem', letterSpacing:'-1px'}}>
               {expandedSection ? sections[expandedSection].title : 
                radarView === 'sector' ? `SEARCHING: ${activeSector.name.toUpperCase()}` : 'MARKET PULSE'}
             </h2>
             {expandedSection && <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>HISTORY AND CURRENT OPPORTUNITIES</span>}
           </div>
           
           {(radarView === 'sector' || expandedSection) && (
             <button className="btn-ghost" onClick={handleBackToGlobal}>← BACK TO OVERVIEW</button>
           )}
        </div>

        {/* TOP STATS */}
        {!expandedSection && radarView !== 'sector' && (
          <>
            <div className="cockpit-grid">
              <div className="timeframe-tag">LIVE STATS</div>
              <PerformanceDial label="Biggest Jump" value="+210%" subtext="Pet Arch." color="neon-teal" percent={100} />
              <PerformanceDial label="High Volume" value="120k" subtext="Planners" color="neon-blue" percent={85} />
              <PerformanceDial label="Shopper Mood" value="HIGH" subtext="Busy Season" color="neon-cyan" percent={95} />
              <PerformanceDial label="New Trend" value="FOUND" subtext="Mushrooms" color="neon-orange" percent={40} />
            </div>

            <div style={{overflow:'hidden', whiteSpace:'nowrap', marginBottom:'30px', background:'rgba(255,255,255,0.02)', padding:'10px', borderRadius:'4px'}}>
               <div className="ticker-wrap">
                  <div className="ticker-move" style={{color:'var(--neon-cyan)', fontSize:'0.85rem', fontWeight:'600'}}>
                     🔥 UPDATE: Holiday gifting is peaking • Search volume up 120% • Personalized items are winning •
                  </div>
               </div>
            </div>
          </>
        )}

        {/* --- DYNAMIC VIEWS --- */}
        {expandedSection ? (
          <div className="animate-fade-in">
            <h4 className="section-label">HOW IT'S BEEN TRENDING</h4>
            <TrendTimeline color={sections[expandedSection].color} />

            <h4 className="section-label" style={{ marginTop: '40px' }}>CURRENT LEADS</h4>
            <div className="ops-grid">
              {sections[expandedSection].data.map(sector => (
                 <SectorCard key={sector.id} sector={sector} onClick={() => { setActiveSector(sector); setRadarView('sector'); }} />
              ))}
            </div>
          </div>
        ) : radarView === 'global' && (
          <div className="animate-fade-in">
            {Object.entries(sections).map(([key, config]) => (
              <React.Fragment key={key}>
                <div className="section-header-row">
                  <h3 className="section-title"><span style={{color:`var(--${config.color})`}}>{config.icon}</span> {config.title}</h3>
                  <button className="btn-ghost" onClick={() => setExpandedSection(key)}>VIEW ALL</button>
                </div>
                <div className="ops-grid">
                  {config.data.slice(0, 3).map(sector => (
                    <SectorCard key={sector.id} sector={sector} onClick={() => { setActiveSector(sector); setRadarView('sector'); }} />
                  ))}
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <KeywordSidebar />
    </div>
  );
};

const SectorCard = ({ sector, onClick }) => (
  <div className="ops-panel" style={{borderLeftColor: `var(--${sector.color})`}} onClick={onClick}>
    <div className="ops-panel-inner">
      <div className="panel-header">
         <h3 className="panel-title">{sector.name}</h3>
         <GrowthRadar color={sector.color} percent={sector.score || 70} />
      </div>
      <div className="growth-big">{sector.growth}</div>
      <div className="panel-desc">{sector.desc}</div>
      <div className="panel-footer">
         <div className="mini-stat"><span className="mini-label">VOLUME</span><span className="mini-val">{sector.vol}</span></div>
         <div className="mini-stat"><span className="mini-label">COMPETITION</span><span className="mini-val">{sector.comp}</span></div>
         <span className="uplink-badge" style={{color: `var(--${sector.color})`}}>{sector.status}</span>
      </div>
    </div>
  </div>
);