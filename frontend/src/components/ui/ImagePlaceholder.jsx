/* src/components/ui/ImagePlaceholder.jsx */
import React from 'react';
/* PATH RECALIBRATED: Icons is one level up */
import { Image } from '../Icons'; 
import './ImagePlaceholder.css';

export const ImagePlaceholder = ({ text = "NO IMAGE DATA" }) => {
  return (
    <div className="image-placeholder-container">
      <Image className="placeholder-icon" />
      <span className="placeholder-text font-mono">{text}</span>
      <div className="corner-accents" />
    </div>
  );
};
