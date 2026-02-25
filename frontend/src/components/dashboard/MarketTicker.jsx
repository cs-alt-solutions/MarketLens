/* src/components/dashboard/MarketTicker.jsx */
import React from 'react';
import './MarketTicker.css';
import { Finance } from '../Icons'; // Adjust this path if needed based on where your Icons are

export const MarketTicker = ({ items = [] }) => {
  // DEBUGGER: This will tell us if the data is actually reaching the component
  console.log("TICKER DATA INBOUND:", items);

  // If there is no data, show a highly visible warning
  if (!items || items.length === 0) {
    return (
      <div className="ticker-panel panel-industrial p-10 text-alert font-mono">
        NO TICKER DATA FEED DETECTED
      </div>
    );
  }

  // ARCHITECTURE RULE 6: Duplicate items for seamless infinite scroll
  const scrollItems = [...items, ...items];

  return (
    <div className="ticker-panel panel-industrial">
      <div className="ticker-label">
        <Finance /> STREET PRICES //
      </div>
      <div className="ticker-wrap">
        <div className="ticker-move">
          {scrollItems.map((item, idx) => {
            const displayName = item.label || item.symbol || 'UNKNOWN';
            
            return (
              <div key={`ticker-${idx}`} className="ticker-item">
                <span className="text-muted uppercase font-tiny">{displayName}</span> 
                <span className={`font-mono ml-10 ${
                  item.trend === 'up' ? 'text-good' : 
                  item.trend === 'down' ? 'text-alert' : 'text-main'
                }`}>
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};