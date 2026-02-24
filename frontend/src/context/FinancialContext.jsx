import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabaseClient';

const FinancialContext = createContext();

export const FinancialProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. READ (The Historical Log)
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Boot up the matrix on mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // 2. CREATE
  const addTransaction = async (transactionPayload) => {
    setError(null);
    try {
      const { data, error: insertError } = await supabase
        .from('transactions')
        .insert([transactionPayload])
        .select()
        .single();

      if (insertError) throw insertError;
      
      // Optimistic UI update: instantly snap it to the top of our list
      setTransactions((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError(err.message);
      return null;
    }
  };

  // 3. UPDATE
  const updateTransaction = async (id, updates) => {
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Swap out the old record with the fresh database response
      setTransactions((prev) => 
        prev.map(tx => tx.id === id ? data : tx)
      );
      return data;
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError(err.message);
      return null;
    }
  };

  // 4. DELETE
  const deleteTransaction = async (id) => {
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setTransactions((prev) => prev.filter(tx => tx.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError(err.message);
      return false;
    }
  };

  // The Visionary's Metrics Engine
  const metrics = useMemo(() => {
    const totalIncome = transactions
      .filter(tx => tx.type === 'INCOME')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
      
    const totalExpense = transactions
      .filter(tx => tx.type === 'EXPENSE')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);

    const netProfit = totalIncome - totalExpense;

    return { totalIncome, totalExpense, netProfit };
  }, [transactions]);

  const value = {
    transactions,
    loading,
    error,
    metrics,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};