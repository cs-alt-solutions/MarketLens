import React, { useState, useEffect } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { useFinancial } from '../../context/FinancialContext';
import { StatCard } from '../../components/StatCard';
import { ProjectCard } from '../../components/ProjectCard';
import { StampHeader } from '../../components/StampHeader'; // IMPORT NEW COMPONENT
import { formatCurrency } from '../../utils/formatters';
import { TERMINOLOGY } from '../../utils/glossary'; 
import './DashboardHome.css'; 

// ... (AnimatedNumber helper remains the same) ...
const AnimatedNumber = ({ value, formatter = (v) => v }) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1000; 
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = value / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{formatter(displayValue)}</span>;
};

export const DashboardHome = ({ onNavigate }) => {
  const { projects, materials } = useInventory();
  const { transactions } = useFinancial();

  const activeProjects = projects.filter(p => p.status === 'active');
  const lowStockItems = materials.filter(m => m.qty > 0 && m.qty < 10);
  const outOfStockItems = materials.filter(m => m.qty === 0);
  
  const totalRev = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const totalCost = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const netProfit = totalRev - totalCost;

  return (
    <div className="radar-scroll-area" style={{ position: 'relative' }}>
      <div className="scanline-overlay" />

      {/* HEADER SECTION */}
      <div className="inventory-header" style={{ position: 'relative', zIndex: 2 }}>
        <div>
          <h2 className="header-title">{TERMINOLOGY.GENERAL.SYSTEMS_LABEL}</h2>
          <span className="header-subtitle">{TERMINOLOGY.WORKSHOP.HUB_SUBTITLE}</span>
        </div>
        <div className="flex-center">
            <span className="label-industrial text-warning pulse-warning">
                {TERMINOLOGY.MODES.SIMULATION}
            </span>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="inventory-metrics" style={{ position: 'relative', zIndex: 2 }}>
         <StatCard 
            label={TERMINOLOGY.FINANCE.NET} 
            value={<AnimatedNumber value={netProfit} formatter={formatCurrency} />} 
            glowColor={netProfit >= 0 ? "teal" : "red"} 
            onClick={() => onNavigate('matrix')}
         />
         <StatCard 
            label={TERMINOLOGY.WORKSHOP.ACTIVE_OPS} 
            value={<AnimatedNumber value={activeProjects.length} />} 
            glowColor="purple" 
            onClick={() => onNavigate('workshop')}
         />
         <StatCard 
            label={TERMINOLOGY.INVENTORY.NOTIFICATIONS} 
            value={<AnimatedNumber value={lowStockItems.length + outOfStockItems.length} />} 
            glowColor={lowStockItems.length > 0 ? "orange" : "teal"} 
            isAlert={outOfStockItems.length > 0}
            onClick={() => onNavigate('inventory')}
         />
      </div>

      <div className="dashboard-grid">
        
        {/* --- LEFT COL: WORKSHOP --- */}
        <div className="dashboard-col-left">
            
            {/* NEW STAMP HEADER: Replaces "Active Builds" text */}
            <StampHeader status="active" label={TERMINOLOGY.STATUS.ACTIVE} />
            
            {activeProjects.length === 0 ? (
                <div className="panel-industrial pad-20 text-center text-muted italic">
                    {TERMINOLOGY.GENERAL.NO_DATA}
                    <div className="mt-20">
                        <button className="text-accent underline" onClick={() => onNavigate('workshop')}>
                            {TERMINOLOGY.WORKSHOP.NEW_PROJECT}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="workshop-grid">
                    {activeProjects.slice(0, 2).map(p => (
                        <ProjectCard 
                            key={p.id} 
                            project={p} 
                            readOnly={true} 
                            showStatus={false} /* Hides the stamp on the card itself */
                            onClick={() => onNavigate('workshop')} 
                        />
                    ))}
                </div>
            )}
        </div>

        {/* --- RIGHT COL: INVENTORY --- */}
        <div className="dashboard-col-right">
             <div className="section-separator mt-20">
               <span className="separator-label text-warning">{TERMINOLOGY.INVENTORY.HEADER}</span>
               <div className="separator-line" />
            </div>
            
            <div className="panel-industrial">
                <div className="panel-header">
                    <span className="label-industrial">{TERMINOLOGY.STATUS.LOW_STOCK}</span>
                </div>
                <div className="panel-content no-pad">
                    {lowStockItems.length === 0 && outOfStockItems.length === 0 ? (
                        <div className="pad-20 text-muted font-small">{TERMINOLOGY.STATUS.STOCKED}</div>
                    ) : (
                        <table className="inventory-table dashboard-alert-table">
                            <tbody>
                                {outOfStockItems.map(m => (
                                    <tr key={m.id} className="inventory-row status-alert" onClick={() => onNavigate('inventory')}>
                                        <td className="td-cell font-bold pulse-critical">{TERMINOLOGY.STATUS.OUT_OF_STOCK}</td>
                                        <td className="td-cell">{m.name}</td>
                                    </tr>
                                ))}
                                {lowStockItems.map(m => (
                                    <tr key={m.id} className="inventory-row status-warning" onClick={() => onNavigate('inventory')}>
                                        <td className="td-cell text-warning font-bold">{TERMINOLOGY.STATUS.LOW_STOCK}</td>
                                        <td className="td-cell">{m.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* ... (Market Radar Ticker section remains same) ... */}
       <div className="mt-20" style={{ position: 'relative', zIndex: 2 }}>
         <div className="section-separator">
            <span className="separator-label text-muted">{TERMINOLOGY.MARKET.HEADER}</span>
            <div className="separator-line" />
         </div>
         <div 
            className="panel-industrial pad-20 flex-between cursor-pointer hover-glow"
            onClick={() => onNavigate('radar')}
            style={{ overflow: 'hidden' }}
         >
            <div className="flex-col" style={{ minWidth: '150px', zIndex: 10, background: 'var(--bg-panel)' }}>
                <span className="label-industrial">{TERMINOLOGY.MARKET.PULSE_HEADER}</span>
                <span className="text-muted font-small">{TERMINOLOGY.MODES.SIMULATION}</span>
            </div>
            <div className="ticker-container w-full">
                <div className="ticker-content">
                    <span className="ticker-item">SOY WAX <span className="ticker-value ticker-trend-up">▲ $2.15/lb</span></span>
                    <span className="ticker-item">FRAGRANCE OIL <span className="ticker-value">● $18.50/lb</span></span>
                    <span className="ticker-item">SHIPPING (DOMESTIC) <span className="ticker-value ticker-trend-down">▼ $4.20/avg</span></span>
                    <span className="ticker-item">BEESWAX <span className="ticker-value ticker-trend-up">▲ $8.50/lb</span></span>
                    <span className="ticker-item">GLASS JARS (8oz) <span className="ticker-value">● $0.85/ea</span></span>
                    <span className="ticker-item">WICKING (CD-12) <span className="ticker-value ticker-trend-down">▼ $0.05/ea</span></span>
                </div>
            </div>
            <div className="text-right" style={{ minWidth: '100px', zIndex: 10, background: 'var(--bg-panel)' }}>
                 <div className="font-mono text-accent">{TERMINOLOGY.MARKET.SCANNING}</div>
            </div>
         </div>
      </div>
    </div>
  );
};