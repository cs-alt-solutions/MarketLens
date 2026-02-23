/* src/features/workbench/ProfitMatrix.jsx */
import React, { useState } from 'react';
import { useFinancialStats, useFinancial } from '../../context/FinancialContext';
import { useInventory } from '../../context/InventoryContext';
import { StatCard } from '../../components/cards/StatCard';
import { AnimatedNumber } from '../../components/charts/AnimatedNumber';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { TERMINOLOGY } from '../../utils/glossary';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Plus, Finance } from '../../components/Icons';

export const ProfitMatrix = () => {
  const { totalRev, totalCost, margin, transactions } = useFinancialStats();
  const { addTransaction } = useFinancial();
  const { activeProjects, updateProject } = useInventory();
  
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [saleData, setSaleData] = useState({ projectId: '', qty: 1 });
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter projects to only those with stock available to sell
  const sellableProjects = activeProjects.filter(p => p.stockQty > 0);
  
  const selectedProject = sellableProjects.find(p => p.id.toString() === saleData.projectId.toString());
  const expectedRevenue = selectedProject ? (selectedProject.retailPrice * saleData.qty) : 0;

  const handleLogSale = async (e) => {
      e.preventDefault();
      if (!selectedProject || saleData.qty < 1) return;
      
      setIsProcessing(true);

      try {
          // 1. Log Transaction in Ledger (Using 'description' instead of 'desc')
          const txnResult = await addTransaction({
              description: `Sold ${saleData.qty}x ${selectedProject.title}`,
              amount: expectedRevenue,
              type: 'SALE'
          });

          // 2. Safety Check: Did the database accept it?
          if (!txnResult) {
              alert("Database Error: Transaction rejected. Check your browser console for details.");
              setIsProcessing(false);
              return;
          }

          // 3. Update Project Stock & Sold Quantities
          const newStock = Math.max(0, selectedProject.stockQty - saleData.qty);
          const newSold = (selectedProject.soldQty || 0) + parseInt(saleData.qty);
          
          await updateProject({
              id: selectedProject.id,
              stockQty: newStock,
              soldQty: newSold
          });

          setShowSaleModal(false);
          setSaleData({ projectId: '', qty: 1 });

      } catch (error) {
          console.error("Critical failure logging sale:", error);
          alert("System error. Could not process sale.");
      } finally {
          setIsProcessing(false);
      }
  };

  return (
    <div className="radar-scroll-area relative">
      <div className="inventory-header flex-between mb-20">
        <div>
           <h2 className="header-title">{TERMINOLOGY.FINANCE.HEADER}</h2>
           <span className="header-subtitle">{TERMINOLOGY.FINANCE.SUBTITLE}</span>
        </div>
        <button className="btn-primary flex-center gap-10" onClick={() => setShowSaleModal(true)}>
            <Finance /> LOG SALE
        </button>
      </div>

      <div className="inventory-metrics mb-20">
         <StatCard 
           label={TERMINOLOGY.FINANCE.REVENUE} 
           value={<AnimatedNumber value={totalRev} formatter={formatCurrency} />} 
           glowColor="teal" 
         />
         <StatCard 
           label={TERMINOLOGY.FINANCE.EXPENSE} 
           value={<AnimatedNumber value={totalCost} formatter={formatCurrency} />} 
           glowColor="orange" 
         />
         <StatCard 
           label={TERMINOLOGY.FINANCE.MARGIN_AVG} 
           value={`${margin.toFixed(1)}%`} 
           glowColor={margin > 30 ? "purple" : "red"} 
         />
      </div>

      <div className="panel-industrial pad-20 mt-20">
         <div className="flex-between">
            <span className="label-industrial">{TERMINOLOGY.FINANCE.REVENUE_CHART}</span>
            <span className="text-accent font-small">{TERMINOLOGY.FINANCE.TREND} +12%</span>
         </div>
         <RevenueChart />
      </div>

      <div className="panel-industrial mt-20">
         <div className="panel-header">
            <span className="label-industrial">{TERMINOLOGY.FINANCE.LEDGER}</span>
         </div>
         <div className="panel-content no-pad">
            {transactions.length > 0 ? (
                <table className="inventory-table">
                   <thead>
                      <tr>
                        <th>{TERMINOLOGY.FINANCE.DATE}</th>
                        <th>{TERMINOLOGY.FINANCE.DESC}</th>
                        <th className="text-right">{TERMINOLOGY.FINANCE.AMOUNT}</th>
                      </tr>
                   </thead>
                   <tbody>
                      {transactions.map(t => (
                         <tr key={t.id} className="inventory-row">
                            <td className="td-cell text-muted font-small">{formatDate(t.date)}</td>
                            {/* Updated to pull from the new 'description' column */}
                            <td className="td-cell font-bold">{t.description || t.desc}</td> 
                            <td className={`td-cell font-mono font-bold text-right ${t.amount > 0 ? 'text-good' : 'text-warning'}`}>
                               {t.amount > 0 ? '+' : ''}{formatCurrency(t.amount)}
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
            ) : (
                <div className="text-muted italic text-center pad-20">
                    {TERMINOLOGY.FINANCE.EMPTY_LEDGER}
                </div>
            )}
         </div>
      </div>

      {/* --- SALE MODAL OVERLAY --- */}
      {showSaleModal && (
        <div className="modal-overlay">
            <div className="modal-window animate-fade-in" style={{ width: '400px', height: 'auto' }}>
                <div className="panel-header flex-between">
                    <span className="font-bold font-large">RECORD SALE</span>
                </div>
                <div className="panel-content pad-20 bg-app">
                    <form onSubmit={handleLogSale}>
                        <div className="lab-form-group mb-20">
                            <label className="label-industrial">SELECT PRODUCT</label>
                            <select 
                                className="input-industrial" 
                                value={saleData.projectId}
                                onChange={e => setSaleData({...saleData, projectId: e.target.value})}
                                required
                            >
                                <option value="">-- Select item from stock --</option>
                                {sellableProjects.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.title} ({p.stockQty} available)
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="lab-form-group mb-20">
                            <label className="label-industrial">QUANTITY SOLD</label>
                            <input 
                                type="number" 
                                className="input-industrial text-large font-bold text-center" 
                                value={saleData.qty}
                                onChange={e => setSaleData({...saleData, qty: e.target.value})}
                                min="1"
                                max={selectedProject ? selectedProject.stockQty : 9999}
                                required
                            />
                        </div>

                        <div className="flex-between bg-row-odd p-15 border-radius-2 border-subtle mb-20">
                            <span className="label-industrial no-margin text-muted">TOTAL REVENUE</span>
                            <span className="text-good font-bold text-large">{formatCurrency(expectedRevenue)}</span>
                        </div>

                        <div className="flex-between gap-10">
                            <button type="button" className="btn-ghost w-full" onClick={() => setShowSaleModal(false)}>CANCEL</button>
                            <button type="submit" className="btn-primary w-full" disabled={isProcessing || !selectedProject}>
                                {isProcessing ? 'LOGGING...' : 'CONFIRM SALE'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};