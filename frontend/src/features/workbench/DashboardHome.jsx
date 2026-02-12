/* src/features/workbench/DashboardHome.jsx */
import React, { useState, useMemo } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { useFinancialStats } from '../../context/FinancialContext';
import { StatCard } from '../../components/cards/StatCard';
import { AnimatedNumber } from '../../components/charts/AnimatedNumber';
import { BarChart } from '../../components/charts/BarChart';
import { formatCurrency } from '../../utils/formatters';
import { TERMINOLOGY, MARKET_TICKER_DATA } from '../../utils/glossary'; 
import { Alert, History, Box, Finance, WorkshopIcon, Radar } from '../../components/Icons';
import './DashboardHome.css'; 
import { convertToStockUnit } from '../../utils/units';

export const DashboardHome = ({ onNavigate }) => {
  const { activeProjects, draftProjects, materials } = useInventory();
  const { netProfit, totalRev, totalCost } = useFinancialStats();
  
  const [workshopTab, setWorkshopTab] = useState('FLEET'); 
  const [invTab, setInvTab] = useState('LOGISTICS'); 

  // --- ENGINE 1: CROSS-REFERENCE & PRODUCTION HEALTH ---
  const fleetAnalysis = useMemo(() => {
    return activeProjects.map(p => {
        let maxBuildable = 9999;
        let limitingMaterial = null;

        // FIX: Added safety check (p.recipe?.length)
        if (p.recipe && p.recipe.length > 0) {
            p.recipe.forEach(ing => {
                const mat = materials.find(m => m.id === ing.matId);
                if (mat) {
                    const cost = convertToStockUnit(ing.reqPerUnit, ing.unit, mat.unit);
                    const possible = cost > 0 ? Math.floor(mat.qty / cost) : 0;
                    if (possible < maxBuildable) {
                        maxBuildable = possible;
                        limitingMaterial = mat.name;
                    }
                }
            });
        } else {
            maxBuildable = 0; 
        }
        
        let health = 'GOOD';
        if (p.stockQty === 0) health = 'CRITICAL';
        else if (p.stockQty < 5) health = 'LOW';
        
        let productionStatus = 'READY';
        // FIX: Added safety check (p.recipe?.length) to prevent crash
        if (maxBuildable === 0 && p.recipe?.length > 0) productionStatus = 'HALTED';

        return { 
            ...p, 
            maxBuildable: maxBuildable === 9999 ? 0 : maxBuildable, 
            limitingMaterial, 
            health, 
            productionStatus 
        };
    });
  }, [activeProjects, materials]);

  // --- ENGINE 2: DRAFT DIAGNOSTICS ---
  const draftAnalysis = useMemo(() => {
      return draftProjects.map(p => {
          const missing = [];
          if (!p.retailPrice) missing.push("Price");
          if (!p.tags || p.tags.length === 0) missing.push("Tags");
          if (!p.recipe || p.recipe.length === 0) missing.push("Recipe");
          return { ...p, missing };
      });
  }, [draftProjects]);

  // --- ENGINE 3: LOGISTICS ---
  const { inventoryIntel, logisticsIntel } = useMemo(() => {
    const today = new Date();
    const STAGNANT_THRESHOLD_DAYS = 30;

    const inv = materials.reduce((acc, m) => {
      if (m.qty === 0) acc.out.push(m);
      else if (m.qty < 10) acc.low.push(m);
      else acc.good.push(m);

      if (m.lastUsed) {
        const lastDate = new Date(m.lastUsed);
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > STAGNANT_THRESHOLD_DAYS && m.qty > 0) {
          acc.stagnant.push({ ...m, daysInactive: diffDays });
        }
      }
      return acc;
    }, { out: [], low: [], good: [], stagnant: [] });

    const shippingItems = materials.filter(m => m.category === 'Shipping');
    let maxShipments = 9999;
    let limitingFactor = 'None';
    
    const criticalTypes = [
        { pattern: /box|mailer/i, name: 'Containers' },
        { pattern: /label/i, name: 'Labels' },
        { pattern: /tape/i, name: 'Tape' } 
    ];

    criticalTypes.forEach(type => {
        const items = shippingItems.filter(m => type.pattern.test(m.name));
        const totalStock = items.reduce((sum, m) => sum + m.qty, 0);
        if (totalStock < maxShipments) {
            maxShipments = totalStock;
            limitingFactor = items.length > 0 ? items[0].name : type.name;
        }
    });
    if (shippingItems.length === 0) { maxShipments = 0; limitingFactor = "No Data"; }

    return { 
        inventoryIntel: inv, 
        logisticsIntel: { maxShipments, limitingFactor, shippingItems } 
    };
  }, [materials]);

  const productionChartData = fleetAnalysis.map(p => ({ label: p.title.substring(0,6), value: p.stockQty }));

  return (
    <div className="dashboard-container">
      <div className="scanline-overlay" />

      {/* --- SECTOR A: HUD --- */}
      <div className="hud-top-bar z-layer-top">
        <div className="hud-metric-group">
            <div className="hud-label text-muted">{TERMINOLOGY.FINANCE.REVENUE}</div>
            <div className="hud-value text-teal">
                <AnimatedNumber value={totalRev} formatter={formatCurrency} />
            </div>
        </div>
        <div className="hud-divider" />
        <div className="hud-metric-group">
            <div className="hud-label text-muted">{TERMINOLOGY.FINANCE.EXPENSE}</div>
            <div className="hud-value text-orange">
                <AnimatedNumber value={totalCost} formatter={formatCurrency} />
            </div>
        </div>
        <div className="hud-divider" />
        <div className="hud-metric-group">
            <div className="hud-label text-muted">{TERMINOLOGY.FINANCE.NET}</div>
            <div className={`hud-value ${netProfit >= 0 ? 'text-good' : 'text-alert'}`}>
                <AnimatedNumber value={netProfit} formatter={formatCurrency} />
            </div>
        </div>
        <div className="hud-spacer" />
        <div className="hud-status">
            <span className="status-indicator-dot active"></span> {TERMINOLOGY.DASHBOARD.TELEMETRY}: ONLINE
        </div>
      </div>

      <div className="dashboard-content-scroll">
          <div className="dashboard-grid z-layer-top relative">
            
            {/* --- SECTOR B: THE WORKSHOP --- */}
            <div className="dashboard-col-main">
                <div className="panel-tabs mb-15">
                     <button 
                        className={`tab-btn ${workshopTab === 'FLEET' ? 'active purple' : ''}`}
                        onClick={() => setWorkshopTab('FLEET')}
                    >
                        <WorkshopIcon /> {TERMINOLOGY.WORKSHOP.TAB_FLEET} ({fleetAnalysis.length})
                    </button>
                    <button 
                        className={`tab-btn ${workshopTab === 'LAB' ? 'active dormant' : ''}`}
                        onClick={() => setWorkshopTab('LAB')}
                    >
                        <Box /> {TERMINOLOGY.WORKSHOP.TAB_LAB} ({draftAnalysis.length})
                    </button>
                </div>
                
                {workshopTab === 'FLEET' && (
                    <div className="dashboard-deck">
                        <div className="panel-industrial pad-20">
                            <div className="flex-between mb-10">
                                <span className="label-industrial text-muted">STOCK LEVELS</span>
                                <span className="text-accent font-mono font-small">REAL-TIME</span>
                            </div>
                            {productionChartData.length > 0 ? (
                                <BarChart data={productionChartData} maxVal={50} colorVar="--neon-purple" height={100} />
                            ) : <div className="text-muted italic">No active production.</div>}
                        </div>

                        {fleetAnalysis.map(p => (
                            <div key={p.id} className="panel-industrial pad-20 clickable hover-glow" onClick={() => onNavigate('workshop')}>
                                <div className="flex-between mb-10">
                                    <span className="font-bold">{p.title}</span>
                                    <span className={`font-mono font-small ${p.health === 'CRITICAL' ? 'text-alert' : 'text-good'}`}>
                                        {p.stockQty} {TERMINOLOGY.GENERAL.UNITS}
                                    </span>
                                </div>
                                <div className="logistics-divider mb-10" />
                                <div className="flex-between font-small">
                                    <span className="text-muted">{TERMINOLOGY.WORKSHOP.CAN_BUILD}</span>
                                    <span className={p.productionStatus === 'HALTED' ? 'text-alert font-bold' : 'text-accent'}>
                                        {p.productionStatus === 'HALTED' ? '0 (HALTED)' : `+${p.maxBuildable}`}
                                    </span>
                                </div>
                                {p.productionStatus === 'HALTED' && p.limitingMaterial && (
                                    <div className="mt-10 font-small text-alert">
                                        ⚠ Low: {p.limitingMaterial}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {workshopTab === 'LAB' && (
                    <div className="dashboard-deck">
                        {draftAnalysis.map(p => (
                            <div key={p.id} className="panel-industrial pad-20 opacity-80 clickable hover-glow" onClick={() => onNavigate('workshop')}>
                                <div className="flex-between mb-5">
                                    <span className="font-bold text-muted">{p.title}</span>
                                    <span className="label-industrial no-margin">{TERMINOLOGY.STATUS.DRAFT}</span>
                                </div>
                                <div className="mt-10 p-10 bg-darker border-subtle">
                                    <div className="font-small text-warning mb-5">{TERMINOLOGY.WORKSHOP.MISSING}</div>
                                    <div className="flex-wrap gap-5">
                                        {p.missing.length > 0 ? p.missing.map(m => (
                                            <span key={m} className="status-indicator-dot warning-text">{m}</span>
                                        )) : <span className="text-good">Ready to Launch!</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                         {draftAnalysis.length === 0 && <div className="text-muted italic pad-20">No active drafts.</div>}
                    </div>
                )}
            </div>

            {/* --- SECTOR C: LOGISTICS --- */}
            <div className="dashboard-col-side">
                <div className="panel-industrial full-height-panel">
                    <div className="panel-tabs">
                        <button 
                            className={`tab-btn ${invTab === 'LOGISTICS' ? 'active teal' : ''}`}
                            onClick={() => setInvTab('LOGISTICS')}
                        >
                            <Radar /> {TERMINOLOGY.LOGISTICS.TAB}
                        </button>
                        <button 
                            className={`tab-btn ${invTab === 'CRITICAL' ? 'active alert' : ''}`}
                            onClick={() => setInvTab('CRITICAL')}
                        >
                            <Alert /> OUT ({inventoryIntel.out.length})
                        </button>
                    </div>

                    <div className="panel-content no-pad overflow-y-auto">
                        {invTab === 'LOGISTICS' && (
                            <div className="logistics-sim-view">
                                <div className="sim-header pad-20">
                                    <div className="label-industrial text-muted">{TERMINOLOGY.LOGISTICS.CAPACITY}</div>
                                    <div className={`sim-big-number ${logisticsIntel.maxShipments < 20 ? 'text-alert' : 'text-accent'}`}>
                                        {Math.floor(logisticsIntel.maxShipments)} <span className="text-muted font-small">PACKAGES</span>
                                    </div>
                                    {logisticsIntel.maxShipments < 50 && (
                                        <div className="sim-bottleneck">
                                            <span className="text-warning">⚠ {TERMINOLOGY.LOGISTICS.BOTTLENECK}:</span>
                                            <span className="font-bold ml-5">{logisticsIntel.limitingFactor}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="logistics-divider" />
                                <div className="pad-20">
                                    <div className="label-industrial mb-10 text-muted">{TERMINOLOGY.LOGISTICS.SIM}</div>
                                    {logisticsIntel.shippingItems.map(m => (
                                        <div key={m.id} className="flex-between mb-5 font-small">
                                            <span>{m.name}</span>
                                            <span className={m.qty < 20 ? 'text-alert' : 'text-good'}>{m.qty}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {invTab === 'CRITICAL' && (
                            inventoryIntel.out.length > 0 ? (
                                <table className="inventory-table dashboard-alert-table">
                                    <tbody>
                                        {inventoryIntel.out.map(m => (
                                            <tr key={m.id} className="inventory-row status-alert clickable" onClick={() => onNavigate('inventory')}>
                                                <td className="td-cell font-bold text-alert">{m.name}</td>
                                                <td className="td-cell text-right">0 {m.unit}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : <div className="good-state">NOMINAL</div>
                        )}
                    </div>
                </div>
            </div>
          </div>
      </div>

       <div className="dashboard-footer z-layer-top">
         <div className="ticker-panel">
            <div className="ticker-label"><Finance /> MARKET DATA //</div>
            <div className="ticker-wrap">
                <div className="ticker-move">
                    {[...MARKET_TICKER_DATA, ...MARKET_TICKER_DATA].map((item, idx) => (
                        <div key={idx} className="ticker-item">
                            <span className="label-industrial no-margin text-muted">{item.label}</span> 
                            <span className={`ticker-value ticker-trend-${item.trend} font-mono ml-10`}>
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};