import React from 'react';
import './ProjectCard.css';

export const ProjectCard = ({ project, onDelete }) => {
  // Map statuses to the new badge classes
  const getStatusClass = (s) => {
    if (s === 'active') return 'active'; // Teal
    if (s === 'draft') return 'draft';   // Orange
    if (s === 'completed') return 'completed'; // Blue
    return '';
  };

  return (
    <div className="ops-panel">
      <div className="ops-panel-inner">
        
        {/* HEADER */}
        <div className="flex-between" style={{marginBottom:'15px'}}>
          <span className={`uplink-badge ${getStatusClass(project.status)}`}>
            {project.status}
          </span>
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
             {/* NEW: STOCK INDICATOR */}
             <div style={{textAlign:'right'}}>
                <span className="label-industrial" style={{fontSize:'0.55rem', margin:0}}>STOCK</span>
                <span style={{color:'var(--neon-teal)', fontWeight:800, fontSize:'0.9rem'}}>{project.stockQty || 0}</span>
             </div>
             <button 
                className="btn-icon"
                onClick={onDelete}
                title="Archive Mission"
             >
                ×
             </button>
          </div>
        </div>

        {/* TITLE */}
        <h3 style={{marginTop:0, marginBottom:'10px', fontSize:'1.1rem', color:'var(--text-main)'}}>
          {project.title}
        </h3>

        {/* STATS GRID */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'20px'}}>
          <div>
            <span className="label-industrial">DEMAND</span>
            <div className={`glow-${project.demand === 'High' || project.demand === 'Very High' ? 'teal' : 'orange'}`} style={{fontWeight:800}}>
              {project.demand}
            </div>
          </div>
          <div>
            <span className="label-industrial">COMPETITION</span>
            <div style={{fontWeight:800, color:'var(--text-muted)'}}>
              {project.competition}
            </div>
          </div>
        </div>

        {/* MISSIONS LIST */}
        <ul className="mission-list">
          {project.missions.length === 0 ? (
            <li className="empty">No active protocols.</li>
          ) : (
            project.missions.map(m => (
              <li key={m.id} className={m.status === 'completed' ? 'completed' : ''}>
                {m.title}
              </li>
            ))
          )}
        </ul>

        {/* FOOTER */}
        <div style={{marginTop:'auto', paddingTop:'15px', borderTop:'1px solid var(--border-subtle)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
           <span className="label-industrial" style={{margin:0}}>ID: {project.id}</span>
           <span style={{fontSize:'0.7rem', color:'var(--neon-purple)'}}>
             {project.tags && project.tags.length > 0 ? `${project.tags.length} TAGS` : 'UNTAGGED'}
           </span>
        </div>

      </div>
    </div>
  );
};