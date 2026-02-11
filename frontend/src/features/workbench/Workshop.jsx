import React, { useState, useEffect } from 'react';
import { useWorkbench } from '../../context/WorkbenchContext'; 
import { ProjectCard } from '../../components/ProjectCard';
import { Plus, Back, Save, Finance, Box } from '../../components/Icons'; 
import './Workshop.css';

// --- UNIT CATEGORY DEFINITIONS ---
const UNIT_GROUPS = {
  'Weight': ['lbs', 'oz', 'kg', 'g'],
  'Volume': ['gal', 'fl oz', 'L', 'ml'],
  'Length': ['ft', 'in', 'yd', 'cm'],
  'Count': ['count', 'ea', 'box']
};

const getUnitOptions = (currentUnit) => {
  for (const group in UNIT_GROUPS) {
    if (UNIT_GROUPS[group].includes(currentUnit)) {
      return UNIT_GROUPS[group];
    }
  }
  return [currentUnit]; 
};

export const Workshop = ({ onRequestFullWidth }) => {
  const { projects, addProject, deleteProject, updateProject, materials, manufactureProduct } = useWorkbench();
  
  const [activeProject, setActiveProject] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  // --- STUDIO STATE ---
  const [recipe, setRecipe] = useState([]);
  const [tags, setTags] = useState([]); 
  const [newTagInput, setNewTagInput] = useState('');
  const [newIngredientId, setNewIngredientId] = useState('');

  // --- FILTER PROJECTS ---
  const activeProjects = projects.filter(p => p.status !== 'completed');
  const catalogProjects = projects.filter(p => p.status === 'completed');

  // Sync Layout Mode
  useEffect(() => {
    if (onRequestFullWidth) {
      onRequestFullWidth(!!activeProject); 
    }
  }, [activeProject, onRequestFullWidth]);

  // --- ACTIONS ---
  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;
    addProject(newProjectTitle);
    setNewProjectTitle('');
    setIsCreateOpen(false);
  };

  const openStudio = (project) => {
    setActiveProject(project);
    setRecipe([]); 
    setTags(project.tags || []);
  };

  const closeStudio = () => setActiveProject(null);

  const handleCompleteProject = () => {
    const result = manufactureProduct(activeProject.id, recipe);
    if (result.success) {
      updateProject({ ...activeProject, status: 'completed', tags });
      alert(result.message);
      closeStudio();
    } else {
      alert("ERROR: " + result.message);
    }
  };

  const handlePriceChange = (val) => {
    const numVal = parseFloat(val);
    const updated = { ...activeProject, retailPrice: isNaN(numVal) ? 0 : numVal };
    setActiveProject(updated);
    updateProject(updated);
  };

  const addIngredient = () => {
    const mat = materials.find(m => m.id === parseInt(newIngredientId));
    if (mat) {
      setRecipe([...recipe, { 
        id: crypto.randomUUID(), 
        matId: mat.id, 
        name: mat.name, 
        reqPerUnit: 0, 
        unit: mat.unit 
      }]);
      setNewIngredientId('');
    }
  };

  const updateRecipeUsage = (id, field, val) => {
    setRecipe(recipe.map(r => r.id === id ? { ...r, [field]: val } : r));
  };

  const removeIngredient = (id) => setRecipe(recipe.filter(r => r.id !== id));

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && newTagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(newTagInput.trim())) setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  return (
    <div className={`radar-grid-layout ${activeProject ? 'layout-full-width' : ''}`}>
      
      {/* --- VIEW 1: PROJECT HUB --- */}
      {!activeProject && (
        <div className="radar-scroll-area">
          <div className="animate-fade-in">
            <div className="inventory-header">
              <div>
                <h2 className="header-title">WORKSHOP</h2>
                <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>PROJECT MANAGEMENT</span>
              </div>
              <button className="btn-primary" onClick={() => setIsCreateOpen(true)}><Plus /> NEW PROJECT</button>
            </div>

            {/* --- ZONE 1: ACTIVE WORKBENCH --- */}
            <div className="section-separator">
               <span className="separator-label">ACTIVE WORKBENCH</span>
            </div>
            
            {activeProjects.length === 0 ? (
                <div style={{padding:'40px', textAlign:'center', border:'1px dashed var(--border-subtle)', borderRadius:'4px', color:'var(--text-muted)', marginBottom:'20px'}}>
                   No active projects. Start a new one to begin R&D.
                </div>
            ) : (
                <div className="workshop-grid">
                  {activeProjects.map(p => (
                    <div key={p.id} onClick={() => openStudio(p)}>
                      <ProjectCard project={p} onDelete={(e) => { e.stopPropagation(); deleteProject(p.id); }} />
                    </div>
                  ))}
                </div>
            )}

            {/* --- ZONE 2: PRODUCT CATALOG --- */}
            {catalogProjects.length > 0 && (
                <>
                    <div className="section-separator" style={{marginTop:'10px'}}>
                       <span className="separator-label" style={{color:'var(--neon-purple)'}}>CATALOG ARCHIVE</span>
                    </div>
                    <div className="workshop-grid">
                      {catalogProjects.map(p => (
                        <div key={p.id} onClick={() => openStudio(p)}>
                          <ProjectCard project={p} onDelete={(e) => { e.stopPropagation(); deleteProject(p.id); }} />
                        </div>
                      ))}
                    </div>
                </>
            )}
            
            {isCreateOpen && (
              <div className="blueprint-overlay" style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:2000}}>
                <div className="panel-industrial" style={{width:'400px', padding:'30px'}}>
                  <h2 style={{ color: 'var(--neon-orange)', marginTop: 0, fontSize:'1.2rem' }}>INITIATE PROJECT</h2>
                  <form onSubmit={handleCreateProject}>
                    <input autoFocus type="text" placeholder="Project Title..." value={newProjectTitle} onChange={e => setNewProjectTitle(e.target.value)} className="input-industrial" style={{ marginBottom: '20px' }} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button type="button" className="btn-ghost" onClick={() => setIsCreateOpen(false)}>CANCEL</button>
                      <button type="submit" className="btn-primary">CREATE</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- VIEW 2: THE STUDIO --- */}
      {activeProject && (
        <div className="animate-fade-in" style={{height:'100%', padding:'30px 40px', display:'flex', flexDirection:'column', overflow:'hidden'}}>
            
            {/* 1. HEADER */}
            <div className="inventory-header" style={{marginBottom:'20px', flexShrink: 0}}>
               <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                 <button onClick={closeStudio} className="btn-icon" style={{border:'1px solid var(--border-subtle)', padding:'8px'}}><Back /></button>
                 <div>
                   <h2 className="header-title" style={{color:'var(--neon-teal)'}}>{activeProject.title}</h2>
                   <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>PROJECT ID: {activeProject.id}</span>
                 </div>
               </div>
               <button onClick={handleCompleteProject} className="btn-primary" style={{background:'var(--neon-purple)', color:'#fff'}}>
                 <Save /> FINALIZE & CATALOG
               </button>
            </div>

            {/* 2. CONTENT */}
            <div className="studio-layout-wrapper">
                <div className="studio-container">
                {/* --- LEFT COLUMN: METADATA --- */}
                <div className="studio-col">
                    
                    {/* TAGS PANEL */}
                    <div className="panel-industrial" style={{padding:'20px', marginTop:0}}>
                        <div className="floating-manifest-label" style={{color:'var(--neon-orange)', borderColor:'var(--neon-orange)'}}>MARKETING DATA</div>
                        <label className="lab-label">TAG ARRAY ({tags.length}/13)</label>
                        <div className="tag-input-area" style={{marginBottom:'10px', display:'flex', flexWrap:'wrap', gap:'5px'}}>
                            {tags.map(t => <div key={t} className="unit-badge" style={{borderColor:'var(--neon-cyan)', color:'var(--neon-cyan)'}}><span>{t}</span></div>)}
                            <input className="input-industrial" placeholder="Add tag..." value={newTagInput} onChange={e => setNewTagInput(e.target.value)} onKeyDown={addTag} />
                        </div>
                    </div>

                    {/* FINANCIAL TARGETS PANEL */}
                    <div className="panel-industrial" style={{padding:'20px'}}>
                        <div className="floating-manifest-label" style={{color:'var(--neon-teal)', borderColor:'var(--neon-teal)'}}>FINANCIAL TARGETS</div>
                        <label className="lab-label">RETAIL PRICE ($)</label>
                        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                            <Finance />
                            <input 
                            className="input-industrial" 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            value={activeProject.retailPrice || ''} 
                            onChange={(e) => handlePriceChange(e.target.value)}
                            style={{fontSize:'1.1rem', fontWeight:'bold', color:'var(--neon-teal)'}}
                            />
                        </div>
                        <div className="lab-note" style={{marginTop:'10px', fontSize:'0.65rem'}}>
                            * Setting this now auto-fills the Sales Terminal when you sell this item.
                        </div>
                    </div>

                </div>

                {/* --- RIGHT COLUMN: RECIPE --- */}
                <div className="studio-col">
                    <div className="panel-industrial" style={{padding:'0', marginTop:0, display:'flex', flexDirection:'column', minHeight:'400px'}}>
                        <div className="floating-manifest-label" style={{color:'var(--neon-purple)', borderColor:'var(--neon-purple)'}}>COMPOSITION MATRIX</div>
                        <div style={{padding:'20px', borderBottom:'1px solid var(--border-subtle)', display:'flex', gap:'10px'}}>
                            <select className="input-industrial" value={newIngredientId} onChange={e => setNewIngredientId(e.target.value)}>
                            <option value="">+ Add Component...</option>
                            {materials.map(m => <option key={m.id} value={m.id}>{m.name} ({m.qty} {m.unit})</option>)}
                            </select>
                            <button onClick={addIngredient} className="btn-primary" style={{padding:'5px 15px'}}>ADD</button>
                        </div>
                        <div style={{padding:'0', flex:1}}>
                        {recipe.length === 0 && <div style={{padding:'20px', color:'var(--text-muted)', fontStyle:'italic'}}>No materials added yet.</div>}
                        {recipe.map(r => {
                            const unitOptions = getUnitOptions(r.unit);
                            return (
                            <div key={r.id} className="recipe-row">
                                <div style={{flex:2}}>
                                <div className="recipe-name">{r.name}</div>
                                </div>
                                <div style={{flex:1.5, display:'flex', alignItems:'center', gap:'5px'}}>
                                <input 
                                    className="input-industrial" 
                                    type="number" 
                                    placeholder="0" 
                                    value={r.reqPerUnit} 
                                    onChange={e => updateRecipeUsage(r.id, 'reqPerUnit', e.target.value)} 
                                    style={{textAlign:'center'}} 
                                />
                                <select 
                                    className="input-industrial" 
                                    value={r.unit} 
                                    onChange={e => updateRecipeUsage(r.id, 'unit', e.target.value)}
                                    style={{padding:'8px 4px', fontSize:'0.75rem', width:'60px'}}
                                >
                                    {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                                </div>
                                <button onClick={() => removeIngredient(r.id)} className="btn-icon" style={{color:'red', marginLeft:'10px'}}>×</button>
                            </div>
                            );
                        })}
                        </div>
                    </div>
                </div>

                </div>
            </div>
          </div>
        )}

      {/* RIGHT SIDEBAR (Only visible in Hub Mode) */}
      {!activeProject && (
        <div className="sidebar-col" style={{padding:'15px'}}>
             <div className="keyword-header" style={{padding:'0 0 15px 0'}}>
                <h3 className="label-industrial glow-purple" style={{ margin: 0 }}>PROJECT CONTROL</h3>
             </div>
             <div style={{padding:'15px', background:'rgba(255,255,255,0.02)', borderRadius:'2px', border:'1px solid var(--border-subtle)', marginBottom:'10px'}}>
                <div className="flex-between" style={{marginBottom:'5px'}}>
                   <span className="label-industrial">WIP (Active)</span>
                   <span className="glow-teal" style={{fontWeight:800}}>{projects.filter(p=>p.status==='active').length}</span>
                </div>
                <div className="flex-between" style={{marginBottom:'5px'}}>
                   <span className="label-industrial">DRAFT</span>
                   <span className="glow-orange" style={{fontWeight:800}}>{projects.filter(p=>p.status==='draft').length}</span>
                </div>
                <div className="flex-between">
                   <span className="label-industrial">CATALOG (Ready)</span>
                   <span className="glow-purple" style={{fontWeight:800}}>{projects.filter(p=>p.status==='completed').length}</span>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};