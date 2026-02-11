import React, { createContext, useContext, useState } from 'react';

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

// eslint-disable-next-line react-refresh/only-export-components
export const useFinancial = () => useContext(FinancialContext);