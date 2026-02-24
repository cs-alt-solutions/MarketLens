/* src/context/FinancialContext.jsx */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { useInventory } from './InventoryContext';

const FinancialContext = createContext();

export const FinancialProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [recurringCosts, setRecurringCosts] = useState([]); // <-- NEW STATE
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH BOTH TABLES ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [txRes, recRes] = await Promise.all([
        supabase.from('transactions').select('*').order('created_at', { ascending: false }),
        supabase.from('recurring_costs').select('*').order('created_at', { ascending: false })
      ]);

      if (txRes.error) throw txRes.error;
      if (recRes.error) throw recRes.error;

      setTransactions(txRes.data || []);
      setRecurringCosts(recRes.data || []);
    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- STANDARD TRANSACTION CRUD (Unchanged) ---
  const addTransaction = async (payload) => { /* ... existing logic ... */
    const { data, error } = await supabase.from('transactions').insert([payload]).select().single();
    if (!error) setTransactions(prev => [data, ...prev]);
    return data;
  };
  const updateTransaction = async (id, updates) => { /* ... existing logic ... */
    const { data, error } = await supabase.from('transactions').update(updates).eq('id', id).select().single();
    if (!error) setTransactions(prev => prev.map(tx => tx.id === id ? data : tx));
    return data;
  };
  const deleteTransaction = async (id) => { /* ... existing logic ... */
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) setTransactions(prev => prev.filter(tx => tx.id !== id));
    return !error;
  };

  // --- NEW: RECURRING COSTS CRUD ---
  const addRecurringCost = async (payload) => {
    const { data, error } = await supabase.from('recurring_costs').insert([payload]).select().single();
    if (!error) setRecurringCosts(prev => [data, ...prev]);
    return data;
  };
  const deleteRecurringCost = async (id) => {
    const { error } = await supabase.from('recurring_costs').delete().eq('id', id);
    if (!error) setRecurringCosts(prev => prev.filter(c => c.id !== id));
    return !error;
  };

  // --- UPGRADED METRICS ENGINE ---
  const metrics = useMemo(() => {
    const totalIncome = transactions.filter(tx => tx.type === 'INCOME' || tx.type === 'SALE').reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const totalExpense = transactions.filter(tx => tx.type === 'EXPENSE').reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);
    
    // Calculate Monthly Burn Rate
    const monthlyBurn = recurringCosts.reduce((sum, cost) => {
      return sum + (cost.cycle === 'YEARLY' ? parseFloat(cost.amount) / 12 : parseFloat(cost.amount));
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

// eslint-disable-next-line react-refresh/only-export-components
export const useFinancial = () => {
  const ctx = useContext(FinancialContext);
  if (!ctx) throw new Error('useFinancial must be used within FinancialProvider');
  return ctx;
};

// --- NEWLY DEPLOYED HOOKS ---
// eslint-disable-next-line react-refresh/only-export-components
export const useFinancialStats = () => {
  const { transactions, recurringCosts, metrics, loading } = useFinancial();
  const totalRev = metrics.totalIncome || 0;
  const totalCost = metrics.totalExpense || 0;
  const margin = totalRev > 0 ? ((totalRev - totalCost) / totalRev) * 100 : 0;

  return { totalRev, totalCost, margin, transactions, recurringCosts, netProfit: metrics.netProfit || 0, monthlyBurn: metrics.monthlyBurn || 0, loading };
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProjectEconomics = (project) => { /* ... existing useProjectEconomics logic ... */ 
  const { materials } = useInventory();
  return useMemo(() => {
    let materialCost = 0;
    if (project?.recipe?.length > 0) {
      project.recipe.forEach(item => {
        const mat = materials.find(m => m.id === item.matId);
        if (mat) materialCost += (mat.costPerUnit * item.reqPerUnit);
      });
    }
    const retailPrice = parseFloat(project?.retailPrice) || 0;
    const platformFees = retailPrice > 0 ? (retailPrice * (6.5 / 100)) + 0.20 : 0;
    const netProfit = retailPrice - materialCost - platformFees;
    const marginPercent = retailPrice > 0 ? (netProfit / retailPrice) * 100 : 0;
    return { materialCost, platformFees, netProfit, marginPercent };
  }, [project, materials]);
};