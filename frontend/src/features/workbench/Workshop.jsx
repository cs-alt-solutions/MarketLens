import React, { useState } from 'react';
import './Workshop.css';
import { useInventory } from '../../context/InventoryContext';
import { ProjectCard } from '../../components/ProjectCard';
import { StampHeader } from '../../components/StampHeader'; // IMPORT NEW COMPONENT
import { TERMINOLOGY } from '../../utils/glossary';

export const Workshop = ({ onRequestFullWidth }) => {
  const { projects, deleteProject, addProject } = useInventory();
  
  // Filter projects by status
  const activeProjects = projects.filter(p => p.status === 'active');
  const draftProjects = projects.filter(p => p.status === 'draft');
  const completedProjects = projects.filter(p => p.status === 'completed');

  // Simple handler for creating a new project (stub)
  const handleCreateNew = () => {
    addProject({
      title: "New Untitled Project",
      status: "draft",
      retailPrice: 0,
      stockQty: 0
    });
  };

  return (
    <div className="workshop-container radar-scroll-area">
      
      {/* HEADER AREA */}
      <div className="flex-between mb-20">
        <div>
          <h2 className="header-title">{TERMINOLOGY.WORKSHOP.HUB_HEADER}</h2>
          <span className="header-subtitle">{TERMINOLOGY.WORKSHOP.HUB_SUBTITLE}</span>
        </div>
        <button className="btn-primary" onClick={handleCreateNew}>
           + {TERMINOLOGY.WORKSHOP.NEW_PROJECT}
        </button>
      </div>

      {/* --- SECTION 1: IN PROGRESS --- */}
      {/* Replaced text header with STAMP HEADER */}
      <StampHeader status="active" label={TERMINOLOGY.STATUS.ACTIVE} />

      <div className="workshop-grid">
        {activeProjects.length > 0 ? (
          activeProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onDelete={() => deleteProject(project.id)}
              showStatus={false} /* Stamp is now in the header */
            />
          ))
        ) : (
          <div className="empty-state-message">
            {TERMINOLOGY.GENERAL.NO_DATA}
          </div>
        )}
      </div>

      {/* --- SECTION 2: DRAFTS --- */}
      {/* Replaced "Saved Concepts" text with STAMP HEADER (Draft) */}
      <StampHeader status="draft" label={TERMINOLOGY.STATUS.DRAFT} />

      <div className="workshop-grid">
        {draftProjects.length > 0 ? (
          draftProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onDelete={() => deleteProject(project.id)}
              showStatus={false} /* Stamp is now in the header */
            />
          ))
        ) : (
          <div className="empty-state-message">
            {TERMINOLOGY.GENERAL.NO_DATA}
          </div>
        )}
      </div>

      {/* --- SECTION 3: THE VAULT (Completed) --- */}
      {/* We can keep The Vault as a text header if desired, or use the stamp too.
          Given "The Vault" is a specific place name, I'll stick to text unless you want "CATALOGED" stamp.
          But let's use the stamp for consistency if you prefer "CATALOGED". 
          For now, I will leave the Vault header as it is distinct, but let me know if you want "CATALOGED" stamp here too. */}
      
      <div className="section-separator mt-20">
          <span className="separator-label text-muted">{TERMINOLOGY.WORKSHOP.VAULT_HEADER}</span>
          <div className="separator-line" />
      </div>

      <div className="workshop-grid">
        {completedProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              readOnly={true}
              /* For completed items, maybe we keep the stamp? Or hide it? 
                 Let's hide it for consistency if they are grouped here. */
              showStatus={false} 
            />
        ))}
      </div>

    </div>
  );
};