/* src/features/workbench/Workshop.jsx */
import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { TERMINOLOGY, APP_CONFIG } from '../../utils/glossary';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { ProjectBlueprint } from './components/ProjectBlueprint';
import { Plus, WorkshopIcon, Box } from '../../components/Icons';
import './Workshop.css';

export const Workshop = () => {
  const { activeProjects, draftProjects, addProject, deleteProject } = useInventory();
  const [activeTab, setActiveTab] = useState('FLEET');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const displayProjects = activeTab === 'FLEET' ? activeProjects : draftProjects;

  const handleNewProject = async () => {
    setIsCreating(true);
    const newBuildTemplate = {
      title: "UNTITLED BUILD",
      status: APP_CONFIG.PROJECT.DEFAULT_STATUS,
      stockQty: 0,
      retailPrice: 0,
      demand: APP_CONFIG.PROJECT.INITIAL_DEMAND,
      competition: APP_CONFIG.PROJECT.INITIAL_COMPETITION,
      tags: [],
      recipe: []
    };

    const createdProject = await addProject(newBuildTemplate);
    setIsCreating(false);

    if (createdProject) {
      setSelectedProject(createdProject);
      setActiveTab('LAB'); 
    }
  };

  const handleDeleteProject = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (confirmed) {
      await deleteProject(id);
      if (selectedProject?.id === id) {
         setSelectedProject(null); 
      }
    }
  };

  return (
    <div className="workshop-container">
      <div className="inventory-header">
        <div>
          <h2 className="header-title">{TERMINOLOGY.WORKSHOP.HUB_HEADER}</h2>
          <span className="header-subtitle">{TERMINOLOGY.WORKSHOP.HUB_SUBTITLE}</span>
        </div>
        <div className="flex-center gap-10">
          <button 
            className="btn-primary flex-center gap-10" 
            onClick={handleNewProject}
            disabled={isCreating}
          >
            <Plus /> {isCreating ? "INITIALIZING..." : TERMINOLOGY.WORKSHOP.NEW_PROJECT}
          </button>
        </div>
      </div>

      <div className="panel-tabs mb-20">
        <button 
          className={`tab-btn ${activeTab === 'FLEET' ? 'active purple' : ''}`}
          onClick={() => setActiveTab('FLEET')}
        >
          <WorkshopIcon /> {TERMINOLOGY.WORKSHOP.TAB_FLEET} ({activeProjects?.length || 0})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'LAB' ? 'active dormant' : ''}`}
          onClick={() => setActiveTab('LAB')}
        >
          <Box /> {TERMINOLOGY.WORKSHOP.TAB_LAB} ({draftProjects?.length || 0})
        </button>
      </div>

      <div className="workshop-grid studio-animate-enter">
        {displayProjects && displayProjects.length > 0 ? (
          displayProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => setSelectedProject(project)} 
              onDelete={handleDeleteProject}
            />
          ))
        ) : (
          <div className="empty-state text-muted italic pad-20">
            {TERMINOLOGY.GENERAL.NO_DATA}
          </div>
        )}
      </div>

      {selectedProject && (
        <ProjectBlueprint 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
};