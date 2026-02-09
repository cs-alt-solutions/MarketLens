import React, { useState } from 'react';
import { ProjectCard } from '../../components/ProjectCard';
import { MOCK_PROJECTS, MOCK_SECTOR_INTEL } from '../../data/mockData';

// Styles - Reusing the Console Layout for consistency
import './ConsoleLayout.css'; 
import './MissionModal.css';

export const WorkbenchBoard = () => {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [sectorIntel] = useState(MOCK_SECTOR_INTEL);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      created_at: new Date().toISOString(),
      missions: []
    };

    setProjects([newProject, ...projects]);
    setNewProjectTitle('');
    setIsModalOpen(false);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm("Delete this project?")) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  return (
    <div>
      {/* 1. HEADER SECTION */}
      <div className="module-header">
        <span>🧪 MY WORKSPACE // LABORATORY</span>
        <span>ACTIVE PROJECTS: <span className="text-success">{projects.length}</span></span>
      </div>

      {/* 2. INTEL TICKER */}
      <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          padding: '15px', 
          borderLeft: '4px solid var(--accent-primary)',
          marginBottom: '30px',
          fontSize: '0.9rem',
          color: 'var(--text-muted)'
      }}>
        <strong style={{ color: 'white' }}>SECTOR INTEL:</strong> {sectorIntel.seasonal} 
        <span style={{ marginLeft: '15px', color: 'var(--accent-primary)' }}>
           Trending: {sectorIntel.trending.join(', ')}
        </span>
      </div>

      {/* 3. NEW PROJECT BUTTON */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
         <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={() => setIsModalOpen(true)}>
            + Initialize Project
         </button>
      </div>

      {/* 4. THE CARDS (This was missing!) */}
      {/* We use a specific wrapper style here to handle the 3D flip height issues */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '25px',
        paddingBottom: '50px' 
      }}>
        {projects.map((project) => (
          <div key={project.id} className="project-card-wrapper">
             <ProjectCard 
               project={project}
               onDelete={() => handleDeleteProject(project.id)}
             />
          </div>
        ))}
      </div>

      {/* 5. MODAL (Pop-up) */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ color: 'var(--accent-primary)', marginTop: 0 }}>New Research Mission</h2>
            <form onSubmit={handleCreateProject}>
              <input 
                type="text" 
                placeholder="Target Product Name..." 
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                autoFocus
                className="cost-input" 
                style={{ marginBottom: '20px' }}
              />
              <div className="modal-actions">
                <button type="button" className="btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Initialize</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};