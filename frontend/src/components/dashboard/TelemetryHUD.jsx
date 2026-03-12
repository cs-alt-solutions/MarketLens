/* src/components/dashboard/TelemetryHUD.jsx */
import React from 'react';
import { AnimatedNumber } from '../charts/AnimatedNumber';
import { StatCard } from '../cards/StatCard';
import { formatCurrency } from '../../utils/formatters';
import { TERMINOLOGY } from '../../utils/glossary';

export default function TelemetryHUD({ sales = 0, expenses = 0, profit = 0, burn = 0 }) {
  return (
    <>
      <StatCard 
         label={TERMINOLOGY.FINANCE.REVENUE} 
         value={<AnimatedNumber value={sales} formatter={formatCurrency} />} 
         glowColor="teal" 
         showBeacon={true} 
      />
      <StatCard 
         label={TERMINOLOGY.FINANCE.EXPENSE} 
         value={<AnimatedNumber value={expenses} formatter={formatCurrency} />} 
         glowColor="orange" 
         showBeacon={true} 
         beaconType="warning" 
      />
      <StatCard 
         label={TERMINOLOGY.FINANCE.NET} 
         value={<AnimatedNumber value={profit} formatter={formatCurrency} />} 
         glowColor="purple" 
         showBeacon={true} 
         beaconType="purple" 
      />
      <StatCard 
         label={TERMINOLOGY.FINANCIAL.MONTHLY_BURN} 
         value={<AnimatedNumber value={burn} formatter={formatCurrency} />} 
         glowColor="red" 
         showBeacon={true} 
         beaconType="alert" 
      />
    </>
  );
}