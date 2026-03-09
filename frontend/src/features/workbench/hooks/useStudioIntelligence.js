/* src/features/workbench/hooks/useStudioIntelligence.js */
import { useMemo } from 'react';
import { convertToStockUnit } from '../../../utils/units';

export const useStudioIntelligence = (activeProjects, draftProjects, materials) => {
  // --- FLEET ANALYSIS (Production Health) ---
  const fleetAnalysis = useMemo(() => {
    return activeProjects.map(p => {
        
        // 🔥 PYTHON BRIDGE: If the backend provides the intelligence, use it immediately!
        if (p.engine_maxBuildable !== undefined && p.engine_health) {
            return {
                ...p,
                maxBuildable: p.engine_maxBuildable,
                limitingMaterial: p.engine_limitingMaterial,
                health: p.engine_health,
                productionStatus: p.engine_productionStatus
            };
        }

        // [DEV FALLBACK]: The React Math (Will be deprecated when math_engine.py is live)
        let maxBuildable = 9999;
        let limitingMaterial = null;

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
        } else { maxBuildable = 0; }
        
        let health = 'GOOD';
        if (p.stockQty === 0) health = 'CRITICAL';
        else if (p.stockQty < 5) health = 'LOW';
        
        let productionStatus = 'READY';
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

  // --- LOGISTICS & INVENTORY INTEL ---
  const logisticsData = useMemo(() => {
    
    // Grouping stock status
    const inv = materials.reduce((acc, m) => {
      // 🔥 PYTHON BRIDGE: Prefer backend tags if available
      const status = m.engine_status || (m.qty <= 0 ? 'out' : m.qty < 10 ? 'low' : 'good');
      if (status === 'out') acc.out.push(m);
      else if (status === 'low') acc.low.push(m);
      else acc.good.push(m);
      return acc;
    }, { out: [], low: [], good: [] });

    // [DEV FALLBACK] for Logistics Capacity
    const shippingItems = materials.filter(m => m.category === 'Shipping' || m.category === 'Packaging');
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

    return { 
        inventoryIntel: inv, 
        logisticsIntel: { 
          // 🔥 PYTHON BRIDGE: In the future, math_engine.py just sends `engine_maxShipments`
          maxShipments: shippingItems.length === 0 ? 0 : maxShipments, 
          limitingFactor, 
          shippingItems 
        } 
    };
  }, [materials]);

  return { fleetAnalysis, ...logisticsData };
};