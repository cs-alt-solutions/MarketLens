/* src/context/FinancialContext.jsx */
import React, { createContext, useContext, useState, useMemo } from 'react';

const FinancialContext = createContext();

export const FinancialProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  // ACTIONS: FINANCIALS
  const addTransaction = (txn) => {
    const newTxn = { id: Date.now(), date: new Date().toISOString().split('T')[0], ...txn };
    setTransactions(prev => [newTxn, ...prev]);
  };

  return (
    <FinancialContext.Provider value={{
      transactions, addTransaction
    }}>
      {children}
    </FinancialContext.Provider>
  );
};

// Phase 3: Financial Logic Engine Hook
export const useFinancialStats = () => {
  const { transactions } = useContext(FinancialContext);

  return useMemo(() => {
    const totalRev = transactions
      .filter(t => t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0);

    const totalCost = transactions
      .filter(t => t.amount < 0)
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    const netProfit = totalRev - totalCost;
    const margin = totalRev > 0 ? (netProfit / totalRev) * 100 : 0;

    return { totalRev, totalCost, netProfit, margin, transactions };
  }, [transactions]);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFinancial = () => useContext(FinancialContext);