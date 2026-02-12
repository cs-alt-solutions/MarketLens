/* src/components/feedback/BootScreen.jsx */
import React, { useState, useEffect } from 'react';
import { TERMINOLOGY } from '../../utils/glossary';
import './BootScreen.css';

export const BootScreen = ({ onComplete }) => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const bootText = [
      TERMINOLOGY.BOOT.KERNEL,
      TERMINOLOGY.BOOT.MARKET,
      TERMINOLOGY.BOOT.SECURE,
      TERMINOLOGY.BOOT.ASSETS,
      TERMINOLOGY.BOOT.GRANTED
    ];

    let delay = 0;
    bootText.forEach((text) => {
      delay += Math.random() * 400 + 200; 
      setTimeout(() => {
        setLines(prev => [...prev, text]);
      }, delay);
    });

    setTimeout(onComplete, 2500);
  }, [onComplete]);

  return (
    <div className="boot-container">
      <div className="boot-terminal">
        {lines.map((line, i) => (
          <div key={i} className="boot-line">
            {`> ${line}`}
          </div>
        ))}
        <div className="cursor-blink"></div>
      </div>
    </div>
  );
};
