/* src/features/workbench/ProfitMatrix.jsx - REFACTORED */
import React, { useState } from 'react';
import { useFinancialStats, useFinancial } from '../../context/FinancialContext';
import { useInventory } from '../../context/InventoryContext';
import { StatCard } from '../../components/cards/StatCard';
import { AnimatedNumber } from '../../components/charts/AnimatedNumber';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { SaleModal } from './components/SaleModal'; // NEW COMPONENT
import { TERMINOLOGY } from '../../utils/glossary';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Finance } from '../../components/Icons';
import './ProfitMatrix.css';

export const ProfitMatrix = () => {
  const { totalRev, totalCost, margin, transactions } = useFinancialStats();
  const { addTransaction } = useFinancial();
  const { activeProjects, updateProject } = useInventory();
  
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const sellableProjects = activeProjects.filter(p => p.stockQty > 0);

  const handleLogSale = async (project, qty, revenue) => {
    setIsProcessing(true);
    try {
      await addTransaction({
        description: `Sold ${qty}x ${project.title}`,
        amount: revenue,
        type: 'SALE'
      });

      await updateProject({
        id: project.id,
        stockQty: Math.max(0, project.stockQty - qty),
        soldQty: (project.soldQty || 0) + parseInt(qty)
      });

      setShowSaleModal(false);
    } catch (error) {
      console.error("Critical failure logging sale:", error);
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
            <Finance /> {TERMINOLOGY.FINANCE.LOG_SALE}
        </button>
      </div>

      <div className="profit-grid-header mb-20">
         <StatCard label={TERMINOLOGY.FINANCE.REVENUE} value={<AnimatedNumber value={totalRev} formatter={formatCurrency} />} glowColor="teal" />
         <StatCard label={TERMINOLOGY.FINANCE.EXPENSE} value={<AnimatedNumber value={totalCost} formatter={formatCurrency} />} glowColor="orange" />
         <StatCard label={TERMINOLOGY.FINANCE.MARGIN_AVG} value={`${margin.toFixed(1)}%`} glowColor="purple" />
      </div>

      <div className="panel-industrial pad-20">
         <RevenueChart />
      </div>

      <div className="panel-industrial mt-20">
         <div className="panel-header"><span className="label-industrial">{TERMINOLOGY.FINANCE.LEDGER_HEADER}</span></div>
         <div className="panel-content no-pad">
            <table className="inventory-table">
               <thead>
                  <tr>
                    <th>{TERMINOLOGY.FINANCE.TRANSACTION_DATE}</th>
                    <th>{TERMINOLOGY.GENERAL.BRAND}</th>
                    <th className="text-right">{TERMINOLOGY.FINANCE.AMOUNT}</th>
                  </tr>
               </thead>
               <tbody>
                  {transactions.map(t => (
                     <tr key={t.id} className="inventory-row">
                        <td className="td-cell text-muted font-small">{formatDate(t.date)}</td>
                        <td className="td-cell font-bold">{t.description}</td>
                        <td className={`td-cell text-right font-bold ${t.amount > 0 ? 'text-good' : 'text-warning'}`}>
                           {formatCurrency(t.amount)}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {showSaleModal && (
        <SaleModal 
          projects={sellableProjects}
          onSave={handleLogSale}
          onClose={() => setShowSaleModal(false)}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};