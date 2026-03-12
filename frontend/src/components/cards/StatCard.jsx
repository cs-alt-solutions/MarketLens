/* src/components/cards/StatCard.jsx */
import React from 'react';
import './StatCard.css';

export const StatCard = ({ label, value, glowColor = 'teal', showBeacon = false, beaconType = '' }) => {
  return (
    <div className={`hud-orb glow-${glowColor}`}>
      {showBeacon && (
        <div className="orb-beacon-container">
           <div className={`beacon-pulse ${beaconType}`}></div>
        </div>
      )}
      <span className="hud-value-orb">{value}</span>
      <span className="hud-label-orb">{label}</span>
    </div>
  );
};