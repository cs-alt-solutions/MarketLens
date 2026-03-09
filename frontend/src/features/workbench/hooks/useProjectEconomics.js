/* src/features/workbench/hooks/useProjectEconomics.js */
import { useState, useEffect } from 'react';
import { useInventory } from '../../../context/InventoryContext';

export const useProjectEconomics = (project) => {
  const { materials = [] } = useInventory(); 
  
  const [metrics, setMetrics] = useState({
    materialCost: 0,
    platformFees: 0,
    netProfit: 0,
    marginPercent: 0,
    isCalculating: false,
    isEngineVerified: false
  });

  useEffect(() => {
    let isActive = true;

    const calculateEconomics = async () => {
      if (!project) return;
      
      setMetrics(prev => ({ ...prev, isCalculating: true, isEngineVerified: false }));
      
      let totalMaterialCost = 0;
      let engineSuccess = true;

      // 1. Calculate BOM Cost
      if (project?.recipe?.length > 0) {
        const costPromises = project.recipe.map(async (item) => {
          const mat = materials.find(m => m.id === item.matId);
          if (!mat) return 0;

          const localFallbackCost = (parseFloat(mat.costPerUnit) || 0) * (parseFloat(item.reqPerUnit) || 0);

          try {
            // 🧠 Ping the Cerebrum for exact calculations
            const response = await fetch('http://localhost:8000/api/engine/calculate-cost', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                price: parseFloat(mat.costPerUnit) || 0,
                buy_qty: 1, 
                buy_unit: 'ea', 
                use_qty: parseFloat(item.reqPerUnit) || 0,
                use_unit: 'ea' 
              })
            });

            if (!response.ok) throw new Error('Engine Offline');
            const data = await response.json();
            return data.engine_cost;

          } catch (err) {
            console.warn("⚠️ Cerebrum Fallback Activated:", err.message);
            engineSuccess = false;
            return localFallbackCost;
          }
        });

        const resolvedCosts = await Promise.all(costPromises);
        totalMaterialCost = resolvedCosts.reduce((acc, cost) => acc + cost, 0);
      }

      if (!isActive) return;

      // 2. Calculate Final Economics
      const retailPrice = parseFloat(project?.retailPrice) || 0;
      const platformFees = retailPrice > 0 ? (retailPrice * (6.5 / 100)) + 0.20 : 0;
      const netProfit = retailPrice - totalMaterialCost - platformFees;
      const marginPercent = retailPrice > 0 ? (netProfit / retailPrice) * 100 : 0;

      setMetrics({
        materialCost: totalMaterialCost,
        platformFees,
        netProfit,
        marginPercent,
        isCalculating: false,
        isEngineVerified: engineSuccess && project?.recipe?.length > 0
      });
    };

    calculateEconomics();

    return () => { isActive = false; };
  }, [project, materials]);

  return metrics;
};