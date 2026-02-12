import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext'; 
import { useFinancial } from '../../context/FinancialContext'; 
import { StatCard } from '../../components/StatCard';
import { Plus } from '../../components/Icons';
import { RevenueChart } from '../../components/RevenueChart';
import { formatCurrency } from '../../utils/formatters';
import { TERMINOLOGY } from '../../utils/glossary';

export const ProfitMatrix = () => {
  const { transactions, addTransaction } = useFinancial();
  const { projects } = useInventory();
  const [isTxnFormOpen, setIsTxnFormOpen] = useState(false);
  const [txnForm, setTxnForm] = useState({ item: '', amount: '', type: 'SALE', platform: 'Direct', relatedProjectId: '' });

  const totalRev = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const totalCost = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const netProfit = totalRev - totalCost;
  const margin = totalRev > 0 ? (netProfit / totalRev) * 100 : 0;

  const handleProjectSelect = (e) => {
    const pid = e.target.value;
    if (!pid) {
        setTxnForm({ ...txnForm, relatedProjectId: '', item: '', amount: '' });
        return;
    }
    const proj = projects.find(p => p.id === pid);
    if (proj) {
        setTxnForm({ ...txnForm, relatedProjectId: pid, type: 'SALE', item: `Sold: ${proj.title}`, amount: proj.retailPrice || '' });
    }
  };

  const handleLogTransaction = (e) => {
    e.preventDefault();
    if (!txnForm.item || !txnForm.amount) return;
    const finalAmount = txnForm.type === 'SALE' ? parseFloat(txnForm.amount) : -parseFloat(txnForm.amount);
    addTransaction({ ...txnForm, amount: finalAmount, date: new Date().toISOString().split('T')[0], status: 'CLEARED' });
    setIsTxnFormOpen(false);
  };

  return (
    <div className="radar-grid-layout">
      <div className="radar-scroll-area">
        <div className="inventory-header">
          <div>
            <h2 className="header-title">{TERMINOLOGY.FINANCE.HEADER}</h2>
            <span className="text-muted">{TERMINOLOGY.FINANCE.SUBTITLE}</span>
          </div>
          <button className="btn-primary" onClick={() => setIsTxnFormOpen(true)}>
             <Plus /> {TERMINOLOGY.FINANCE.LOG}
          </button>
        </div>

        <div className="panel-industrial pad-20 mb-20">
            <div className="flex-between">
              <span className="label-industrial">{TERMINOLOGY.FINANCE.REVENUE_CHART}</span>
              <span className="text-good font-mono">{TERMINOLOGY.FINANCE.LIVE_STATUS}</span>
            </div>
            <RevenueChart />
        </div>

        <div className="panel-industrial">
           <div className="panel-header">
             <h3 className="no-margin">{TERMINOLOGY.FINANCE.LEDGER}</h3>
           </div>
           <div className="panel-content">
             <table className="inventory-table">
               <thead>
                 <tr>
                   <th>DATE</th>
                   <th>DESCRIPTION</th>
                   <th className="td-right">AMOUNT</th>
                 </tr>
               </thead>
               <tbody>
                 {transactions.length === 0 ? (
                    <tr><td colSpan="3" className="text-center text-muted pad-20 italic">{TERMINOLOGY.UI_FEEDBACK.EMPTY_LEDGER}</td></tr>
                 ) : (
                   transactions.map(t => (
                     <tr key={t.id} className="inventory-row">
                       <td className="td-cell text-muted font-mono">{t.date}</td>
                       <td className="td-cell cell-name">{t.item}</td>
                       <td className={`td-cell td-right font-bold ${t.amount > 0 ? 'text-good' : 'text-muted'}`}>
                         {t.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(t.amount))}
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>

      <div className="sidebar-col pad-20">
         <div className="keyword-header no-pad mb-20 bg-transparent">
            <h3 className="label-industrial glow-purple">{TERMINOLOGY.FINANCE.HEADER}</h3>
         </div>
         <div className="flex-col gap-20">
            <StatCard label={TERMINOLOGY.FINANCE.REVENUE} value={formatCurrency(totalRev)} glowColor="teal" />
            <StatCard label={TERMINOLOGY.FINANCE.NET} value={formatCurrency(netProfit)} glowColor={netProfit >= 0 ? "purple" : "red"} />
            <StatCard label={TERMINOLOGY.FINANCE.EXPENSE} value={formatCurrency(totalCost)} glowColor="orange" />
            <StatCard label={TERMINOLOGY.FINANCE.MARGIN_AVG} value={`${margin.toFixed(1)}%`} glowColor="cyan" />
         </div>
      </div>

      {isTxnFormOpen && (
        <div className="blueprint-overlay">
          <div className="panel-industrial modal-panel">
            <h2 className="modal-title">{TERMINOLOGY.FINANCE.LOG}</h2>
            <form onSubmit={handleLogTransaction}>
              <div className="lab-form-group">
                <label className="label-industrial">{TERMINOLOGY.INVENTORY.SELECT_ASSET}</label>
                <select className="input-industrial" value={txnForm.relatedProjectId} onChange={handleProjectSelect}>
                  <option value="">-- Manual Entry --</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div className="lab-form-group">
                <label className="label-industrial">{TERMINOLOGY.WORKSHOP.NOTES_LABEL}</label>
                <input className="input-industrial" value={txnForm.item} onChange={e => setTxnForm({...txnForm, item: e.target.value})} />
              </div>
              <div className="lab-form-group">
                <label className="label-industrial">{TERMINOLOGY.FINANCE.REVENUE}</label>
                <input type="number" step="0.01" className="input-industrial" value={txnForm.amount} onChange={e => setTxnForm({...txnForm, amount: e.target.value})} />
              </div>
              <div className="flex-end gap-10 mt-20">
                <button type="button" className="btn-ghost" onClick={() => setIsTxnFormOpen(false)}>{TERMINOLOGY.GENERAL.CANCEL}</button>
                <button type="submit" className="btn-primary">{TERMINOLOGY.GENERAL.SAVE}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};