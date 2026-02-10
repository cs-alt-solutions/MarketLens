import React from 'react';
import './ConsoleLayout.css'; 
import { StatCard } from '../../components/StatCard';

// --- SIMPLE SVG CHART ---
const RevenueChart = () => {
  const data = [20, 45, 30, 60, 55, 80, 75];
  const max = Math.max(...data);
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (val / max) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{width:'100%', height:'150px', position:'relative', marginTop:'20px'}}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{width:'100%', height:'100%', overflow:'visible'}}>
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor:'var(--neon-teal)', stopOpacity:0.5}} />
            <stop offset="100%" style={{stopColor:'var(--neon-teal)', stopOpacity:0}} />
          </linearGradient>
        </defs>
        <path d={`M0,100 ${points} 100,100`} fill="url(#grad1)" stroke="none" />
        <polyline points={points} fill="none" stroke="var(--neon-teal)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {data.map((val, i) => {
           const x = (i / (data.length - 1)) * 100;
           const y = 100 - (val / max) * 100;
           return <circle key={i} cx={x} cy={y} r="1.5" fill="#fff" vectorEffect="non-scaling-stroke" />
        })}
      </svg>
      <div className="flex-between" style={{marginTop:'5px', fontSize:'0.6rem', color:'var(--text-muted)'}}>
        <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span>
      </div>
    </div>
  )
}

const TRANSACTIONS = [
  { id: 1, date: '2026-02-10', item: 'Vintage Candle Holder', platform: 'ETSY', rev: 45.00, cost: 12.50, fees: 4.50, status: 'CLEARED' },
  { id: 2, date: '2026-02-10', item: 'Vintage Candle Holder', platform: 'ETSY', rev: 45.00, cost: 12.50, fees: 4.50, status: 'CLEARED' },
  { id: 3, date: '2026-02-09', item: 'Custom Wood Sign', platform: 'SHOPIFY', rev: 120.00, cost: 35.00, fees: 3.20, status: 'PENDING' },
  { id: 4, date: '2026-02-08', item: 'Vintage Candle Holder', platform: 'ETSY', rev: 45.00, cost: 12.50, fees: 4.50, status: 'CLEARED' },
];

export const ProfitMatrix = () => {
  const totalRev = TRANSACTIONS.reduce((acc, t) => acc + t.rev, 0);
  const totalCost = TRANSACTIONS.reduce((acc, t) => acc + t.cost + t.fees, 0);
  const netProfit = totalRev - totalCost;
  const margin = (netProfit / totalRev) * 100;

  return (
    <div className="radar-grid-layout">
      {/* MAIN COLUMN */}
      <div className="radar-scroll-area">
        
        <div className="inventory-header">
          <div>
            <h2 className="header-title">PROFIT MATRIX</h2>
            <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>FINANCIAL HEALTH & REAL MARGINS</span>
          </div>
          <div className="filter-group">
            <button className="filter-btn active">THIS MONTH</button>
            <button className="filter-btn">Q1</button>
            <button className="filter-btn">YTD</button>
          </div>
        </div>

        {/* Chart Card */}
        <div className="panel-industrial" style={{padding:'20px', marginBottom:'30px'}}>
            <div className="flex-between">
              <span className="label-industrial">REVENUE TREND</span>
              <span style={{color:'var(--neon-teal)', fontSize:'0.7rem'}}>+12% vs last month</span>
            </div>
            <RevenueChart />
        </div>

        {/* Transaction Ledger */}
        <div className="panel-industrial">
           <div className="panel-header">
             <h3 style={{margin:0, fontSize:'1rem'}}>TRANSACTION LEDGER</h3>
             <button className="btn-ghost">EXPORT CSV</button>
           </div>
           <div className="panel-content">
             <table className="inventory-table">
               <thead>
                 <tr>
                   <th>DATE</th>
                   <th>ITEM SOLD</th>
                   <th className="td-right">REVENUE</th>
                   <th className="td-right">COST</th>
                   <th className="td-right">NET PROFIT</th>
                   <th className="td-right">STATUS</th>
                 </tr>
               </thead>
               <tbody>
                 {TRANSACTIONS.map(t => {
                   const profit = t.rev - t.cost - t.fees;
                   return (
                     <tr key={t.id} className="inventory-row">
                       <td className="td-cell text-muted" style={{fontSize:'0.75rem'}}>{t.date}</td>
                       <td className="td-cell cell-name" style={{fontSize:'0.9rem'}}>{t.item}</td>
                       <td className="td-cell td-right glow-teal">${t.rev.toFixed(2)}</td>
                       <td className="td-cell td-right text-muted">-${(t.cost + t.fees).toFixed(2)}</td>
                       <td className="td-cell td-right" style={{fontWeight:700, color: profit > 0 ? 'var(--neon-purple)' : 'red'}}>
                         ${profit.toFixed(2)}
                       </td>
                       <td className="td-cell td-right">
                         <span style={{fontSize:'0.65rem', color: t.status === 'CLEARED' ? 'var(--neon-teal)' : 'var(--neon-orange)'}}>{t.status}</span>
                       </td>
                     </tr>
                   )
                 })}
               </tbody>
             </table>
           </div>
        </div>

      </div>

      {/* RIGHT SIDEBAR: METRICS (REFACTORED) */}
      <div className="sidebar-col" style={{padding:'15px'}}>
         <div className="keyword-header" style={{padding:'0 0 15px 0'}}>
            <h3 className="label-industrial glow-purple" style={{ margin: 0 }}>FINANCIALS</h3>
         </div>
         <div style={{display:'flex', flexDirection:'column', gap:'15px', paddingTop:'15px'}}>
            <StatCard label="GROSS REVENUE" value={`$${totalRev.toFixed(0)}`} glowColor="teal" />
            <StatCard label="NET PROFIT" value={`$${netProfit.toFixed(0)}`} glowColor="purple" />
            <StatCard label="EXPENSES (COGS)" value={`$${totalCost.toFixed(0)}`} glowColor="orange" />
            <StatCard label="AVG MARGIN" value={`${margin.toFixed(1)}%`} glowColor="cyan" />
         </div>
      </div>

    </div>
  );
};