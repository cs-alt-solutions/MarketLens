import React, { useState } from 'react';
import './ConsoleLayout.css';

// --- SUB-COMPONENT: KEYWORD SIDEBAR ---
const KeywordSidebar = ({ data }) => (
  <div className="keyword-sidebar">
    <div className="keyword-header">
      <h3 style={{margin:0, color:'var(--neon-cyan)', fontSize:'1rem', letterSpacing:'1px', textShadow:'0 0 5px rgba(6,182,212,0.5)'}}>
        {data.title}
      </h3>
      <span style={{fontSize:'0.7rem', color:'var(--text-muted)', display:'block', marginTop:'5px'}}>LIVE SEARCH HYPE</span>
    </div>
    
    <div className="keyword-list">
      {data.keywords.map((k, i) => (
        <div key={i} className="tag-row">
          <span>#{k.t}</span>
          <span className="tag-score">{k.s}/100</span>
        </div>
      ))}
      <button className="btn-primary" onClick={() => navigator.clipboard.writeText(data.keywords.map(k=>k.t).join(', '))}>
        COPY ALL TAGS
      </button>
    </div>

    <div style={{padding:'20px', borderTop:'1px solid var(--border-subtle)', background:'rgba(0,0,0,0.2)'}}>
      <h4 style={{margin:'0 0 10px 0', color:'white', fontSize:'0.8rem'}}>WHERE IT'S POPPING</h4>
      <div style={{display:'flex', gap:'5px', height:'60px', alignItems:'flex-end'}}>
         {data.regions.map((region, i) => (
            <div key={i} style={{
               flex: 1, background: region.color, height: `${region.val}%`, opacity: 0.8, borderRadius: '2px 2px 0 0', transition: 'height 0.5s ease' 
            }} title={`${region.code}: ${region.val}%`}></div>
         ))}
      </div>
      <div style={{display:'flex', gap:'5px', marginTop:'5px'}}>
         {data.regions.map((region, i) => (
            <div key={i} style={{flex: 1, fontSize:'0.6rem', color:'var(--text-muted)', textAlign:'center', fontWeight: '700'}}>
               {region.code}
            </div>
         ))}
      </div>
    </div>
  </div>
);

// --- SUB-COMPONENT: PRODUCT INSPECTOR ---
const ProductInspector = ({ item, onClose }) => {
  const [notification, setNotification] = useState('');

  const handleCopyTags = () => {
    navigator.clipboard.writeText(item.tags.join(', '));
    setNotification('TAGS GRABBED');
    setTimeout(() => setNotification(''), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button className="btn-ghost" onClick={onClose}>← BACK TO RADAR</button>
        {notification && <div className="uplink-badge" style={{borderColor:'var(--neon-teal)', color:'var(--neon-teal)'}}>{notification}</div>}
      </div>

      <div className="inspector-container">
        <div className="inspector-visual">
          <img src={item.image} alt={item.title} />
        </div>
        <div className="inspector-data">
          <div className="dossier-header">
            <h2 style={{ margin: 0, fontSize: '2rem', color: 'white' }}>{item.title}</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <span className="uplink-badge" style={{color:'var(--neon-blue)', borderColor:'var(--neon-blue)'}}>SHOP: {item.shop}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SPOTTED: TODAY</span>
            </div>
          </div>
          <div className="dossier-grid">
            <div className="dossier-stat"><label>LIST PRICE</label><span>${item.price.toFixed(2)}</span></div>
            <div className="dossier-stat"><label>EST. MO. REVENUE</label><span style={{color:'var(--neon-teal)'}}>${(item.price * 12).toFixed(2)}</span></div>
            <div className="dossier-stat"><label>TOTAL VIEWS</label><span>{item.views}</span></div>
            <div className="dossier-stat"><label>CONVERSION</label><span>{((12 / item.views) * 100).toFixed(1)}%</span></div>
          </div>
          
          <div style={{marginTop:'20px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
               <label style={{fontSize:'0.7rem', color:'var(--text-muted)', textTransform:'uppercase'}}>HYPE TAGS</label>
               <button className="btn-ghost" style={{padding:'4px 8px', fontSize:'0.7rem'}} onClick={handleCopyTags}>COPY ALL</button>
            </div>
            <div className="tag-cloud">
              {item.tags.map((tag, i) => (
                <span key={i} className="tag-chip" style={{color:'var(--neon-cyan)', borderColor:'var(--neon-cyan)', border:'1px solid'}}>{tag}</span>
              ))}
            </div>
          </div>

          <div style={{display:'flex', gap:'15px', marginTop:'auto', paddingTop:'30px'}}>
            <button className="btn-primary" style={{flex:1, marginTop:0}}>TRACK THIS</button>
            <button className="btn-ghost" style={{flex:1, marginTop:0}} onClick={() => window.open('https://etsy.com', '_blank')}>VIEW ON ETSY</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MarketRadar = () => {
  const [radarView, setRadarView] = useState('global'); 
  const [activeSector, setActiveSector] = useState(null); 
  const [selectedItem, setSelectedItem] = useState(null); 
  const [selectedGlobalMetric, setSelectedGlobalMetric] = useState(null);

  // --- REVISED TERMS: NEW AGE / HYPE ---
  const globalMetricIntel = {
    mover: {
      title: "TOP MOVER: PET ARCHITECTURE",
      val: "+210% GROWTH",
      desc: "Viral Alert: Luxury cat furniture is blowing up on TikTok right now. People are obsessed.",
      advice: "THE MOVE: Check out 'Wall-mounted cat steps' or 'Modern dog beds'. Barely anyone is selling them yet."
    },
    vol: {
      title: "HIGHEST TRAFFIC: PLANNERS",
      val: "120k SEARCHES",
      desc: "Everyone wants a Digital Planner, but everyone is selling one too. It's a bloodbath out there.",
      advice: "THE MOVE: Niche down hard. Don't make a '2026 Planner', make a '2026 ADHD Planner for Nurses'."
    },
    mood: {
      title: "MARKET VIBE: ALL SYSTEMS GO",
      val: "HIGH TRAFFIC",
      desc: "Traffic is way up this month. Shoppers are already in 'Gift Mode'.",
      advice: "THE MOVE: It's safe to launch expensive stuff ($50+) right now. People are buying."
    },
    new: {
      title: "FRESH DROP: FUNGI DECOR",
      val: "JUST LANDED",
      desc: "We just spotted a spike in 'Mushroom Lamp' searches. This trend is brand new.",
      advice: "THE MOVE: Jump in now and you can own this niche before the big shops copy it."
    }
  };

  // --- GLOBAL SECTORS (New Terminology) ---
  const [globalSectors] = useState([
    { 
      id: 'sec1', name: "Gothic Home Decor", growth: "+125%", vol: "45k", comp: "Med", status: "SUPER HOT", color: "neon-teal", 
      desc: "Dark aesthetic, witchy vibes, coffin shelves.", trend: [20, 35, 50, 45, 80, 100], hotRegions: ["hot", "hot", "warm", "cold", "warm"] 
    },
    { 
      id: 'sec2', name: "Eco Storage Solutions", growth: "+85%", vol: "32k", comp: "Low", status: "GOLD MINE", color: "neon-cyan", 
      desc: "Bamboo organization, raw materials, glass jars.", trend: [10, 20, 25, 40, 60, 85], hotRegions: ["warm", "warm", "hot", "warm", "cold"] 
    },
    { 
      id: 'sec3', name: "Digital Planners", growth: "-12%", vol: "120k", comp: "High", status: "TOO CROWDED", color: "neon-orange", 
      desc: "iPad templates, GoodNotes files.", trend: [100, 90, 85, 70, 60, 50], hotRegions: ["hot", "cold", "cold", "warm", "hot"] 
    },
    { 
      id: 'sec4', name: "Pet Architecture", growth: "+210%", vol: "18k", comp: "Low", status: "FRESH DROP", color: "neon-teal", 
      desc: "Modern furniture for cats & dogs.", trend: [5, 10, 25, 50, 90, 100], hotRegions: ["hot", "hot", "hot", "warm", "warm"] 
    }
  ]);

  const [myNiches] = useState([
    { 
      id: 'my1', name: "Custom Wood Coasters", growth: "+15%", vol: "8k", comp: "High", status: "STEADY", color: "neon-blue", 
      desc: "Your Active Niche: Laser cut sets.", trend: [60, 62, 61, 65, 68, 70], hotRegions: ["warm", "warm", "cold", "cold", "warm"] 
    },
    { 
      id: 'my2', name: "Resin Floral Jewelry", growth: "+40%", vol: "22k", comp: "Med", status: "HEATING UP", color: "neon-teal", 
      desc: "Your Active Niche: Real flower inserts.", trend: [30, 35, 40, 50, 55, 65], hotRegions: ["hot", "hot", "warm", "warm", "cold"] 
    }
  ]);

  const [marketData] = useState([
    { id: 1, title: "Steampunk Gear Lamp", price: 125.00, views: 1204, tagColor: "lime", saturation: "GOLD MINE", shop: "IndustrialLight", tags: ["industrial", "lamp", "gear", "gift"], image: "https://placehold.co/600x400/1e293b/a3e635?text=Gear+Lamp" },
    { id: 2, title: "Leather Grimoire Journal", price: 85.00, views: 3400, tagColor: "orange", saturation: "CROWDED", shop: "WitchyCrafts", tags: ["leather", "book", "magic", "diary"], image: "https://placehold.co/600x400/1e293b/f97316?text=Grimoire" }
  ]);

  const getSidebarData = () => {
    if (radarView === 'personal') {
      return {
        title: "MY WATCHLIST",
        keywords: [ { t: "custom coaster", s: 92 }, { t: "epoxy flower", s: 88 }, { t: "wedding gift", s: 85 }, { t: "wood burn", s: 76 } ],
        regions: [ { code: "USA", val: 80, color: "var(--neon-teal)" }, { code: "CAN", val: 60, color: "var(--neon-cyan)" }, { code: "UK", val: 40, color: "var(--neon-orange)" } ]
      };
    } else {
      return {
        title: "GLOBAL HYPE",
        keywords: [ { t: "modern cat tower", s: 98 }, { t: "mushroom lamp", s: 95 }, { t: "bamboo organizer", s: 88 }, { t: "coffin shelf", s: 82 } ],
        regions: [ { code: "USA", val: 65, color: "var(--neon-teal)" }, { code: "ASIA", val: 80, color: "var(--neon-cyan)" }, { code: "EU", val: 40, color: "var(--neon-purple)" } ]
      };
    }
  };

  const handleBackToGlobal = () => {
    setRadarView('global');
    setActiveSector(null);
    setSelectedItem(null);
    setSelectedGlobalMetric(null);
  };

  if (selectedItem) {
    return (
      <ProductInspector item={selectedItem} onClose={() => setSelectedItem(null)} />
    );
  }

  return (
    <div className="radar-grid-layout">
      <div className="radar-scroll-area">
        
        {/* HEADER & TOGGLE */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
           <div>
              {radarView === 'sector' && <button className="btn-ghost" onClick={handleBackToGlobal} style={{marginBottom:'10px'}}>← BACK</button>}
              <h2 style={{margin:0, color:'white', fontSize:'2rem', letterSpacing:'-1px'}}>
                {radarView === 'personal' ? 'MY INTEL' : (radarView === 'global' ? 'GLOBAL INTELLIGENCE' : `SECTOR: ${activeSector.name.toUpperCase()}`)}
              </h2>
           </div>
           
           <div style={{display:'flex', gap:'10px'}}>
              <button className={`btn-ghost ${radarView !== 'personal' ? 'active' : ''}`} onClick={() => setRadarView('global')}>GLOBAL SCANS</button>
              <button className={`btn-ghost ${radarView === 'personal' ? 'active' : ''}`} onClick={() => setRadarView('personal')}>MY TARGETS</button>
           </div>
        </div>

        {/* CLICKABLE METRIC CARDS */}
        {selectedGlobalMetric ? (
          <div className="metric-deep-dive">
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <h2 style={{color: 'var(--neon-cyan)', margin:0}}>{globalMetricIntel[selectedGlobalMetric].title}</h2>
              <button className="btn-ghost" onClick={() => setSelectedGlobalMetric(null)}>CLOSE X</button>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:'40px', marginTop:'20px'}}>
              <div>
                 <div style={{fontSize:'3rem', fontWeight:'800', color:'white'}}>{globalMetricIntel[selectedGlobalMetric].val}</div>
                 <div className="uplink-badge" style={{display:'inline-block', marginTop:'15px', color:'var(--neon-teal)', borderColor:'var(--neon-teal)'}}>LIVE ANALYTICS</div>
              </div>
              <div>
                 <p style={{fontSize:'1.1rem', lineHeight:'1.6', color:'var(--text-main)'}}>{globalMetricIntel[selectedGlobalMetric].desc}</p>
                 <div style={{background:'rgba(255,255,255,0.05)', padding:'15px', borderRadius:'8px', borderLeft:'4px solid var(--neon-teal)', marginTop:'15px'}}>
                    <strong style={{color:'var(--neon-teal)'}}>THE MOVE:</strong> {globalMetricIntel[selectedGlobalMetric].advice}
                 </div>
              </div>
            </div>
          </div>
        ) : (
          /* HUD METRICS */
          <div className="hud-grid">
            <div className="stat-card" onClick={() => setSelectedGlobalMetric('mover')}>
              <span className="stat-label">TOP MOVER</span>
              <span className="stat-value" style={{color:'var(--neon-teal)'}}>Pet Arch.</span>
              <div className="stat-desc" style={{color:'var(--neon-teal)'}}>▲ 210% Growth</div>
            </div>
            <div className="stat-card" onClick={() => setSelectedGlobalMetric('vol')}>
              <span className="stat-label">HIGHEST TRAFFIC</span>
              <span className="stat-value">Planners</span>
              <div className="stat-desc">120k Searches</div>
            </div>
            <div className="stat-card" onClick={() => setSelectedGlobalMetric('mood')}>
              <span className="stat-label">MARKET VIBE</span>
              <span className="stat-value" style={{color:'var(--neon-cyan)'}}>ALL SYSTEMS GO</span>
              <div className="stat-desc">High Confidence</div>
            </div>
            <div className="stat-card" onClick={() => setSelectedGlobalMetric('new')}>
              <span className="stat-label">FRESH DROP</span>
              <span className="stat-value" style={{color:'var(--neon-orange)'}}>Fungi</span>
              <div className="stat-desc">Just Landed</div>
            </div>
          </div>
        )}

        {/* LIVE TICKER */}
        {radarView === 'global' && (
          <div style={{overflow:'hidden', whiteSpace:'nowrap', marginBottom:'30px', background:'rgba(255,255,255,0.02)', padding:'10px', borderRadius:'4px'}}>
             <div className="ticker-wrap">
                <div className="ticker-move" style={{color:'var(--text-muted)', fontSize:'0.8rem'}}>
                   ⚡ LIVE HYPE: "Minimalist Jewelry" +12% • "Digital Wedding Invites" +45% • "Chunky Knit Blankets" -8% • "Custom Pet Portraits" +22% •
                </div>
             </div>
          </div>
        )}

        {/* SECTOR GRID */}
        {(radarView === 'global' || radarView === 'personal') && (
          <div className="animate-fade-in">
            <h3 style={{borderBottom:'1px solid var(--border-subtle)', paddingBottom:'10px', color:'var(--text-muted)', fontSize:'0.9rem', marginBottom:'20px'}}>
              {radarView === 'global' ? 'DETECTED OPPORTUNITIES' : 'MONITORED CAMPAIGNS'}
            </h3>
            
            <div className="ops-grid">
              {(radarView === 'global' ? globalSectors : myNiches).map(sector => (
                <div key={sector.id} className="ops-card" onClick={() => { setActiveSector(sector); setRadarView('sector'); }}>
                  <div style={{padding:'20px', flex:1, display:'flex', flexDirection:'column'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                      <h3 style={{margin:0, color:'white', fontSize:'1.2rem'}}>{sector.name}</h3>
                      <span className="uplink-badge" style={{color: `var(--${sector.color})`, borderColor: `var(--${sector.color})`}}>{sector.status}</span>
                    </div>
                    <p style={{color:'var(--text-muted)', fontSize:'0.9rem', marginBottom:'20px', flex:1}}>{sector.desc}</p>
                    
                    <div>
                      <label className="stat-label">WHERE IT'S POPPING</label>
                      <div className="demand-map">
                         {sector.hotRegions.map((h, i) => (
                            <div key={i} className={`map-region ${h}`}></div>
                         ))}
                      </div>
                      <div className="mini-chart">
                        {sector.trend.map((val, i) => (
                          <div key={i} className="chart-bar" style={{height: `${val}%`, backgroundColor: `var(--${sector.color})`}}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCT GRID */}
        {radarView === 'sector' && (
           <div className="animate-fade-in">
             <div className="ops-grid">
               {marketData.map(item => (
                 <div key={item.id} className="ops-card" onClick={() => setSelectedItem(item)}>
                   <div className="card-image-placeholder">
                     <img src={item.image} alt={item.title}/>
                   </div>
                   <div style={{padding:'20px'}}>
                     <h3 style={{color:'white', margin:'0 0 5px 0'}}>{item.title}</h3>
                     <span style={{color:'var(--neon-teal)', fontWeight:'bold'}}>${item.price}</span>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        )}

      </div>

      <KeywordSidebar data={getSidebarData()} />

    </div>
  );
};