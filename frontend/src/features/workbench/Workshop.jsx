/* src/features/workbench/Workshop.jsx */
import React, { useState, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { TERMINOLOGY, APP_CONFIG, MESSAGES } from '../../utils/glossary';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { ProjectWizard } from './components/wizard/ProjectWizard';
import { ProjectConsole } from './components/wizard/ProjectConsole'; // 🚀 Added our new Console component
import { Plus, WorkshopIcon, Box, DashboardIcon } from '../../components/Icons';
import './Workshop.css';

export const Workshop = () => {
  // Pulling engine_pipeline_stats directly from context to avoid UI math
  const { 
    activeProjects, 
    draftProjects, 
    deleteProject,
    engine_pipeline_stats 
  } = useInventory(); 
  
  const [viewMode, setViewMode] = useState('PIPELINE'); 
  const [activeTab, setActiveTab] = useState('FLEET'); 
  const [selectedProject, setSelectedProject] = useState(null);

  const allProjects = useMemo(() => {
      return [...(activeProjects || []), ...(draftProjects || [])];
  }, [activeProjects, draftProjects]);

  // We normalize to lowercase to catch "Draft", "draft", "IDEA", etc.
  // We also include legacy database statuses to ensure full visibility.
  const ideas = allProjects.filter(p => p.status?.toLowerCase() === 'idea');
  
  const drafts = allProjects.filter(p => 
      !p.status || ['draft', 'planning'].includes(p.status.toLowerCase())
  );
  
  const activeOps = allProjects.filter(p => 
      ['active', 'in progress', 'completed'].includes(p.status?.toLowerCase())
  );

  const handleNewProject = () => {
    // 🚀 We apply the 'isNew: true' flag here to trigger the Wizard fork
    const ghostTemplate = {
      isNew: true, 
      title: "",
      status: 'idea', 
      stockQty: 0,
      retailPrice: 0,
      economics: {
        targetRetail: 0,
        demand_score: APP_CONFIG.PROJECT.INITIAL_DEMAND,
        competition_score: APP_CONFIG.PROJECT.INITIAL_COMPETITION,
      },
      recipe: []
    };
    setSelectedProject(ghostTemplate);
  };

  const handleDeleteProject = async (id) => {
    const confirmed = window.confirm(MESSAGES.CONFIRM_DELETE_PROJECT);
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
                  <div className="empty-state text-muted italic pad-20">{MESSAGES.EMPTY_PIPELINE_PHASE}</div>
              )}
          </div>
      </div>
  );

  return (
    <div className="workshop-container">
      <div className="inventory-header">
        <div>
          <h2 className="header-title">{TERMINOLOGY.WORKSHOP.HUB_HEADER}</h2>
          <span className="header-subtitle">{TERMINOLOGY.WORKSHOP.HUB_SUBTITLE}</span>
        </div>
        <div className="flex-center gap-15">
          <div className="view-toggle-bg flex-center border-radius-2 overflow-hidden border-subtle">
             <button 
                 className={`view-btn ${viewMode === 'PIPELINE' ? 'active bg-panel' : 'text-muted'}`}
                 onClick={() => setViewMode('PIPELINE')}
                 title={TERMINOLOGY.WORKSHOP.VIEW_KANBAN}
             >
                 <DashboardIcon />
             </button>
             <button 
                 className={`view-btn ${viewMode === 'FOCUS' ? 'active bg-panel' : 'text-muted'}`}
                 onClick={() => setViewMode('FOCUS')}
                 title={TERMINOLOGY.WORKSHOP.VIEW_FOCUS}
             >
                 <WorkshopIcon />
             </button>
          </div>

          <button className="btn-primary flex-center gap-10" onClick={handleNewProject}>
            <Plus /> {TERMINOLOGY.WORKSHOP.BTN_LAUNCH_WIZARD}
          </button>
        </div>
      </div>

      <div className="progress-pipeline mb-20">
          <div className="flex-between font-small font-mono text-muted mb-5">
              <span>{ideas.length} {TERMINOLOGY.WORKSHOP.LABEL_IDEAS}</span>
              <span>{drafts.length} {TERMINOLOGY.WORKSHOP.LABEL_DRAFTS}</span>
              <span className="text-neon-teal">{activeOps.length} {TERMINOLOGY.WORKSHOP.LABEL_ACTIVE}</span>
          </div>
          <div className="pipeline-bar-wrapper">
              <div className="pipeline-segment bg-purple" style={{ width: `${engine_pipeline_stats?.ideaPercent || 0}%` }} title={TERMINOLOGY.WORKSHOP.LABEL_IDEAS}></div>
              <div className="pipeline-segment bg-warning" style={{ width: `${engine_pipeline_stats?.draftPercent || 0}%` }} title={TERMINOLOGY.WORKSHOP.LABEL_DRAFTS}></div>
              <div className="pipeline-segment bg-teal" style={{ width: `${engine_pipeline_stats?.activePercent || 0}%` }} title={TERMINOLOGY.WORKSHOP.LABEL_ACTIVE}></div>
          </div>
      </div>

      {viewMode === 'PIPELINE' ? (
          <div className="pipeline-grid">
              {renderPipelineColumn(TERMINOLOGY.WORKSHOP.COL_IDEAS, ideas.length, ideas, 'col-purple')}
              {renderPipelineColumn(TERMINOLOGY.WORKSHOP.COL_DRAFTS, drafts.length, drafts, 'col-warning')}
              {renderPipelineColumn(TERMINOLOGY.WORKSHOP.COL_ACTIVE, activeOps.length, activeOps, 'col-teal')}
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
                  <Box /> {TERMINOLOGY.WORKSHOP.TAB_LAB} ({ideas.length + drafts.length})
                </button>
              </div>

              <div key={activeTab} className="workshop-grid studio-animate-enter">
                {activeTab === 'FLEET' ? (
                   activeOps.length > 0 ? activeOps.map(p => (
                       <ProjectCard key={p.id} project={p} onClick={() => setSelectedProject(p)} onDelete={handleDeleteProject} />
                   )) : <div className="empty-state text-muted italic pad-20">{MESSAGES.EMPTY_FLEET}</div>
                ) : (
                   [...ideas, ...drafts].length > 0 ? [...ideas, ...drafts].map(p => (
                       <ProjectCard key={p.id} project={p} onClick={() => setSelectedProject(p)} onDelete={handleDeleteProject} />
                   )) : <div className="empty-state text-muted italic pad-20">{MESSAGES.EMPTY_LAB}</div>
                )}
              </div>
          </>
      )}

      {/* 🚀 THE ARCHITECTURAL FORK: Route clicks seamlessly */}
      {selectedProject && selectedProject.isNew ? (
        <ProjectWizard 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      ) : selectedProject ? (
        <ProjectConsole 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      ) : null}
    </div>
  );
};