/* src/features/workbench/components/ExpenseXRay.jsx */
import React, { useMemo } from 'react';
import { formatCurrency } from '../../../utils/formatters';

export const ExpenseXRay = ({ transactions, recurringCosts }) => {
  const data = useMemo(() => {
    let materials = 0;
    let logistics = 0;
    let overhead = 0;
    let other = 0;

    // Tally recurring overhead (normalize yearly to monthly for the visual)
    recurringCosts.forEach(c => {
      overhead += (c.cycle?.toLowerCase() === 'yearly' ? (c.amount / 12) : c.amount) || 0;
    });

    // Tally transaction expenses via smart keyword parsing
    transactions.filter(tx => tx.type === 'EXPENSE').forEach(tx => {
      const desc = tx.description?.toLowerCase() || '';
      const amt = parseFloat(tx.amount) || 0;
      
      if (desc.includes('ship') || desc.includes('label') || desc.includes('pack') || desc.includes('box')) {
        logistics += amt;
      } else if (desc.includes('lumber') || desc.includes('wood') || desc.includes('resin') || desc.includes('wax') || desc.includes('supply') || desc.includes('restock')) {
        materials += amt;
      } else if (desc.includes('sub') || desc.includes('software') || desc.includes('rent') || desc.includes('ad ')) {
        overhead += amt;
      } else {
        other += amt;
      }
    });

    const total = materials + logistics + overhead + other;
    return { materials, logistics, overhead, other, total };
  }, [transactions, recurringCosts]);

  const getWidth = (val) => data.total > 0 ? `${(val / data.total) * 100}%` : '0%';

  return (
    <div className="flex-col h-full w-full">
      <span className="label-industrial text-accent mb-15">EXPENSE X-RAY</span>
      {data.total === 0 ? (
        <div className="text-muted font-small italic">No expense data yet.</div>
      ) : (
        <div className="flex-col gap-15">
          <XRayBar label="Materials & Supplies" amount={data.materials} width={getWidth(data.materials)} color="var(--neon-cyan)" />
          <XRayBar label="Shipping & Logistics" amount={data.logistics} width={getWidth(data.logistics)} color="var(--neon-orange)" />
          <XRayBar label="Fixed Overhead & SaaS" amount={data.overhead} width={getWidth(data.overhead)} color="var(--neon-purple)" />
          {data.other > 0 && <XRayBar label="Misc Expenses" amount={data.other} width={getWidth(data.other)} color="var(--text-muted)" />}
        </div>
      )}
    </div>
  );
};

const XRayBar = ({ label, amount, width, color }) => (
  <div className="flex-col w-full">
    <div className="flex-between mb-5">
      <span className="font-mono text-tiny text-muted uppercase">{label}</span>
      <span className="font-mono text-small font-bold" style={{ color }}>{formatCurrency(amount)}</span>
    </div>
    <div className="w-full bg-app border-radius-2 h-5 overflow-hidden">
      <div className="h-full" style={{ width, backgroundColor: color, boxShadow: `0 0 8px ${color}` }}></div>
    </div>
  </div>
);