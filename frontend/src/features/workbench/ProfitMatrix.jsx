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
import { RecurringPanel } from './components/RecurringPanel'; // <-- NEW
import { TERMINOLOGY } from '../../utils/glossary';
import { formatCurrency } from '../../utils/formatters';
import { Finance, Plus } from '../../components/Icons';
import './ProfitMatrix.css';

export const ProfitMatrix = () => {
  // Upgraded engine pulling in our new recurring metrics
  const { totalRev, totalCost, margin, transactions, recurringCosts, monthlyBurn } = useFinancialStats();
  const { addTransaction, updateTransaction, deleteTransaction } = useFinancial(); 
  const { activeProjects, updateProject } = useInventory();
  
  // UI State
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const sellableProjects = activeProjects.filter(p => p.stockQty > 0);

  // --- SALE LOGIC ---
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

  // --- CRUD LOGIC FOR TRANSACTIONS ---
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

      <div className="profit-grid-header mb-20">
         <StatCard label={TERMINOLOGY.FINANCE.REVENUE} value={<AnimatedNumber value={totalRev} formatter={formatCurrency} />} glowColor="teal" />
         <StatCard label={TERMINOLOGY.FINANCE.EXPENSE} value={<AnimatedNumber value={totalCost} formatter={formatCurrency} />} glowColor="orange" />
         <StatCard label={TERMINOLOGY.FINANCE.MARGIN_AVG} value={`${margin.toFixed(1)}%`} glowColor="purple" />
         {/* NEW: Monthly Burn Rate HUD */}
         <StatCard label={TERMINOLOGY.FINANCIAL.MONTHLY_BURN} value={<AnimatedNumber value={monthlyBurn} formatter={formatCurrency} />} glowColor="red" />
      </div>

      <div className="panel-industrial pad-20">
         <RevenueChart />
      </div>

      {/* NEW: The Fixed Costs / Subscription Manager */}
      <RecurringPanel costs={recurringCosts} />

      <div className="panel-industrial mt-20 p-20">
          <TransactionHistory 
              transactions={transactions} 
              onEdit={handleEditTx} 
              onDelete={handleDeleteTx} 
          />
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
          <div className="modal-window animate-fade-in" style={{ width: '400px' }}>
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