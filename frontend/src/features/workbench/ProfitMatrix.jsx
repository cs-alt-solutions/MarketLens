import React, { useState } from 'react';
import { useWorkbench } from '../../context/WorkbenchContext';
import './ConsoleLayout.css'; 
import { StatCard } from '../../components/StatCard';
import { Plus } from '../../components/Icons';

// --- VISUAL CHART (ANIMATED) ---
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
        {/* ADDED: CLASSNAME FOR ANIMATION */}
        <polyline 
            className="chart-line-animate"
            points={points} 
            fill="none" 
            stroke="var(--neon-teal)" 
            strokeWidth="2" 
            vectorEffect="non-scaling-stroke" 
        />
      </svg>
    </div>
  )
}

export const ProfitMatrix = () => {
  const { transactions, addTransaction, projects } = useWorkbench();
  const [isTxnFormOpen, setIsTxnFormOpen] = useState(false);
  
  // Form State
  const [txnForm, setTxnForm] = useState({ 
    item: '', 
    amount: '', 
    type: 'SALE', 
    platform: 'Direct',
    relatedProjectId: '' 
  });

  // Calculate Real Metrics
  const totalRev = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const totalCost = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const netProfit = totalRev - totalCost;
  const margin = totalRev > 0 ? (netProfit / totalRev) * 100 : 0;

  // Smart Handler: When selecting a project, auto-fill details AND set type to SALE
  const handleProjectSelect = (e) => {
    const pid = e.target.value;
    if (!pid) {
        setTxnForm({ ...txnForm, relatedProjectId: '', item: '', amount: '' });
        return;
    }
    const proj = projects.find(p => p.id === pid);
    if (proj) {
        setTxnForm({ 
            ...txnForm, 
            relatedProjectId: pid, 
            type: 'SALE', // Force Sale
            item: `Sold Unit: ${proj.title}`, 
            amount: proj.retailPrice || '' 
        });
    }
  };

  const handleLogTransaction = (e) => {
    e.preventDefault();
    if (!txnForm.item || !txnForm.amount) return;
    
    const finalAmount = txnForm.type === 'SALE' ? parseFloat(txnForm.amount) : -parseFloat(txnForm.amount);
    
    addTransaction({
      item: txnForm.item,
      amount: finalAmount,
      type: txnForm.type,
      status: 'CLEARED',
      platform: txnForm.platform,
      relatedProjectId: txnForm.relatedProjectId // Links to stock deduction
    });
    
    setTxnForm({ item: '', amount: '', type: 'SALE', platform: 'Direct', relatedProjectId: '' });
    setIsTxnFormOpen(false);
  };

  return (
    <div className="radar-grid-layout">
      {/* MAIN COLUMN */}
      <div className="radar-scroll-area">
        
        <div className="inventory-header">
          <div>
            <h2 className="header-title">PROFIT MATRIX</h2>
            <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>FINANCIAL HEALTH & REAL MARGINS</span>
          </div>
          <button className="btn-primary" onClick={() => setIsTxnFormOpen(true)}>
             <Plus /> LOG TRANSACTION
          </button>
        </div>

        <div className="panel-industrial" style={{padding:'20px', marginBottom:'30px'}}>
            <div className="flex-between">
              <span className="label-industrial">REVENUE TREND</span>
              <span style={{color:'var(--neon-teal)', fontSize:'0.7rem'}}>Live Data Active</span>
            </div>
            <RevenueChart />
        </div>

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
                   <th>DESCRIPTION</th>
                   <th>TYPE</th>
                   <th className="td-right">AMOUNT</th>
                   <th className="td-right">STATUS</th>
                 </tr>
               </thead>
               <tbody>
                 {transactions.length === 0 ? (
                    <tr><td colSpan="5" style={{padding:'20px', textAlign:'center', color:'var(--text-muted)'}}>No transactions recorded yet.</td></tr>
                 ) : (
                   transactions.map(t => (
                     <tr key={t.id} className="inventory-row">
                       <td className="td-cell text-muted" style={{fontSize:'0.75rem'}}>{t.date}</td>
                       <td className="td-cell cell-name" style={{fontSize:'0.9rem'}}>{t.item}</td>
                       <td className="td-cell">
                          <span className="label-industrial" style={{color: t.amount > 0 ? 'var(--neon-teal)' : 'var(--neon-orange)'}}>{t.type}</span>
                       </td>
                       <td className="td-cell td-right" style={{fontWeight:700, color: t.amount > 0 ? 'var(--neon-teal)' : 'var(--text-muted)'}}>
                         {t.amount > 0 ? '+' : ''}{Math.abs(t.amount).toFixed(2)}
                       </td>
                       <td className="td-cell td-right">
                         <span style={{fontSize:'0.65rem', color: 'var(--neon-purple)'}}>{t.status || 'CLEARED'}</span>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>

      <div className="sidebar-col" style={{padding:'15px'}}>
         <div className="keyword-header" style={{padding:'0 0 15px 0'}}>
            <h3 className="label-industrial glow-purple" style={{ margin: 0 }}>FINANCIALS</h3>
         </div>
         <div style={{display:'flex', flexDirection:'column', gap:'15px', paddingTop:'15px'}}>
            <StatCard label="GROSS REVENUE" value={`$${totalRev.toFixed(2)}`} glowColor="teal" />
            <StatCard label="NET PROFIT" value={`$${netProfit.toFixed(2)}`} glowColor={netProfit >= 0 ? "purple" : "red"} />
            <StatCard label="TOTAL EXPENSES" value={`$${totalCost.toFixed(2)}`} glowColor="orange" />
            <StatCard label="AVG MARGIN" value={`${margin.toFixed(1)}%`} glowColor="cyan" />
         </div>
      </div>

      {isTxnFormOpen && (
        <div className="blueprint-overlay" style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:2000}}>
          <div className="panel-industrial" style={{width:'400px', padding:'30px'}}>
            <h2 style={{ color: 'var(--neon-teal)', marginTop: 0, fontSize:'1.2rem' }}>LOG TRANSACTION</h2>
            <form onSubmit={handleLogTransaction}>
              
              <div className="lab-form-group">
                <label className="label-industrial">Transaction Type</label>
                <select className="input-industrial" value={txnForm.type} onChange={e => setTxnForm({...txnForm, type: e.target.value})}>
                  <option value="SALE">Revenue (Sale)</option>
                  <option value="EXPENSE">Misc Expense</option>
                </select>
              </div>

              {/* NEW: Project Link */}
              <div className="lab-form-group" style={{background:'rgba(34, 211, 238, 0.05)', padding:'10px', border:'1px dashed var(--neon-teal)'}}>
                   <label className="label-industrial" style={{color:'var(--neon-teal)'}}>Select Stock Item (Optional)</label>
                   <select className="input-industrial" value={txnForm.relatedProjectId} onChange={handleProjectSelect}>
                      <option value="">-- Manual Entry --</option>
                      {projects.map(p => (
                          <option key={p.id} value={p.id}>
                              {p.title} (Stock: {p.stockQty || 0})
                          </option>
                      ))}
                   </select>
              </div>

              <div className="lab-form-group">
                <label className="label-industrial">Description</label>
                <input className="input-industrial" placeholder="e.g. Sold Candle #001" value={txnForm.item} onChange={e => setTxnForm({...txnForm, item: e.target.value})} />
              </div>

              <div className="lab-form-group">
                <label className="label-industrial">Amount ($)</label>
                <input type="number" step="0.01" className="input-industrial" placeholder="0.00" value={txnForm.amount} onChange={e => setTxnForm({...txnForm, amount: e.target.value})} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop:'20px' }}>
                <button type="button" className="btn-ghost" onClick={() => setIsTxnFormOpen(false)}>CANCEL</button>
                <button type="submit" className="btn-primary">RECORD</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};