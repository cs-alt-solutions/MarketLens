/* src/context/FinancialContext.jsx */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabaseClient';

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

  // --- TRANSACTION ACTIONS (Python Bridge Ready) ---
  const addTransaction = useCallback(async (payload) => {
    try {
      // 🔥 FUTURE PYTHON BRIDGE: 
      // await fetch('/api/math_engine/transaction', { method: 'POST', body: JSON.stringify(payload) })
      
      const { data, error: txError } = await supabase
        .from('transactions')
        .insert([{
          description: payload.description,
          amount: payload.amount,
          type: payload.type,
          date: payload.date || new Date().toISOString(),
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
  }, []);

  const updateTransaction = useCallback(async (id, updates) => {
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
      console.error("Finance Engine: Failed to update transaction.", err);
      return null;
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    try {
      const { error: txError } = await supabase.from('transactions').delete().eq('id', id);
      if (txError) throw txError;
      
      setTransactions(prev => prev.filter(tx => tx.id !== id));
      return true;
    } catch (err) {
      console.error("Finance Engine: Failed to delete transaction.", err);
      return false;
    }
  }, []);

  // --- RECURRING COSTS ACTIONS ---
  const addRecurringCost = useCallback(async (payload) => {
    try {
      const { data, error: recError } = await supabase.from('recurring_costs').insert([payload]).select().single();
      if (recError) throw recError;
      setRecurringCosts(prev => [data, ...prev]);
      return data;
    } catch (err) { 
      console.error("Finance Engine: Failed to add recurring cost.", err);
      return null; 
    }
  }, []);

  const deleteRecurringCost = useCallback(async (id) => {
    try {
      const { error: recError } = await supabase.from('recurring_costs').delete().eq('id', id);
      if (recError) throw recError;
      setRecurringCosts(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err) { 
      console.error("Finance Engine: Failed to delete recurring cost.", err);
      return false; 
    }
  }, []);

  // --- METRICS CALCULATION (Isolating the Math Leak) ---
  const metrics = useMemo(() => {
    // 🔥 FUTURE PYTHON BRIDGE: This entire useMemo will be replaced by state fetched from math_engine.py

    // [DEV FALLBACK]: Keeping React math active so your charts don't crash today.
    const totalIncome = transactions
      .filter(tx => tx.type === 'INCOME' || tx.type === 'SALE')
      .reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);

    const totalExpense = transactions
      .filter(tx => tx.type === 'EXPENSE')
      .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount) || 0), 0);
    
    const monthlyBurn = recurringCosts.reduce((sum, cost) => {
      return sum + (cost.cycle === 'yearly' ? (parseFloat(cost.amount) || 0) / 12 : (parseFloat(cost.amount) || 0));
    }, 0);

    const netProfit = totalIncome - totalExpense;

    return { totalIncome, totalExpense, netProfit, monthlyBurn };
  }, [transactions, recurringCosts]);

  const value = useMemo(() => ({
    transactions, recurringCosts, loading, error, metrics,
    addTransaction, updateTransaction, deleteTransaction,
    addRecurringCost, deleteRecurringCost
  }), [
    transactions, recurringCosts, loading, error, metrics,
    addTransaction, updateTransaction, deleteTransaction,
    addRecurringCost, deleteRecurringCost
  ]);

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

  const channelMetrics = useMemo(() => {
    // 🔥 FUTURE PYTHON BRIDGE: Python should aggregate this.
    // [DEV FALLBACK]
    return transactions
      .filter(tx => tx.type === 'SALE')
      .reduce((acc, tx) => {
         const match = tx.description?.match(/\[(.*?)\]/);
         const channel = tx.salesChannel || (match ? match[1] : 'Direct');
         acc[channel] = (acc[channel] || 0) + (parseFloat(tx.amount) || 0);
         return acc;
      }, {});
  }, [transactions]);

  return { 
      totalRev, totalCost, margin, transactions, recurringCosts, 
      netProfit: metrics.netProfit || 0, monthlyBurn: metrics.monthlyBurn || 0, 
      loading, channelMetrics
  };
};