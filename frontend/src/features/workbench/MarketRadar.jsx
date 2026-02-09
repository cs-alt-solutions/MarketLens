import React, { useState } from 'react';
import './ConsoleLayout.css'; // Reusing your shared styles

export const MarketRadar = () => {
  const [viewMode, setViewMode] = useState('scanner'); // 'scanner' or 'showroom'

  // MOCK DATA for Phase 1
  const marketData = [
    { id: 1, title: "Steampunk Gear Lamp", price: 125.00, views: 1204, favs: 150, saturation: "High" },
    { id: 2, title: "Leather Grimoire", price: 85.00, views: 3400, favs: 890, saturation: "Med" },
    { id: 3, title: "Brass Goggles", price: 45.00, views: 850, favs: 45, saturation: "Low" },
  ];

  return (
    <div>
      <div className="module-header">
        <span>📡 MARKET RADAR // SURVEILLANCE</span>
        <span>STATUS: <span className="status-live">LIVE MOCK</span></span>
      </div>

      {/* CONTROLS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Enter keyword (e.g. 'Steampunk')..." 
          className="cost-input"
          style={{ maxWidth: '300px' }}
        />
        <button className="btn-ghost" onClick={() => setViewMode('scanner')}>Scanner View</button>
        <button className="btn-ghost" onClick={() => setViewMode('showroom')}>Showroom View</button>
      </div>

      {/* VIEW: SCANNER (TABLE) */}
      {viewMode === 'scanner' && (
        <table className="cost-table">
          <thead>
            <tr>
              <th>Item Title</th>
              <th>Price</th>
              <th>Views</th>
              <th>Favs</th>
              <th>Competition</th>
            </tr>
          </thead>
          <tbody>
            {marketData.map(item => (
              <tr key={item.id}>
                <td style={{ color: 'white', fontWeight: 'bold' }}>{item.title}</td>
                <td className="text-success">${item.price.toFixed(2)}</td>
                <td>{item.views}</td>
                <td>{item.favs}</td>
                <td><span className="uplink-badge">{item.saturation}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* VIEW: SHOWROOM (GRID) */}
      {viewMode === 'showroom' && (
        <div className="ops-grid">
          {marketData.map(item => (
            <div key={item.id} className="ops-card">
              <div className="ops-card-header">
                <span className="ops-title">{item.title}</span>
                <span className="text-success">${item.price}</span>
              </div>
              <div className="ops-meta">
                <span>❤️ {item.favs} favorites</span>
                <span>👁️ {item.views} views</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};