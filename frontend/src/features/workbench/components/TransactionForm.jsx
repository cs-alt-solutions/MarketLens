/* src/features/workbench/components/TransactionForm.jsx */
import React, { useState, useEffect } from 'react';
import './TransactionForm.css';

export const TransactionForm = ({ initialData, onSubmit, onCancel }) => {
  // ✅ Initialize local state with initialData if we are editing
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'EXPENSE',
    salesChannel: 'Direct',
    date: new Date().toISOString().split('T')[0]
  });

  // ✅ Fill the form if initialData exists (Editing Mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description || '',
        amount: initialData.amount || '',
        type: initialData.type || 'EXPENSE',
        salesChannel: initialData.salesChannel || 'Direct',
        date: initialData.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0]
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ✅ Convert amount back to a number before submitting to the context
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount) || 0
    });
  };

  return (
    <div className="transaction-form-container">
      <h3 className="form-title text-accent mb-20">
        {initialData ? 'EDIT TRANSACTION' : 'LOG NEW TRANSACTION'}
      </h3>

      <form onSubmit={handleSubmit} className="flex-col gap-15">
        <div className="flex-col gap-5">
          <label className="label-industrial">Description</label>
          <input 
            type="text" 
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g. Etsy Fees, Wood Restock..."
            className="input-main"
            required
          />
        </div>

        <div className="flex-between gap-15">
          <div className="flex-col flex-1 gap-5">
            <label className="label-industrial">Amount ($)</label>
            <input 
              type="number" 
              name="amount"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              className="input-main"
              required
            />
          </div>

          <div className="flex-col flex-1 gap-5">
            <label className="label-industrial">Transaction Type</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange} 
              className="input-main"
            >
              <option value="EXPENSE">EXPENSE</option>
              <option value="SALE">SALE</option>
              <option value="INCOME">OTHER INCOME</option>
            </select>
          </div>
        </div>

        <div className="flex-between gap-15">
          <div className="flex-col flex-1 gap-5">
            <label className="label-industrial">Sales Channel</label>
            <input 
              type="text" 
              name="salesChannel"
              value={formData.salesChannel}
              onChange={handleChange}
              placeholder="e.g. Direct, Shopify..."
              className="input-main"
            />
          </div>

          <div className="flex-col flex-1 gap-5">
            <label className="label-industrial">Date</label>
            <input 
              type="date" 
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input-main"
              required
            />
          </div>
        </div>

        <div className="flex-center gap-15 mt-20">
          <button type="button" onClick={onCancel} className="btn-ghost w-full">
            CANCEL
          </button>
          <button type="submit" className="btn-primary w-full">
            {initialData ? 'UPDATE' : 'RECORD'}
          </button>
        </div>
      </form>
    </div>
  );
};