import React, { useState } from 'react';
import './ConsoleLayout.css';

export const ProfitMatrix = () => {
  // State for the Calculator
  const [salePrice, setSalePrice] = useState(120);
  const [materialCost, setMaterialCost] = useState(45);
  const [shippingCost, setShippingCost] = useState(8.50);

  // Auto-calculate Logic
  const etsyFee = salePrice * 0.095; // Approx 9.5%
  const profit = salePrice - materialCost - shippingCost - etsyFee;
  const margin = (profit / salePrice) * 100;

  return (
    <div>
      <div className="module-header">
        <span>💰 PROFIT MATRIX // CALCULATOR</span>
        <span>MODE: <span className="status-sim">SIMULATION</span></span>
      </div>

      <div className="profit-container">
        
        {/* LEFT COLUMN: INPUTS */}
        <div className="profit-card">
          <h4 className="section-title" style={{ marginTop: 0 }}>Project Metrics</h4>
          
          <div style={{ marginBottom: '15px' }}>
            <label className="metric-label">Target Sale Price ($)</label>
            <input 
              type="number" 
              className="cost-input" 
              value={salePrice} 
              onChange={(e) => setSalePrice(Number(e.target.value))}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label className="metric-label">Material Cost ($)</label>
            <input 
              type="number" 
              className="cost-input" 
              value={materialCost}
              onChange={(e) => setMaterialCost(Number(e.target.value))}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label className="metric-label">Est. Shipping ($)</label>
            <input 
              type="number" 
              className="cost-input" 
              value={shippingCost}
              onChange={(e) => setShippingCost(Number(e.target.value))}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: THE VERDICT */}
        <div className="profit-card" style={{ borderColor: profit > 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
          <h4 className="section-title" style={{ marginTop: 0 }}>Net Profit Analysis</h4>
          
          <div className="data-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '20px' }}>
            <div className="metric-box">
              <div className="metric-value" style={{ fontSize: '1.5rem' }}>${etsyFee.toFixed(2)}</div>
              <div className="metric-label">Etsy Fees (Est)</div>
            </div>
            <div className="metric-box">
              <div className="metric-value" style={{ fontSize: '1.5rem' }}>${(materialCost + shippingCost).toFixed(2)}</div>
              <div className="metric-label">Total Costs</div>
            </div>
          </div>

          <div className="metric-box" style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '20px' }}>
            <div className="metric-value text-success" style={{ color: profit > 0 ? '#00ff9d' : '#ff4444' }}>
              ${profit.toFixed(2)}
            </div>
            <div className="metric-label">NET PROFIT ({margin.toFixed(1)}% Margin)</div>
          </div>
        </div>

      </div>
    </div>
  );
};