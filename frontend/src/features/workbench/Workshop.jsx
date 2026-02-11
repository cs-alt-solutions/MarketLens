import React, { useState, useEffect, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext'; 
import { ProjectCard } from '../../components/ProjectCard';
import { ImagePlaceholder } from '../../components/ImagePlaceholder';
import { InputGroup } from '../../components/InputGroup'; 
import { Plus, Back, Save, Box } from '../../components/Icons'; 
import { formatCurrency, formatPercent } from '../../utils/formatters'; 
import { TERMINOLOGY } from '../../utils/glossary';
import './Workshop.css';

// --- SUB-COMPONENT: VAULT FOLDERS ---
const VaultFolder = ({ title, status, projects, onProjectClick, stampText }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (projects.length === 0) return null;

  return (
    <div className={`vault-folder-root ${isOpen ? 'is-open' : ''}`}>
      <div className="vault-main-folder" onClick={() => setIsOpen(!isOpen)}>
        <div className="folder-tab-top">
          <span className="folder-id-tag">{status.toUpperCase()} {TERMINOLOGY.GENERAL.SYSTEMS_LABEL}</span>
        </div>
        <div className="folder-cover-body">
          <div className="folder-stamp-large">{stampText}</div>
          <div className="folder-info">
            <h3 className="folder-title">{title}</h3>
            <span className="folder-count">{projects.length} {TERMINOLOGY.GENERAL.SYSTEMS_LABEL}</span>
          </div>
          <div className={`folder-chevron ${isOpen ? 'up' : ''}`}>▼</div>
        </div>
      </div>

      {isOpen && (
        <div className="vault-folder-grid animate-fade-in">
          {projects.map(p => (
            <div key={p.id} className="mini-vault-card" onClick={() => onProjectClick(p)}>
               <div className="mini-card-preview">
                  <ImagePlaceholder height="80px" label="" />
               </div>
               <div className="mini-card-meta">
                  <div className="mini-card-title">{p.title}</div>
                  <div className="mini-card-id">{TERMINOLOGY.GENERAL.ID_LABEL}: {p.id.toString().slice(-4)}</div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
  
  const catalogedProjects = useMemo(() => projects.filter(p => p.status === 'completed'), [projects]);
  const suspendedProjects = useMemo(() => projects.filter(p => p.status === 'on_hold'), [projects]);

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

  const updateRecipeUsage = (id, field, val) => {
    setRecipe(recipe.map(r => r.id === id ? { ...r, [field]: val } : r));
  };

  const removeIngredient = (id) => {
    setRecipe(recipe.filter(r => r.id !== id));
  };

  const addMission = (e) => {
    if (e.key === 'Enter' && newMissionTitle.trim()) {
        e.preventDefault();
        setMissions([...missions, { id: Date.now(), title: newMissionTitle, status: 'pending' }]);
        setNewMissionTitle('');
    }
  };

  const toggleMission = (id) => {
    setMissions(missions.map(m => m.id === id ? { ...m, status: m.status === 'completed' ? 'pending' : 'completed' } : m));
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
               <span className="separator-count active">{activeProjects.length} {TERMINOLOGY.WORKSHOP.ACTIVE_OPS}</span>
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
               <span className="separator-count">{draftProjects.length} {TERMINOLOGY.WORKSHOP.DRAFTS}</span>
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
                  <h2 className="modal-title">{TERMINOLOGY.WORKSHOP.NEW_PROJECT}</h2>
                  <form onSubmit={handleCreateProject}>
                    <InputGroup placeholder={TERMINOLOGY.GENERAL.ID_LABEL} value={newProjectTitle} onChange={e => setNewProjectTitle(e.target.value)} />
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
                               <textarea className="input-area-industrial" placeholder={TERMINOLOGY.WORKSHOP.NOTES_LABEL} value={notes} onChange={(e) => setNotes(e.target.value)} />
                             </div>
                        </div>

                        <div className="panel-industrial studio-panel pad-20">
                            <div className="floating-manifest-label text-cyan border-cyan">{TERMINOLOGY.WORKSHOP.TAGS_LABEL}</div>
                            <div className="tag-input-area mt-10">
                                {tags.map(t => <div key={t} className="unit-badge"><span>{t}</span></div>)}
                                <input className="input-chromeless tag-input" placeholder={TERMINOLOGY.GENERAL.ADD} value={newTagInput} onChange={e => setNewTagInput(e.target.value)} onKeyDown={addTag} />
                            </div>
                        </div>
                    </div>

                    <div className="studio-col right-col">
                        <div className="panel-industrial studio-panel no-pad min-h-250">
                            <div className="floating-manifest-label text-blue border-blue">{TERMINOLOGY.WORKSHOP.MISSIONS_HEADER}</div>
                            <div className="mission-input-area mt-10">
                                <input className="input-industrial" placeholder={TERMINOLOGY.GENERAL.ADD} value={newMissionTitle} onChange={e => setNewMissionTitle(e.target.value)} onKeyDown={addMission} />
                            </div>
                            <div className="checklist-container">
                                {missions.map(m => (
                                    <div key={m.id} className={`checklist-item ${m.status === 'completed' ? 'completed' : ''}`}>
                                        <div onClick={() => toggleMission(m.id)} className="checklist-click-area">
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
                                    <option value="">{TERMINOLOGY.GENERAL.ADD}...</option>
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
                                                <input className="input-chromeless bom-qty-input" type="number" value={r.reqPerUnit} onChange={e => updateRecipeUsage(r.id, 'reqPerUnit', e.target.value)} />
                                                <select className="input-chromeless" value={r.unit} onChange={e => updateRecipeUsage(r.id, 'unit', e.target.value)}>
                                                    {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                                                </select>
                                            </div>
                                            <button onClick={() => removeIngredient(r.id)} className="btn-icon-hover text-alert">×</button>
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
             
             <div className="folder-stack-v2">
                <VaultFolder 
                  title={TERMINOLOGY.WORKSHOP.VAULT_HEADER} 
                  status="cataloged" 
                  stampText="CATALOGED"
                  projects={catalogedProjects}
                  onProjectClick={openStudio}
                />

                <VaultFolder 
                  title={TERMINOLOGY.WORKSHOP.VAULT_SUBTITLE} 
                  status="suspended" 
                  stampText="SUSPENDED"
                  projects={suspendedProjects}
                  onProjectClick={openStudio}
                />
             </div>
        </div>
      )}
    </div>
  );
};