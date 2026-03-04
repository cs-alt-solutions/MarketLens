/* src/features/workbench/hooks/useProjectEconomics.js */
import { useMemo } from 'react';
import { useInventory } from '../../../context/InventoryContext';

export const useProjectEconomics = (project) => {
  const { materials = [] } = useInventory(); 
  
  return useMemo(() => {
    let materialCost = 0;
    
    if (project?.recipe?.length > 0) {
      project.recipe.forEach(item => {
        const mat = materials.find(m => m.id === item.matId);
        if (mat) {
           materialCost += ((parseFloat(mat.costPerUnit) || 0) * (parseFloat(item.reqPerUnit) || 0));
        }
      });
    }
    
    const retailPrice = parseFloat(project?.retailPrice) || 0;
    const platformFees = retailPrice > 0 ? (retailPrice * (6.5 / 100)) + 0.20 : 0;
    const netProfit = retailPrice - materialCost - platformFees;
    const marginPercent = retailPrice > 0 ? (netProfit / retailPrice) * 100 : 0;
    
    return { materialCost, platformFees, netProfit, marginPercent };
  }, [project, materials]);
};