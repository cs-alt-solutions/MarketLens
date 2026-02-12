/* src/components/ImagePlaceholder.jsx */
import React from 'react';
import { Plus } from './Icons';
import './ImagePlaceholder.css';

export const ImagePlaceholder = ({ height = '150px', label = 'ADD PHOTO', onUpload }) => {
  return (
    <div 
      onClick={onUpload}
      className="panel-industrial image-placeholder-container"
      style={{ height }}
    >
      <svg 
        className="placeholder-bg-icon"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>

      <div className="placeholder-active-layer">
        <div className="placeholder-plus-wrapper">
           <Plus />
        </div>
        <span className="placeholder-label">
          {label}
        </span>
      </div>
    </div>
  );
};