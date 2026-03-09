/* src/features/workbench/ProfitMatrix.jsx */
import React, { useState } from 'react';
import { useFinancialStats, useFinancial } from '../../context/FinancialContext';
import { useInventory } from '../../context/InventoryContext';
import { StatCard } from '../../components/cards/StatCard';
import { AnimatedNumber } from '../../components/charts/AnimatedNumber';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { SaleModal } from './components/SaleModal'; 
import { TransactionHistory } from './components/TransactionHistory';
import { TransactionForm } from './components/TransactionForm';
import { RecurringPanel } from './components/RecurringPanel';
import { TERMINOLOGY } from '../../utils/glossary';
import { formatCurrency } from '../../utils/formatters';
import { Finance, Plus } from '../../components/Icons';
import './ProfitMatrix.css';

export const ProfitMatrix = () => {
  // NEW: We grab channelMetrics from our hook
  const { totalRev, totalCost, margin, transactions, recurringCosts, monthlyBurn, channelMetrics } = useFinancialStats();
  const { addTransaction, updateTransaction, deleteTransaction } = useFinancial(); 
  const { activeProjects, updateProject } = useInventory();
  
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const sellableProjects = activeProjects.filter(p => p.stockQty > 0);

  // NEW: Added 'channel' parameter
  const handleLogSale = async (project, qty, revenue, channel) => {
    setIsProcessing(true);
    try {
      await addTransaction({
        description: `Sale: ${project.title} (${qty}x) [${channel}]`, // We inject the channel tag!
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

  const handleOpenNewTx = () => {
    setEditingTx(null);
    setShowTxModal(true);
  };

  const handleEditTx = (tx) => {
    setEditingTx(tx);
    setShowTxModal(true);
  };

  const handleDeleteTx = async (id) => {
    const confirmed = window.confirm("Delete this transaction permanently?");
    if (confirmed) {
      await deleteTransaction(id);
    }
  };

  const handleTxSubmit = async (data) => {
    if (editingTx) {
      await updateTransaction(editingTx.id, data);
    } else {
      await addTransaction({ ...data, created_at: new Date().toISOString() });
    }
    setShowTxModal(false);
    setEditingTx(null);
  };

  return (
    <div className="profit-matrix-container relative">
      <div className="inventory-header flex-between mb-20">
        <div>
           <h2 className="header-title">{TERMINOLOGY.FINANCE.HEADER}</h2>
           <span className="header-subtitle">{TERMINOLOGY.FINANCE.SUBTITLE}</span>
        </div>
        <div className="flex-center gap-10">
          <button className="btn-ghost flex-center gap-10" onClick={handleOpenNewTx}>
              <Plus /> LOG EXPENSE / INCOME
          </button>
          <button className="btn-primary flex-center gap-10" onClick={() => setShowSaleModal(true)}>
              <Finance /> {TERMINOLOGY.FINANCE.LOG_SALE}
          </button>
        </div>
      </div>

      <div className="profit-grid-header mb-15">
         <StatCard label={TERMINOLOGY.FINANCE.REVENUE} value={<AnimatedNumber value={totalRev} formatter={formatCurrency} />} glowColor="teal" />
         <StatCard label={TERMINOLOGY.FINANCE.EXPENSE} value={<AnimatedNumber value={totalCost} formatter={formatCurrency} />} glowColor="orange" />
         <StatCard label={TERMINOLOGY.FINANCE.MARGIN_AVG} value={`${margin.toFixed(1)}%`} glowColor="purple" />
         <StatCard label={TERMINOLOGY.FINANCIAL.MONTHLY_BURN} value={<AnimatedNumber value={monthlyBurn} formatter={formatCurrency} />} glowColor="red" />
      </div>

      {/* --- NEW: CHANNEL PERFORMANCE TRAY --- */}
      {channelMetrics && Object.keys(channelMetrics).length > 0 && (
         <div className="flex gap-15 mb-20 flex-wrap">
            {Object.entries(channelMetrics).map(([channel, amount]) => (
                <div key={channel} className="bg-row-odd border-subtle border-radius-2 p-15 flex-1 flex-between min-w-150">
                    <span className="font-mono font-small text-muted">{channel.toUpperCase()}</span>
                    <span className="font-bold text-teal">{formatCurrency(amount)}</span>
                </div>
            ))}
         </div>
      )}

      {/* STRICT CHART WRAPPER */}
      <div className="panel-industrial chart-panel-wrapper">
         <RevenueChart />
      </div>

      {/* SIDE-BY-SIDE LEDGERS WITH SCROLL LOCKS */}
      <div className="profit-ledgers-grid mt-20">
          <div className="panel-industrial table-panel-wrapper p-20">
              <TransactionHistory 
                  transactions={transactions} 
                  onEdit={handleEditTx} 
                  onDelete={handleDeleteTx} 
              />
          </div>
          
          <div className="panel-industrial table-panel-wrapper p-20">
              <RecurringPanel costs={recurringCosts} />
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

      {showTxModal && (
        <div className="modal-overlay">
          <div className="modal-window animate-fade-in modal-small">
            <TransactionForm 
              initialData={editingTx} 
              onSubmit={handleTxSubmit} 
              onCancel={() => { setShowTxModal(false); setEditingTx(null); }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};