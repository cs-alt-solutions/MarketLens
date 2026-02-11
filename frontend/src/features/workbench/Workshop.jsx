/* src/features/workbench/Workshop.jsx */
import React, { useState, useEffect, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext'; 
import { ProjectCard } from '../../components/ProjectCard';
import { ImagePlaceholder } from '../../components/ImagePlaceholder'; 
import { Plus, Back, Save, Box } from '../../components/Icons'; 
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

// --- HELPER: CALCULATE RECIPE COST ---
const calculateRecipeCost = (recipe, materials) => {
  return recipe.reduce((total, item) => {
    const mat = materials.find(m => m.id === item.matId);
    if (!mat) return total;
    return total + (item.reqPerUnit * mat.costPerUnit); 
  }, 0);
};

export const Workshop = ({ onRequestFullWidth }) => {
  // FIXED: Using useInventory instead of useWorkbench
  const { projects, addProject, deleteProject, updateProject, materials, manufactureProduct } = useInventory();
  
  const [activeProject, setActiveProject] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  // --- STUDIO STATE ---
  const [recipe, setRecipe] = useState([]);
  const [missions, setMissions] = useState([]); 
  const [tags, setTags] = useState([]); 
  const [notes, setNotes] = useState(''); 
  const [newTagInput, setNewTagInput] = useState('');
  const [newIngredientId, setNewIngredientId] = useState('');
  const [newMissionTitle, setNewMissionTitle] = useState('');

  // --- FILTER PROJECTS ---
  const activeProjects = useMemo(() => projects.filter(p => p.status === 'active'), [projects]);
  const draftProjects = useMemo(() => projects.filter(p => p.status === 'draft'), [projects]);
  const archiveProjects = useMemo(() => projects.filter(p => ['completed', 'on_hold'].includes(p.status)), [projects]);

  // Sync Layout Mode
  useEffect(() => {
    if (onRequestFullWidth) {
      onRequestFullWidth(!!activeProject); 
    }
  }, [activeProject, onRequestFullWidth]);

  // --- CALCULATIONS ---
  const totalUnitCost = useMemo(() => calculateRecipeCost(recipe, materials), [recipe, materials]);
  const projectedMargin = activeProject ? (activeProject.retailPrice - totalUnitCost) : 0;
  const marginPercent = activeProject && activeProject.retailPrice > 0 
    ? ((projectedMargin / activeProject.retailPrice) * 100).toFixed(1) 
    : '0.0';

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
    setRecipe(project.recipe || []); 
    setMissions(project.missions || []);
    setTags(project.tags || []);
    setNotes(project.notes || '');
  };

  const closeStudio = () => {
    setActiveProject(null);
  };

  const handleSaveProject = () => {
    const updated = { 
        ...activeProject, 
        tags, 
        missions, 
        notes, 
        recipe, // Ensure recipe is saved
        updated_at: new Date().toISOString() 
    };
    updateProject(updated);
    alert("FILE SAVED SUCCESSFULLY.");
  };

  const handleCompleteProject = () => {
    const result = manufactureProduct(activeProject.id, recipe);
    if (result.success) {
      updateProject({ ...activeProject, status: 'completed', tags, missions, notes, recipe });
      alert(result.message);
      closeStudio();
    } else {
      alert("ERROR: " + result.message);
    }
  };

  // --- FIELD HANDLERS ---
  const handlePriceChange = (val) => {
    const numVal = parseFloat(val);
    const updated = { ...activeProject, retailPrice: isNaN(numVal) ? 0 : numVal };
    setActiveProject(updated);
  };

  // Recipe Logic
  const addIngredient = () => {
    const mat = materials.find(m => m.id === parseInt(newIngredientId));
    if (mat) {
      setRecipe([...recipe, { 
        id: crypto.randomUUID(), 
        matId: mat.id, 
        name: mat.name, 
        reqPerUnit: 1, 
        unit: mat.unit 
      }]);
      setNewIngredientId('');
    }
  };
  const updateRecipeUsage = (id, field, val) => {
    setRecipe(recipe.map(r => r.id === id ? { ...r, [field]: val } : r));
  };
  const removeIngredient = (id) => setRecipe(recipe.filter(r => r.id !== id));

  // Mission Logic
  const addMission = (e) => {
    if ((e.key === 'Enter') && newMissionTitle.trim()) {
        e.preventDefault();
        const newMission = { id: Date.now(), title: newMissionTitle, status: 'pending' };
        setMissions([...missions, newMission]);
        setNewMissionTitle('');
    }
  };
  const toggleMission = (id) => {
      setMissions(missions.map(m => m.id === id ? { ...m, status: m.status === 'completed' ? 'pending' : 'completed' } : m));
  };
  const deleteMission = (id) => setMissions(missions.filter(m => m.id !== id));

  // Tag Logic
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
                <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>R&D OPERATIONS</span>
              </div>
              <button className="btn-primary" onClick={() => setIsCreateOpen(true)}><Plus /> NEW PROJECT</button>
            </div>

            {/* --- SECTION 1: ACTIVE OPERATIONS --- */}
            <div className="section-separator">
               <span className="separator-label">ACTIVE OPERATIONS</span>
               <div style={{height:'1px', background:'var(--border-subtle)', flex:1}}></div>
               <span style={{fontSize:'0.7rem', color:'var(--neon-teal)', marginLeft:'10px', fontWeight:700}}>
                  {activeProjects.length} ACTIVE
               </span>
            </div>
            
            {activeProjects.length === 0 ? (
                <div style={{padding:'30px', textAlign:'center', border:'1px dashed var(--border-subtle)', borderRadius:'4px', color:'var(--text-muted)', marginBottom:'20px'}}>
                   No active operations. Initiate a protocol above.
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

            {/* --- SECTION 2: CONCEPT BLUEPRINTS --- */}
            <div className="section-separator" style={{marginTop: '40px'}}>
               <span className="separator-label" style={{color:'var(--neon-blue)'}}>CONCEPT BLUEPRINTS</span>
               <div style={{height:'1px', background:'var(--border-subtle)', flex:1}}></div>
               <span style={{fontSize:'0.7rem', color:'var(--text-muted)', marginLeft:'10px'}}>
                  {draftProjects.length} DRAFTS
               </span>
            </div>

            {draftProjects.length === 0 ? (
                <div style={{padding:'30px', textAlign:'center', opacity: 0.5, fontStyle:'italic', color:'var(--text-muted)'}}>
                   Draft queue empty.
                </div>
            ) : (
                <div className="workshop-grid" style={{opacity: 0.9}}>
                  {draftProjects.map(p => (
                    <div key={p.id} onClick={() => openStudio(p)}>
                      <ProjectCard project={p} onDelete={(e) => { e.stopPropagation(); deleteProject(p.id); }} />
                    </div>
                  ))}
                </div>
            )}
            
            {/* CREATE MODAL */}
            {isCreateOpen && (
              <div className="blueprint-overlay" style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:2000}}>
                <div className="panel-industrial" style={{width:'400px', padding:'30px'}}>
                  <h2 style={{ color: 'var(--neon-orange)', marginTop: 0, fontSize:'1.2rem' }}>INITIATE PROTOCOL</h2>
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

      {/* --- VIEW 2: THE STUDIO (EDITOR) --- */}
      {activeProject && (
        <div className="studio-animate-enter" style={{height:'100%', padding:'20px 30px', display:'flex', flexDirection:'column', overflow:'hidden', background: '#000'}}>
            
            {/* 1. FILE HEADER */}
            <div className="file-header-strip">
                <button onClick={closeStudio} className="btn-icon" style={{borderRight:'1px solid var(--border-subtle)', paddingRight:'15px', marginRight:'15px'}}>
                    <Back /> <span style={{fontSize:'0.8rem', fontWeight:700, marginLeft:'5px'}}>CLOSE FILE</span>
                </button>
                <div style={{flex:1}}>
                   <div style={{fontSize:'0.65rem', color:'var(--neon-cyan)', letterSpacing:'1px'}}>PROJECT ID: {activeProject.id}</div>
                   <div style={{fontSize:'1.2rem', fontWeight:800, color:'#fff', textTransform:'uppercase'}}>{activeProject.title}</div>
                </div>
                <div style={{display:'flex', gap:'10px'}}>
                    <button onClick={handleSaveProject} className="btn-ghost" style={{borderColor:'var(--neon-teal)', color:'var(--neon-teal)'}}>
                        <Save /> SAVE PROGRESS
                    </button>
                    <button onClick={handleCompleteProject} className="btn-primary" style={{background:'var(--neon-purple)', color:'#fff'}}>
                        <Box /> FINALIZE
                    </button>
                </div>
            </div>

            {/* 2. CONTENT GRID */}
            <div className="studio-layout-wrapper">
                <div className="studio-grid">
                    
                    {/* --- COL 1: VISUALS & SPECS --- */}
                    <div className="studio-col left-col">
                        
                        {/* REFERENCE IMAGE */}
                        <div className="panel-industrial studio-panel" style={{padding:0, overflow:'hidden', minHeight:'200px'}}>
                             <ImagePlaceholder height="100%" label="REFERENCE VISUAL" />
                        </div>

                        {/* FINANCIAL CALCULATOR */}
                        <div className="panel-industrial studio-panel" style={{padding:'20px'}}>
                             <div className="floating-manifest-label" style={{color:'var(--neon-teal)', borderColor:'var(--neon-teal)'}}>MARKET CALIBRATION</div>
                             
                             <div className="flex-between" style={{marginBottom:'15px'}}>
                                 <div>
                                     <div className="label-industrial">TARGET RETAIL</div>
                                     <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                                         <span style={{color:'var(--neon-teal)', fontSize:'1.1rem'}}>$</span>
                                         <input 
                                            className="input-chromeless" 
                                            type="number" 
                                            step="0.01" 
                                            placeholder="0.00"
                                            value={activeProject.retailPrice || ''}
                                            onChange={(e) => handlePriceChange(e.target.value)}
                                         />
                                     </div>
                                 </div>
                                 <div style={{textAlign:'right'}}>
                                     <div className="label-industrial">UNIT COST</div>
                                     <div style={{fontSize:'1.1rem', color:'var(--neon-orange)', fontWeight:700}}>${totalUnitCost.toFixed(2)}</div>
                                 </div>
                             </div>

                             <div style={{background:'rgba(255,255,255,0.05)', padding:'10px', borderRadius:'2px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                 <span className="label-industrial" style={{margin:0}}>PROJ. MARGIN</span>
                                 <span style={{fontSize:'1.1rem', fontWeight:800, color: projectedMargin > 0 ? 'var(--neon-teal)' : 'var(--neon-red)'}}>
                                     {marginPercent}%
                                 </span>
                             </div>
                        </div>

                        {/* FIELD NOTES */}
                        <div className="panel-industrial studio-panel" style={{padding:'20px', flex:1}}>
                             <div className="floating-manifest-label">FIELD NOTES</div>
                             <textarea 
                                className="input-area-industrial" 
                                placeholder="Enter project details, dimensions, or observations..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                             ></textarea>
                        </div>

                        {/* TAGS */}
                        <div className="panel-industrial studio-panel" style={{padding:'20px'}}>
                            <div className="floating-manifest-label" style={{color:'var(--neon-cyan)', borderColor:'var(--neon-cyan)'}}>TAGS</div>
                            <div className="tag-input-area" style={{display:'flex', flexWrap:'wrap', gap:'5px'}}>
                                {tags.map(t => <div key={t} className="unit-badge"><span>{t}</span></div>)}
                                <input 
                                    className="input-chromeless" 
                                    style={{fontSize:'0.75rem', width:'100px'}} 
                                    placeholder="+ Add tag..." 
                                    value={newTagInput} 
                                    onChange={e => setNewTagInput(e.target.value)} 
                                    onKeyDown={addTag} 
                                />
                            </div>
                        </div>

                    </div>

                    {/* --- COL 2: BLUEPRINT & RECIPE --- */}
                    <div className="studio-col right-col">
                        
                        {/* MISSION PARAMETERS (MILESTONES) */}
                        <div className="panel-industrial studio-panel" style={{padding:'0', minHeight:'250px'}}>
                            <div className="floating-manifest-label" style={{color:'var(--neon-blue)', borderColor:'var(--neon-blue)'}}>MISSION OBJECTIVES</div>
                            <div style={{padding:'15px', borderBottom:'1px solid var(--border-subtle)'}}>
                                <input 
                                    className="input-industrial" 
                                    placeholder="+ Add new milestone (Press Enter)" 
                                    value={newMissionTitle} 
                                    onChange={e => setNewMissionTitle(e.target.value)}
                                    onKeyDown={addMission}
                                />
                            </div>
                            <div className="checklist-container">
                                {missions.length === 0 && <div className="empty-state">No active missions.</div>}
                                {missions.map(m => (
                                    <div key={m.id} className={`checklist-item ${m.status === 'completed' ? 'completed' : ''}`}>
                                        <div onClick={() => toggleMission(m.id)} style={{cursor:'pointer', display:'flex', alignItems:'center', gap:'10px', flex:1}}>
                                            <div className="checkbox-industrial">{m.status === 'completed' && <div className="check-mark"/>}</div>
                                            <span className="mission-text">{m.title}</span>
                                        </div>
                                        <button onClick={() => deleteMission(m.id)} className="btn-icon-hover" style={{fontSize:'1rem'}}>×</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* COMPOSITION MATRIX (RECIPE) */}
                        <div className="panel-industrial studio-panel" style={{padding:'0', flex:1, display:'flex', flexDirection:'column'}}>
                            <div className="floating-manifest-label" style={{color:'var(--neon-purple)', borderColor:'var(--neon-purple)'}}>BILL OF MATERIALS</div>
                            
                            {/* Toolbar */}
                            <div style={{padding:'15px', borderBottom:'1px solid var(--border-subtle)', display:'flex', gap:'10px'}}>
                                <select className="input-industrial" style={{fontSize:'0.8rem', padding:'8px'}} value={newIngredientId} onChange={e => setNewIngredientId(e.target.value)}>
                                <option value="">+ Select Material...</option>
                                {materials.map(m => <option key={m.id} value={m.id}>{m.name} (${m.costPerUnit}/{m.unit})</option>)}
                                </select>
                                <button onClick={addIngredient} className="btn-primary" style={{padding:'5px 12px', fontSize:'0.7rem'}}>ADD</button>
                            </div>

                            {/* Table Header */}
                            <div className="bom-header">
                                <div style={{flex:2}}>ITEM</div>
                                <div style={{flex:1, textAlign:'center'}}>QTY</div>
                                <div style={{flex:1, textAlign:'right'}}>EST COST</div>
                                <div style={{width:'30px'}}></div>
                            </div>

                            {/* Table Body */}
                            <div className="bom-body">
                                {recipe.length === 0 && <div className="empty-state">No materials defined.</div>}
                                {recipe.map(r => {
                                    const mat = materials.find(m => m.id === r.matId);
                                    const cost = mat ? (r.reqPerUnit * mat.costPerUnit) : 0;
                                    const unitOptions = getUnitOptions(r.unit);
                                    return (
                                        <div key={r.id} className="bom-row">
                                            <div style={{flex:2, fontWeight:700, fontSize:'0.85rem', color:'#fff'}}>{r.name}</div>
                                            <div style={{flex:1, display:'flex', alignItems:'center', gap:'5px', justifyContent:'center'}}>
                                                <input 
                                                    className="input-chromeless" 
                                                    type="number" 
                                                    value={r.reqPerUnit} 
                                                    onChange={e => updateRecipeUsage(r.id, 'reqPerUnit', e.target.value)} 
                                                    style={{textAlign:'right', width:'40px', color:'var(--neon-cyan)'}} 
                                                />
                                                <select 
                                                    className="input-chromeless" 
                                                    value={r.unit} 
                                                    onChange={e => updateRecipeUsage(r.id, 'unit', e.target.value)}
                                                    style={{fontSize:'0.7rem', width:'auto', padding:0, border:'none', textAlign:'center', color:'var(--text-muted)'}}
                                                >
                                                    {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                                                </select>
                                            </div>
                                            <div style={{flex:1, textAlign:'right', fontFamily:'monospace', color:'var(--text-muted)'}}>
                                                ${cost.toFixed(2)}
                                            </div>
                                            <div style={{width:'30px', textAlign:'right'}}>
                                                <button onClick={() => removeIngredient(r.id)} className="btn-icon" style={{color:'var(--neon-red)', fontSize:'0.8rem'}}>×</button>
                                            </div>
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

      {/* --- SIDEBAR: ARCHIVE & VAULT --- */}
      {!activeProject && (
        <div className="sidebar-col">
             <div className="keyword-header" style={{padding:'15px', background:'var(--bg-panel-header)'}}>
                <h3 className="label-industrial glow-purple" style={{ margin: 0 }}>THE VAULT</h3>
                <span style={{fontSize:'0.65rem', color:'var(--text-muted)'}}>ARCHIVED & HALTED</span>
             </div>
             
             <div className="folder-stack">
                {archiveProjects.length === 0 ? (
                    <div style={{color:'var(--text-muted)', fontStyle:'italic', fontSize:'0.8rem', textAlign:'center', marginTop:'20px'}}>
                        Vault empty.
                    </div>
                ) : (
                    archiveProjects.map((p, index) => (
                        <div 
                          key={p.id} 
                          className="folder-stack-item" 
                          style={{ zIndex: index + 1 }}
                          onClick={() => openStudio(p)}
                        >
                            <ProjectCard 
                              project={p} 
                              readOnly={true} 
                              onDelete={(e) => { e.stopPropagation(); deleteProject(p.id); }} 
                            />
                        </div>
                    ))
                )}
             </div>
        </div>
      )}
    </div>
  );
};