/* src/components/MarketTicker.jsx */
import React from 'react';
import './MarketTicker.css';
import { Finance } from './Icons';

export const MarketTicker = ({ items = [] }) => {
  // ARCHITECTURE RULE 6: Duplicate items for seamless infinite scroll
  const scrollItems = [...items, ...items];

  return (
    <div className="ticker-panel panel-industrial">
      <div className="ticker-label">
        <Finance /> STREET PRICES //
      </div>
      <div className="ticker-wrap">
        <div className="ticker-move">
          {scrollItems.map((item, idx) => (
            <div key={`${item.label}-${idx}`} className="ticker-item">
              <span className="text-muted uppercase font-tiny">{item.label}</span> 
              <span className={`font-mono ml-10 ${
                item.trend === 'up' ? 'text-good' : 
                item.trend === 'down' ? 'text-alert' : 'text-main'
              }`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};