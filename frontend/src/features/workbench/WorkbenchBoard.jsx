import React, { useState } from 'react';
import { ProjectCard } from '../../components/ProjectCard';
import { ProjectBlueprint } from './ProjectBlueprint'; 
import { MOCK_PROJECTS, MOCK_SECTOR_INTEL } from '../../data/mockData';
import './WorkbenchBoard.css'; // Minimal spacing styles only

export const WorkbenchBoard = () => {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [sectorIntel] = useState(MOCK_SECTOR_INTEL);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null); 
  const [newProjectTitle, setNewProjectTitle] = useState('');

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;
    const newProject = {
      id: Date.now(),
      title: newProjectTitle,
      status: 'active',
      demand: 'High', 
      competition: 'Low',
      tags: [],
      description: '',
      created_at: new Date().toISOString(),
      missions: []
    };
    setProjects([newProject, ...projects]);
    setNewProjectTitle('');
    setIsCreateOpen(false);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm("Delete this project?")) {
      setProjects(projects.filter(p => p.id !== projectId));
      if (selectedProject?.id === projectId) setSelectedProject(null);
    }
  };

  const handleUpdateProject = (updatedProject) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  return (
    <div className="radar-grid-layout">
      <div className="radar-scroll-area" style={{ gridColumn: '1 / -1' }}>
        
        {/* HEADER */}
        <div className="workbench-header">
          <div>
            <h2 className="header-title">WORKBENCH</h2>
            <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>ACTIVE MISSIONS: {projects.length}</span>
          </div>
          <button className="btn-primary" onClick={() => setIsCreateOpen(true)}>+ NEW MISSION</button>
        </div>

        {/* INTEL TICKER */}
        <div className="intel-ticker panel-industrial">
          <div style={{color:'var(--neon-orange)', fontSize:'0.85rem', fontWeight:'600', letterSpacing:'0.5px'}}>
            SECTOR INTEL: {sectorIntel.seasonal} • TRENDING: {sectorIntel.trending.join(', ')} •
          </div>
        </div>

        {/* PROJECT GRID */}
        <div className="project-grid">
          {projects.map((project) => (
             <div key={project.id} onClick={() => setSelectedProject(project)}>
               <ProjectCard 
                 project={project} 
                 onDelete={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }} 
               />
             </div>
          ))}
        </div>

        {/* CREATE MODAL (Simple Inline Overlay) */}
        {isCreateOpen && (
          <div className="blueprint-overlay" style={{justifyContent:'center', alignItems:'center'}}>
            <div className="panel-industrial" style={{width:'400px', padding:'30px', zIndex:2001}}>
              <h2 style={{ color: 'var(--neon-orange)', marginTop: 0, fontSize:'1.2rem' }}>NEW RESEARCH MISSION</h2>
              <form onSubmit={handleCreateProject}>
                <input 
                  type="text" 
                  placeholder="Target Product Name..." 
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  autoFocus
                  className="input-industrial"
                  style={{ marginBottom: '20px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn-ghost" onClick={() => setIsCreateOpen(false)}>CANCEL</button>
                  <button type="submit" className="btn-primary">INITIALIZE</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* BLUEPRINT SLIDE-OVER */}
        {selectedProject && (
          <ProjectBlueprint 
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onSave={handleUpdateProject}
          />
        )}

      </div>
    </div>
  );
};