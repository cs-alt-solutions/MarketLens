/* src/context/FinancialContext.jsx */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { useInventory } from './InventoryContext';

const FinancialContext = createContext();

export const FinancialProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [recurringCosts, setRecurringCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH ENGINE ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [txRes, recRes] = await Promise.all([
        supabase.from('transactions').select('*').order('date', { ascending: false }),
        supabase.from('recurring_costs').select('*').order('created_at', { ascending: false })
      ]);

      if (txRes.error) throw txRes.error;
      if (recRes.error) throw recRes.error;

      setTransactions(txRes.data || []);
      setRecurringCosts(recRes.data || []);
    } catch (err) {
      console.error('Critical Finance Fetch Failure:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  // --- TRANSACTION ACTIONS ---
  const addTransaction = async (payload) => {
    try {
      const { data, error: txError } = await supabase
        .from('transactions')
        .insert([{
          description: payload.description,
          amount: payload.amount,
          type: payload.type,
          date: payload.date || new Date().toISOString(),
          // SYNC: Ensure the new Sales Channel column is populated
          salesChannel: payload.salesChannel || 'Direct'
        }])
        .select()
        .single();

      if (txError) throw txError;
      
      setTransactions(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error("Finance Engine: Failed to record transaction.", err);
      return null;
    }
  };

  const updateTransaction = async (id, updates) => {
    try {
      const { data, error: txError } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (txError) throw txError;
      
      setTransactions(prev => prev.map(tx => tx.id === id ? data : tx));
      return data;
    } catch (err) {
      console.error("Finance Engine: Update failed.", err);
      return null;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const { error: txError } = await supabase.from('transactions').delete().eq('id', id);
      if (txError) throw txError;
      
      setTransactions(prev => prev.filter(tx => tx.id !== id));
      return true;
    } catch (err) {
      console.error("Finance Engine: Deletion failed.", err);
      return false;
    }
  };

  // --- RECURRING COSTS ACTIONS ---
  const addRecurringCost = async (payload) => {
    try {
      const { data, error: recError } = await supabase
        .from('recurring_costs')
        .insert([payload])
        .select()
        .single();

      if (recError) throw recError;
      
      setRecurringCosts(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error("Finance Engine: Failed to add recurring cost.", err);
      return null;
    }
  };

  const deleteRecurringCost = async (id) => {
    try {
      const { error: recError } = await supabase.from('recurring_costs').delete().eq('id', id);
      if (recError) throw recError;
      
      setRecurringCosts(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err) {
      console.error("Finance Engine: Failed to remove recurring cost.", err);
      return false;
    }
  };

  // --- METRICS CALCULATION ---
  const metrics = useMemo(() => {
    const totalIncome = transactions
      .filter(tx => tx.type === 'INCOME' || tx.type === 'SALE')
      .reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);

    const totalExpense = transactions
      .filter(tx => tx.type === 'EXPENSE')
      .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount) || 0), 0);
    
    const monthlyBurn = recurringCosts.reduce((sum, cost) => {
      return sum + (cost.cycle === 'yearly' ? parseFloat(cost.amount) / 12 : parseFloat(cost.amount));
    }, 0);

    const netProfit = totalIncome - totalExpense;

    return { totalIncome, totalExpense, netProfit, monthlyBurn };
  }, [transactions, recurringCosts]);

  const value = {
    transactions, recurringCosts, loading, error, metrics,
    addTransaction, updateTransaction, deleteTransaction,
    addRecurringCost, deleteRecurringCost
  };

  return <FinancialContext.Provider value={value}>{children}</FinancialContext.Provider>;
};

// --- HOOKS ---

export const useFinancial = () => {
  const ctx = useContext(FinancialContext);
  if (!ctx) throw new Error('useFinancial must be used within FinancialProvider');
  return ctx;
};

export const useFinancialStats = () => {
  const { transactions, recurringCosts, metrics, loading } = useFinancial();
  
  const totalRev = metrics.totalIncome || 0;
  const totalCost = metrics.totalExpense || 0;
  const margin = totalRev > 0 ? ((totalRev - totalCost) / totalRev) * 100 : 0;

  // Omni-Channel Parsing Engine
  const channelMetrics = useMemo(() => {
    return transactions
      .filter(tx => tx.type === 'SALE')
      .reduce((acc, tx) => {
         // Priority: 1. Database column 'salesChannel', 2. Regex tag, 3. Default
         const match = tx.description?.match(/\[(.*?)\]/);
         const channel = tx.salesChannel || (match ? match[1] : 'Direct');
         acc[channel] = (acc[channel] || 0) + (parseFloat(tx.amount) || 0);
         return acc;
      }, {});
  }, [transactions]);

  return { 
      totalRev, 
      totalCost, 
      margin, 
      transactions, 
      recurringCosts, 
      netProfit: metrics.netProfit || 0, 
      monthlyBurn: metrics.monthlyBurn || 0, 
      loading,
      channelMetrics
  };
};

export const useProjectEconomics = (project) => {
  const { materials } = useInventory();
  return useMemo(() => {
    let materialCost = 0;
    if (project?.recipe?.length > 0) {
      project.recipe.forEach(item => {
        const mat = materials.find(m => m.id === item.matId);
        if (mat) materialCost += (parseFloat(mat.costPerUnit) * parseFloat(item.reqPerUnit));
      });
    }
    const retailPrice = parseFloat(project?.retailPrice) || 0;
    const platformFees = retailPrice > 0 ? (retailPrice * (6.5 / 100)) + 0.20 : 0;
    const netProfit = retailPrice - materialCost - platformFees;
    const marginPercent = retailPrice > 0 ? (netProfit / retailPrice) * 100 : 0;
    
    return { materialCost, platformFees, netProfit, marginPercent };
  }, [project, materials]);
};