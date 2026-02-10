import React from 'react';
import './ConsoleLayout.css'; // Inherits grid

export const ProfitMatrix = () => {
  return (
    <div className="radar-grid-layout">
      <div className="radar-scroll-area">
        
        <div className="inventory-header">
          <div>
            <h2 className="header-title">PROFIT MATRIX</h2>
            <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>FINANCIAL HEALTH & MARGINS</span>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="inventory-metrics">
           <div className="metric-card">
             <span className="label-industrial">GROSS REVENUE</span>
             <div className="metric-value glow-teal">$4,250.00</div>
           </div>
           <div className="metric-card">
             <span className="label-industrial">NET PROFIT</span>
             <div className="metric-value glow-purple">$1,840.50</div>
           </div>
           <div className="metric-card">
             <span className="label-industrial">AVG MARGIN</span>
             <div className="metric-value glow-cyan">42%</div>
           </div>
        </div>

        {/* MAIN PANEL */}
        <div className="panel-industrial">
           <div className="panel-header">
             <h3 style={{margin:0, fontSize:'1rem'}}>RECENT TRANSACTIONS</h3>
             <button className="btn-ghost">EXPORT CSV</button>
           </div>
           <div className="panel-content">
             <table className="inventory-table">
               <thead>
                 <tr>
                   <th>DATE</th>
                   <th>SOURCE</th>
                   <th>DESCRIPTION</th>
                   <th className="td-right">AMOUNT</th>
                   <th className="td-right">STATUS</th>
                 </tr>
               </thead>
               <tbody>
                 {[1,2,3].map(i => (
                   <tr key={i} className="inventory-row">
                     <td className="td-cell text-muted">2026-02-10</td>
                     <td className="td-cell"><span className="unit-badge">ETSY</span></td>
                     <td className="td-cell cell-name">Vintage Candle Holder</td>
                     <td className="td-cell td-right glow-teal">+$45.00</td>
                     <td className="td-cell td-right text-muted">CLEARED</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

      </div>
    </div>
  );
};