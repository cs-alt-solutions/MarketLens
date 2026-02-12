/* src/context/FinancialContext.jsx */
import React, { createContext, useContext, useState, useMemo } from 'react';
import { useInventory } from './InventoryContext';
import { convertToStockUnit } from '../utils/units';

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

/* eslint-disable react-refresh/only-export-components */
export const useProjectEconomics = (project) => {
  const { materials } = useInventory();
  
  return useMemo(() => {
    if (!project) return { materialCost: 0, platformFees: 0, totalCost: 0, netProfit: 0, marginPercent: 0 };

    // 1. Calculate Raw Material Cost
    const materialCost = (project.recipe || []).reduce((total, item) => {
      const mat = materials.find(m => m.id === item.matId);
      if (!mat) return total;
      const qtyInStockUnit = convertToStockUnit(item.reqPerUnit, item.unit, mat.unit);
      return total + (qtyInStockUnit * mat.costPerUnit);
    }, 0);

    // 2. Calculate Platform Fees
    const retail = project.retailPrice || 0;
    const econ = project.economics || { platformFeePercent: 6.5, platformFixedFee: 0.20 };
    const platformFees = retail > 0 
      ? (retail * (econ.platformFeePercent / 100)) + econ.platformFixedFee 
      : 0;

    // 3. Final Aggregation
    const shipping = parseFloat(project.economics?.shippingCost) || 0;
    const totalCost = materialCost + platformFees + shipping;
    const netProfit = retail - totalCost;
    const marginPercent = retail > 0 ? (netProfit / retail) * 100 : 0;

    return { materialCost, platformFees, totalCost, netProfit, marginPercent };
  }, [project, materials]);
};

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

export const useFinancial = () => useContext(FinancialContext);
/* eslint-enable react-refresh/only-export-components */