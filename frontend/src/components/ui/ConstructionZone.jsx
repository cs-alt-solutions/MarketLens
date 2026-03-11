/* src/components/ui/ConstructionZone.jsx */
import React from 'react';
import { WorkshopIcon } from '../Icons';
import { MESSAGES } from '../../utils/glossary';
import './ConstructionZone.css';

export const ConstructionZone = ({ 
  title = MESSAGES.CONSTRUCTION_TITLE, 
  message = MESSAGES.CONSTRUCTION_DESC 
}) => {
  return (
    <div className="construction-zone-container animate-fade-in">
       {/* Top Caution Tape */}
       <div className="caution-tape-bar"></div>
       
       <div className="construction-content flex-col flex-center text-center">
          <div className="icon-pulse text-neon-orange mb-20">
             <WorkshopIcon />
          </div>
          
          <h2 className="font-mono text-neon-orange tracking-wide mb-10 text-large">
             {title}
          </h2>
          
          <p className="text-muted max-w-400 line-height-relaxed font-small">
             {message}
          </p>
       </div>

       {/* Bottom Caution Tape */}
       <div className="caution-tape-bar"></div>
    </div>
  );
};