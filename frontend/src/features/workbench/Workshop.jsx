import React, { useState, useEffect, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext'; 
import { ProjectCard } from '../../components/ProjectCard';
import { ImagePlaceholder } from '../../components/ImagePlaceholder';
import { InputGroup } from '../../components/InputGroup'; 
import { Plus, Back, Save, Box } from '../../components/Icons'; 
import { formatCurrency, formatPercent } from '../../utils/formatters'; 
import { TERMINOLOGY } from '../../utils/glossary';
import './Workshop.css';

const UNIT_GROUPS = {
  'Weight': ['lbs', 'oz', 'kg', 'g'],
  'Volume': ['gal', 'fl oz', 'L', 'ml'],
  'Length': ['ft', 'in', 'yd', 'cm'],
  'Count': ['count', 'ea', 'box']
};

const getUnitOptions = (currentUnit) => {
  for (const group in UNIT_GROUPS) {
    if (UNIT_GROUPS[group].includes(currentUnit)) return UNIT_GROUPS[group];
  }
  return [currentUnit]; 
};

const calculateRecipeCost = (recipe, materials) => {
  return recipe.reduce((total, item) => {
    const mat = materials.find(m => m.id === item.matId);
    return mat ? total + (item.reqPerUnit * mat.costPerUnit) : total;
  }, 0);
};

export const Workshop = ({ onRequestFullWidth }) => {
  const { projects, addProject, deleteProject, updateProject, materials, manufactureProduct } = useInventory();
  
  const [activeProject, setActiveProject] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  const [recipe, setRecipe] = useState([]);
  const [missions, setMissions] = useState([]); 
  const [tags, setTags] = useState([]); 
  const [notes, setNotes] = useState(''); 
  const [newTagInput, setNewTagInput] = useState('');
  const [newIngredientId, setNewIngredientId] = useState('');
  const [newMissionTitle, setNewMissionTitle] = useState('');

  const activeProjects = useMemo(() => projects.filter(p => p.status === 'active'), [projects]);
  const draftProjects = useMemo(() => projects.filter(p => p.status === 'draft'), [projects]);
  const archiveProjects = useMemo(() => projects.filter(p => ['completed', 'on_hold'].includes(p.status)), [projects]);

  const totalUnitCost = useMemo(() => calculateRecipeCost(recipe, materials), [recipe, materials]);
  const projectedMargin = activeProject ? (activeProject.retailPrice - totalUnitCost) : 0;
  const marginPercentValue = activeProject && activeProject.retailPrice > 0 ? (projectedMargin / activeProject.retailPrice) * 100 : 0;

  useEffect(() => {
    if (onRequestFullWidth) onRequestFullWidth(!!activeProject); 
  }, [activeProject, onRequestFullWidth]);

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

  const handleSaveProject = () => {
    updateProject({ ...activeProject, tags, missions, notes, recipe, updated_at: new Date().toISOString() });
  };

  const handleCompleteProject = () => {
    const result = manufactureProduct(activeProject.id, recipe);
    if (result.success) {
      updateProject({ ...activeProject, status: 'completed', tags, missions, notes, recipe });
      setActiveProject(null);
    }
  };

  const addIngredient = () => {
    const mat = materials.find(m => m.id === parseInt(newIngredientId));
    if (mat) {
      setRecipe([...recipe, { id: crypto.randomUUID(), matId: mat.id, name: mat.name, reqPerUnit: 1, unit: mat.unit }]);
      setNewIngredientId('');
    }
  };

  const addMission = (e) => {
    if (e.key === 'Enter' && newMissionTitle.trim()) {
        e.preventDefault();
        setMissions([...missions, { id: Date.now(), title: newMissionTitle, status: 'pending' }]);
        setNewMissionTitle('');
    }
  };

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && newTagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(newTagInput.trim())) setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  return (
    <div className={`radar-grid-layout ${activeProject ? 'layout-full-width' : ''}`}>
      {!activeProject && (
        <div className="radar-scroll-area">
          <div className="animate-fade-in">
            <div className="inventory-header">
              <div>
                <h2 className="header-title">{TERMINOLOGY.WORKSHOP.HUB_HEADER}</h2>
                <span className="header-subtitle">{TERMINOLOGY.WORKSHOP.HUB_SUBTITLE}</span>
              </div>
              <button className="btn-primary" onClick={() => setIsCreateOpen(true)}>
                <Plus /> {TERMINOLOGY.WORKSHOP.NEW_PROJECT}
              </button>
            </div>

            <div className="section-separator">
               <span className="separator-label">{TERMINOLOGY.WORKSHOP.ACTIVE_OPS}</span>
               <div className="separator-line" />
               <span className="separator-count active">{activeProjects.length} ACTIVE</span>
            </div>
            
            <div className="workshop-grid">
              {activeProjects.map(p => (
                <div key={p.id} onClick={() => openStudio(p)}>
                  <ProjectCard project={p} onDelete={(e) => { e.stopPropagation(); deleteProject(p.id); }} />
                </div>
              ))}
            </div>

            <div className="section-separator mt-20">
               <span className="separator-label draft">{TERMINOLOGY.WORKSHOP.DRAFTS}</span>
               <div className="separator-line" />
               <span className="separator-count">{draftProjects.length} DRAFTS</span>
            </div>

            <div className="workshop-grid opacity-90">
              {draftProjects.map(p => (
                <div key={p.id} onClick={() => openStudio(p)}>
                  <ProjectCard project={p} onDelete={(e) => { e.stopPropagation(); deleteProject(p.id); }} />
                </div>
              ))}
            </div>
            
            {isCreateOpen && (
              <div className="blueprint-overlay">
                <div className="panel-industrial modal-panel">
                  <h2 className="modal-title">{TERMINOLOGY.GENERAL.INITIATE}</h2>
                  <form onSubmit={handleCreateProject}>
                    <InputGroup placeholder="Project Title..." value={newProjectTitle} onChange={e => setNewProjectTitle(e.target.value)} />
                    <div className="flex-end gap-10 mt-20">
                      <button type="button" className="btn-ghost" onClick={() => setIsCreateOpen(false)}>{TERMINOLOGY.GENERAL.CANCEL}</button>
                      <button type="submit" className="btn-primary">{TERMINOLOGY.GENERAL.CREATE}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeProject && (
        <div className="studio-animate-enter studio-container">
            <div className="file-header-strip">
                <button onClick={() => setActiveProject(null)} className="btn-icon header-close-btn">
                    <Back /> <span className="ml-5 font-bold">{TERMINOLOGY.GENERAL.CLOSE}</span>
                </button>
                <div className="flex-1">
                   <div className="project-id">{TERMINOLOGY.GENERAL.ID_LABEL}: {activeProject.id}</div>
                   <div className="project-title-large">{activeProject.title}</div>
                </div>
                <div className="flex-gap-10">
                    <button onClick={handleSaveProject} className="btn-ghost btn-save"><Save /> {TERMINOLOGY.GENERAL.SAVE}</button>
                    <button onClick={handleCompleteProject} className="btn-primary btn-finalize"><Box /> {TERMINOLOGY.GENERAL.FINALIZE}</button>
                </div>
            </div>

            <div className="studio-layout-wrapper">
                <div className="studio-grid">
                    <div className="studio-col left-col">
                        <div className="panel-industrial studio-panel no-pad overflow-hidden min-h-200">
                             <ImagePlaceholder height="100%" label={TERMINOLOGY.WORKSHOP.REF_VISUAL} />
                        </div>

                        <div className="panel-industrial studio-panel pad-20">
                             <div className="floating-manifest-label text-teal border-teal">{TERMINOLOGY.WORKSHOP.CALIBRATION}</div>
                             <div className="flex-between mb-20 mt-10">
                                 <div>
                                     <div className="label-industrial">{TERMINOLOGY.WORKSHOP.TARGET_RETAIL}</div>
                                     <div className="flex-center gap-5">
                                         <span className="currency-symbol">$</span>
                                         <input className="input-chromeless" type="number" step="0.01" value={activeProject.retailPrice || ''} onChange={(e) => setActiveProject({...activeProject, retailPrice: parseFloat(e.target.value) || 0})} />
                                     </div>
                                 </div>
                                 <div className="text-right">
                                     <div className="label-industrial">{TERMINOLOGY.WORKSHOP.UNIT_COST}</div>
                                     <div className="cost-display">{formatCurrency(totalUnitCost)}</div>
                                 </div>
                             </div>
                             <div className="margin-indicator">
                                 <span className="label-industrial no-margin">{TERMINOLOGY.WORKSHOP.PROJ_MARGIN}</span>
                                 <span className={`margin-value ${projectedMargin > 0 ? 'text-teal' : 'text-alert'}`}>{formatPercent(marginPercentValue)}</span>
                             </div>
                        </div>

                        <div className="panel-industrial studio-panel pad-20 flex-1">
                             <div className="floating-manifest-label">{TERMINOLOGY.WORKSHOP.NOTES_LABEL}</div>
                             <div className="mt-10 h-full">
                               <textarea className="input-area-industrial" placeholder="Observations..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                             </div>
                        </div>

                        <div className="panel-industrial studio-panel pad-20">
                            <div className="floating-manifest-label text-cyan border-cyan">{TERMINOLOGY.WORKSHOP.TAGS_LABEL}</div>
                            <div className="tag-input-area mt-10">
                                {tags.map(t => <div key={t} className="unit-badge"><span>{t}</span></div>)}
                                <input className="input-chromeless tag-input" placeholder="+ Tag..." value={newTagInput} onChange={e => setNewTagInput(e.target.value)} onKeyDown={addTag} />
                            </div>
                        </div>
                    </div>

                    <div className="studio-col right-col">
                        <div className="panel-industrial studio-panel no-pad min-h-250">
                            <div className="floating-manifest-label text-blue border-blue">{TERMINOLOGY.WORKSHOP.MISSIONS_HEADER}</div>
                            <div className="mission-input-area mt-10">
                                <input className="input-industrial" placeholder="+ Milestone..." value={newMissionTitle} onChange={e => setNewMissionTitle(e.target.value)} onKeyDown={addMission} />
                            </div>
                            <div className="checklist-container">
                                {missions.map(m => (
                                    <div key={m.id} className={`checklist-item ${m.status === 'completed' ? 'completed' : ''}`}>
                                        <div onClick={() => setMissions(missions.map(x => x.id === m.id ? {...x, status: x.status === 'completed' ? 'pending' : 'completed'} : x))} className="checklist-click-area">
                                            <div className="checkbox-industrial">{m.status === 'completed' && <div className="check-mark"/>}</div>
                                            <span className="mission-text">{m.title}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="panel-industrial studio-panel no-pad flex-col flex-1">
                            <div className="floating-manifest-label text-purple border-purple">{TERMINOLOGY.WORKSHOP.BOM_HEADER}</div>
                            <div className="bom-toolbar mt-10">
                                <select className="input-industrial" value={newIngredientId} onChange={e => setNewIngredientId(e.target.value)}>
                                    <option value="">+ Select Material...</option>
                                    {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                                <button onClick={addIngredient} className="btn-primary">{TERMINOLOGY.GENERAL.ADD}</button>
                            </div>
                            <div className="bom-body">
                                {recipe.map(r => {
                                    const unitOptions = getUnitOptions(r.unit);
                                    return (
                                        <div key={r.id} className="bom-row">
                                            <div className="bom-name">{r.name}</div>
                                            <div className="bom-qty-group">
                                                <input className="input-chromeless bom-qty-input" type="number" value={r.reqPerUnit} onChange={e => setRecipe(recipe.map(x => x.id === r.id ? {...x, reqPerUnit: e.target.value} : x))} />
                                                <select className="input-chromeless" value={r.unit} onChange={e => setRecipe(recipe.map(x => x.id === r.id ? {...x, unit: e.target.value} : x))}>
                                                    {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                                                </select>
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

      {!activeProject && (
        <div className="sidebar-col">
             <div className="keyword-header sidebar-header-pad">
                <h3 className="label-industrial glow-purple">{TERMINOLOGY.WORKSHOP.VAULT_HEADER}</h3>
                <span className="sidebar-subtitle">{TERMINOLOGY.WORKSHOP.VAULT_SUBTITLE}</span>
             </div>
             <div className="folder-stack">
                {archiveProjects.map((p) => (
                    <div key={p.id} className="folder-stack-item" onClick={() => openStudio(p)}>
                        <ProjectCard project={p} readOnly />
                    </div>
                ))}
             </div>
        </div>
      )}
    </div>
  );
};