import React, { useState } from 'react';
import { TERMINOLOGY } from '../utils/glossary';
import './VaultFolder.css';

export const VaultFolder = ({ title, count, items, onItemClick, stampText }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (items.length === 0) return null;

  return (
    <div className={`vault-folder-root ${isOpen ? 'is-open' : ''}`}>
      <div className="vault-main-folder" onClick={() => setIsOpen(!isOpen)}>
        <div className="folder-tab-top">
          <span className="folder-id-tag">{TERMINOLOGY.GENERAL.CATEGORY}</span>
        </div>
        <div className="folder-cover-body">
          <div className="folder-stamp-large">{stampText}</div>
          <div className="folder-info">
            <h3 className="folder-title-reusable">{title}</h3>
            <span className="folder-count">{count} {TERMINOLOGY.GENERAL.UNITS}</span>
          </div>
          <div className={`folder-chevron ${isOpen ? 'up' : ''}`}>▼</div>
        </div>
      </div>
      {isOpen && (
        <div className="vault-folder-grid animate-fade-in">
          {items.map(m => (
            <div key={m.id} className="mini-vault-card" onClick={() => onItemClick(m)}>
               <div className="mini-card-meta">
                  <div className="mini-card-title">{m.name}</div>
                  <div className="mini-card-id">{m.qty} {m.unit}</div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};