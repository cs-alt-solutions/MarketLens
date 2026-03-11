/* src/components/ui/ConstructionZone.jsx */
import React from 'react';
import { HardHat } from '../Icons'; // 🚀 IMPORTED THE NEW ICON
import { MESSAGES } from '../../utils/glossary';
import './ConstructionZone.css';

export const ConstructionZone = ({ 
  title = MESSAGES.CONSTRUCTION_TITLE, 
  message = MESSAGES.CONSTRUCTION_DESC 
}) => {
  return (
    <div className="construction-zone-container">
       <div className="caution-tape-bar"></div>
       
       <div className="construction-content flex-col flex-center text-center">
          <div className="icon-pulse mb-20">
             <HardHat /> {/* 🚀 DEPLOYED THE HARD HAT */}
          </div>
          
          <h2 className="font-mono text-neon-orange tracking-wide mb-10 text-large">
             {title}
          </h2>
          
          <p className="text-muted line-height-relaxed font-small m-0">
             {message}
          </p>
       </div>

       <div className="caution-tape-bar"></div>
    </div>
  );
};