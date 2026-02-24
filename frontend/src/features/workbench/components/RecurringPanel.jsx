/* src/features/workbench/components/RecurringPanel.jsx */
import React, { useState } from 'react';
import { useFinancial } from '../../../context/FinancialContext';
import { TERMINOLOGY } from '../../../utils/glossary';
import { Plus, CloseIcon } from '../../../components/Icons';

export const RecurringPanel = ({ costs = [] }) => {
  const { addRecurringCost, deleteRecurringCost } = useFinancial();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ description: '', amount: '', cycle: 'MONTHLY' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addRecurringCost({ ...formData, amount: parseFloat(formData.amount) });
    setFormData({ description: '', amount: '', cycle: 'MONTHLY' });
    setShowForm(false);
  };

  return (
    <div className="panel-industrial p-20 mt-20">
      <div className="flex-between mb-15">
        <h3 className="label-industrial no-margin">{TERMINOLOGY.FINANCIAL.RECURRING_HEADER}</h3>
        <button className="btn-ghost flex-center gap-10 font-small" onClick={() => setShowForm(!showForm)}>
          <Plus /> {TERMINOLOGY.FINANCIAL.ADD_RECURRING}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-20 p-15 border-dashed flex-center gap-10">
          <input type="text" className="input-industrial w-full" placeholder="Software, Rent, etc." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          <input type="number" className="input-industrial" placeholder="0.00" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
          <select className="input-industrial" value={formData.cycle} onChange={e => setFormData({...formData, cycle: e.target.value})}>
            <option value="MONTHLY">{TERMINOLOGY.FINANCIAL.MONTHLY || "Monthly"}</option>
            <option value="YEARLY">{TERMINOLOGY.FINANCIAL.YEARLY || "Yearly"}</option>
          </select>
          {/* FIX: Swapped to our new dedicated financial terminology */}
          <button type="submit" className="btn-primary">{TERMINOLOGY.FINANCIAL.SAVE_RECURRING}</button>
        </form>
      )}

      <table className="inventory-table">
        {/* ADDED: The missing table headers */}
        <thead>
          <tr>
            <th>{TERMINOLOGY.FINANCIAL.DESCRIPTION}</th>
            <th>{TERMINOLOGY.FINANCIAL.CYCLE}</th>
            <th className="text-right">{TERMINOLOGY.FINANCIAL.AMOUNT}</th>
            <th className="text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {costs.length > 0 ? costs.map(cost => (
            <tr key={cost.id} className="inventory-row">
              <td className="td-cell font-bold">{cost.description}</td>
              <td className="td-cell text-muted font-small">{cost.cycle}</td>
              <td className="td-cell text-right text-warning font-bold">${parseFloat(cost.amount).toFixed(2)}</td>
              <td className="td-cell text-center">
                <button className="btn-icon-hover-clean" onClick={() => deleteRecurringCost(cost.id)}><CloseIcon /></button>
              </td>
            </tr>
          )) : (
            <tr className="inventory-row"><td colSpan="4" className="td-cell text-center text-muted italic">No active fixed costs.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};