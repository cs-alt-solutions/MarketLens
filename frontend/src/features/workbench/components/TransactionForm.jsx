import React, { useState } from 'react';
import { TERMINOLOGY } from '../../../utils/glossary';
import './TransactionForm.css';

export const TransactionForm = ({ onSubmit, onCancel, initialData = null }) => {
  // 1. Initialize state directly! No useEffect required.
  const [formData, setFormData] = useState(initialData || {
    description: '',
    amount: '',
    type: 'INCOME',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount) || 0
    });
    
    // Clear form if it's a new entry
    if (!initialData) {
      setFormData({ description: '', amount: '', type: 'INCOME' });
    }
  };

  return (
    <div className="transaction-form-container panel-base">
      <h3 className="text-heading">
        {initialData ? TERMINOLOGY.FINANCIAL.EDIT_TRANSACTION : TERMINOLOGY.FINANCIAL.NEW_TRANSACTION}
      </h3>
      <form onSubmit={handleSubmit} className="transaction-form">
        
        <div className="form-group">
          <label className="text-muted">{TERMINOLOGY.FINANCIAL.DESCRIPTION}</label>
          <input 
            type="text" 
            name="description"
            className="input-base" 
            value={formData.description}
            onChange={handleChange}
            required
            placeholder={TERMINOLOGY.FINANCIAL.DESC_PLACEHOLDER}
          />
        </div>

        <div className="form-group">
          <label className="text-muted">{TERMINOLOGY.FINANCIAL.AMOUNT}</label>
          <input 
            type="number" 
            name="amount"
            className="input-base" 
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
            placeholder={TERMINOLOGY.FINANCIAL.AMOUNT_PLACEHOLDER}
          />
        </div>

        <div className="form-group">
          <label className="text-muted">{TERMINOLOGY.FINANCIAL.TYPE}</label>
          <select 
            name="type"
            className="select-base"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="INCOME">{TERMINOLOGY.FINANCIAL.INCOME}</option>
            <option value="EXPENSE">{TERMINOLOGY.FINANCIAL.EXPENSE}</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {initialData ? TERMINOLOGY.FINANCIAL.UPDATE : TERMINOLOGY.FINANCIAL.SAVE}
          </button>
          {onCancel && (
            <button type="button" className="btn-secondary" onClick={onCancel}>
              {TERMINOLOGY.FINANCIAL.CANCEL}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};