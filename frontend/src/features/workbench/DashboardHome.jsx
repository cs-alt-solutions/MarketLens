import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { useFinancialStats } from '../../context/FinancialContext';
import { StatCard } from '../../components/StatCard';
import { ProjectCard } from '../../components/ProjectCard';
import { StampHeader } from '../../components/StampHeader';
import { AnimatedNumber } from '../../components/AnimatedNumber';
import { formatCurrency } from '../../utils/formatters';
import { TERMINOLOGY } from '../../utils/glossary'; 
import { MARKET_TICKER_DATA } from '../../data/mockData';
import './DashboardHome.css'; 

export const DashboardHome = ({ onNavigate }) => {
  const { projects, materials } = useInventory();
  const { netProfit } = useFinancialStats();

  const activeProjects = projects.filter(p => p.status === 'active');
  const lowStockItems = materials.filter(m => m.qty > 0 && m.qty < 10);
  const outOfStockItems = materials.filter(m => m.qty === 0);

  return (
    <div className="radar-scroll-area">
      <div className="scanline-overlay" />

      <div className="inventory-header z-layer-top">
        <div>
          <h2 className="header-title">{TERMINOLOGY.GENERAL.SYSTEMS_LABEL}</h2>
          <span className="header-subtitle">{TERMINOLOGY.WORKSHOP.HUB_SUBTITLE}</span>
        </div>
      </div>

      <div className="inventory-metrics z-layer-top">
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
        <div className="dashboard-col-left">
            <StampHeader status="active" label={TERMINOLOGY.STATUS.ACTIVE} />
            <div className="workshop-grid">
                {activeProjects.slice(0, 2).map(p => (
                    <ProjectCard 
                        key={p.id} 
                        project={p} 
                        readOnly={true} 
                        showStatus={false} 
                        onClick={() => onNavigate('workshop')} 
                    />
                ))}
            </div>
        </div>

        <div className="dashboard-col-right">
            <div className="panel-industrial">
                <div className="panel-header">
                    <span className="label-industrial">{TERMINOLOGY.STATUS.LOW_STOCK}</span>
                </div>
                <div className="panel-content no-pad">
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
                </div>
            </div>
        </div>
      </div>

       <div className="mt-20 z-layer-top">
         <div className="panel-industrial pad-20 flex-between">
            <div className="ticker-container w-full">
                <div className="ticker-content">
                    {MARKET_TICKER_DATA.map((item, idx) => (
                        <span key={idx} className="ticker-item">
                            {item.label} 
                            <span className={`ticker-value ticker-trend-${item.trend}`}>
                                {item.value}
                            </span>
                        </span>
                    ))}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};