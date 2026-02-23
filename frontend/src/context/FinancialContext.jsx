/* src/context/FinancialContext.jsx */
import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useInventory } from './InventoryContext';
import { convertToStockUnit } from '../utils/units';

const FinancialContext = createContext();

export const FinancialProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error("Supabase Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (txn) => {
    const newTxn = { 
        date: new Date().toISOString(), 
        ...txn 
    };
    
    const { data, error } = await supabase
        .from('transactions')
        .insert([newTxn])
        .select();
        
    if (error) {
        console.error("Supabase Error adding transaction:", error);
        return null;
    }
    if (data) {
        setTransactions(prev => [data[0], ...prev]);
        return data[0];
    }
  };

  return (
    <FinancialContext.Provider value={{
      transactions, addTransaction, fetchTransactions, loading
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

    const materialCost = (project.recipe || []).reduce((total, item) => {
      const mat = materials.find(m => m.id === item.matId);
      if (!mat) return total;
      const qtyInStockUnit = convertToStockUnit(item.reqPerUnit, item.unit, mat.unit);
      return total + (qtyInStockUnit * mat.costPerUnit);
    }, 0);

    const retail = project.retailPrice || 0;
    const econ = project.economics || { platformFeePercent: 6.5, platformFixedFee: 0.20 };
    const platformFees = retail > 0 
      ? (retail * (econ.platformFeePercent / 100)) + econ.platformFixedFee 
      : 0;

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