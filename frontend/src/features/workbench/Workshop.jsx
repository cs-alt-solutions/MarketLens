/* src/features/workbench/Workshop.jsx */
import React, { useState, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { TERMINOLOGY, APP_CONFIG } from '../../utils/glossary';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { ProjectWizard } from './components/wizard/ProjectWizard';
import { Plus, WorkshopIcon, Box, DashboardIcon } from '../../components/Icons';
import './Workshop.css';

export const Workshop = () => {
  const { activeProjects, draftProjects, deleteProject } = useInventory(); 
  
  const [viewMode, setViewMode] = useState('PIPELINE'); 
  const [activeTab, setActiveTab] = useState('FLEET'); 
  const [selectedProject, setSelectedProject] = useState(null);

  const allProjects = useMemo(() => {
      const active = activeProjects || [];
      const drafts = draftProjects || [];
      return [...active, ...drafts];
  }, [activeProjects, draftProjects]);

  const ideas = allProjects.filter(p => p.status === 'idea');
  const drafts = allProjects.filter(p => p.status === 'draft');
  const activeOps = allProjects.filter(p => p.status === 'active');

  const totalProjects = allProjects.length;
  const ideaPercent = totalProjects > 0 ? (ideas.length / totalProjects) * 100 : 0;
  const draftPercent = totalProjects > 0 ? (drafts.length / totalProjects) * 100 : 0;
  const activePercent = totalProjects > 0 ? (activeOps.length / totalProjects) * 100 : 0;

  const handleNewProject = () => {
    const ghostTemplate = {
      isNew: true, 
      title: "",
      status: 'idea', 
      stockQty: 0,
      retailPrice: 0,
      demand: APP_CONFIG.PROJECT.INITIAL_DEMAND,
      competition: APP_CONFIG.PROJECT.INITIAL_COMPETITION,
      tags: [],
      recipe: [],
      instructions: []
    };
    setSelectedProject(ghostTemplate);
  };

  const handleDeleteProject = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (confirmed) {
      await deleteProject(id);
      if (selectedProject?.id === id) setSelectedProject(null); 
    }
  };

  const renderPipelineColumn = (title, count, items, colColor) => (
      <div className={`pipeline-col ${colColor}`}>
          <div className="pipeline-col-header">
              <span className="font-bold">{title}</span>
              <span className="count-badge">{count}</span>
          </div>
          <div className="pipeline-col-body studio-animate-enter">
              {items.length > 0 ? (
                  items.map(project => (
                      <ProjectCard 
                          key={project.id} 
                          project={project} 
                          onClick={() => setSelectedProject(project)} 
                          onDelete={handleDeleteProject}
                          layout="pipeline" 
                      />
                  ))
              ) : (
                  <div className="empty-state text-muted italic pad-20">No projects in this phase.</div>
              )}
          </div>
      </div>
  );

  return (
    <div className="workshop-container">
      <div className="inventory-header">
        <div>
          <h2 className="header-title">{TERMINOLOGY.WORKSHOP.HUB_HEADER}</h2>
          <span className="header-subtitle">Manage your product pipeline</span>
        </div>
        <div className="flex-center gap-15">
          <div className="view-toggle-bg flex-center border-radius-2 overflow-hidden border-subtle">
             <button 
                 className={`view-btn ${viewMode === 'PIPELINE' ? 'active bg-panel' : 'text-muted'}`}
                 onClick={() => setViewMode('PIPELINE')}
                 title="Kanban Board View"
             >
                 <DashboardIcon />
             </button>
             <button 
                 className={`view-btn ${viewMode === 'FOCUS' ? 'active bg-panel' : 'text-muted'}`}
                 onClick={() => setViewMode('FOCUS')}
                 title="Tabbed Focus View"
             >
                 <WorkshopIcon />
             </button>
          </div>

          <button className="btn-primary flex-center gap-10" onClick={handleNewProject}>
            <Plus /> LAUNCH WIZARD
          </button>
        </div>
      </div>

      <div className="progress-pipeline mb-20">
          <div className="flex-between font-small font-mono text-muted mb-5">
              <span>{ideas.length} IDEAS</span>
              <span>{drafts.length} DRAFTING</span>
              <span className="text-neon-teal">{activeOps.length} ACTIVE</span>
          </div>
          <div className="pipeline-bar-wrapper">
              <div className="pipeline-segment bg-purple" style={{ width: `${ideaPercent}%` }} title="Ideas"></div>
              <div className="pipeline-segment bg-warning" style={{ width: `${draftPercent}%` }} title="Drafts"></div>
              <div className="pipeline-segment bg-teal" style={{ width: `${activePercent}%` }} title="Active"></div>
          </div>
      </div>

      {viewMode === 'PIPELINE' ? (
          <div className="pipeline-grid">
              {renderPipelineColumn('THE INCUBATOR (Ideas)', ideas.length, ideas, 'col-purple')}
              {renderPipelineColumn('THE LAB (Drafting)', drafts.length, drafts, 'col-warning')}
              {renderPipelineColumn('THE FLEET (Active)', activeOps.length, activeOps, 'col-teal')}
          </div>
      ) : (
          <>
              <div className="panel-tabs mb-20">
                <button 
                  className={`tab-btn ${activeTab === 'FLEET' ? 'active teal' : ''}`}
                  onClick={() => setActiveTab('FLEET')}
                >
                  <WorkshopIcon /> {TERMINOLOGY.WORKSHOP.TAB_FLEET} ({activeOps.length})
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'LAB' ? 'active dormant' : ''}`}
                  onClick={() => setActiveTab('LAB')}
                >
                  <Box /> DRAFTS & IDEAS ({ideas.length + drafts.length})
                </button>
              </div>

              <div key={activeTab} className="workshop-grid studio-animate-enter">
                {activeTab === 'FLEET' ? (
                   activeOps.length > 0 ? activeOps.map(p => (
                       <ProjectCard key={p.id} project={p} onClick={() => setSelectedProject(p)} onDelete={handleDeleteProject} />
                   )) : <div className="empty-state">No active products.</div>
                ) : (
                   [...ideas, ...drafts].length > 0 ? [...ideas, ...drafts].map(p => (
                       <ProjectCard key={p.id} project={p} onClick={() => setSelectedProject(p)} onDelete={handleDeleteProject} />
                   )) : <div className="empty-state">No ideas in the lab.</div>
                )}
              </div>
          </>
      )}

      {selectedProject && (
        <ProjectWizard 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
};