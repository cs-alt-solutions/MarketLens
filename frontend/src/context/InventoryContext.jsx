import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PROJECTS, INITIAL_MATERIALS, INITIAL_INSIGHTS } from '../data/mockData';
import { convertToStockUnit } from '../utils/units';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [projects, setProjects] = useState(MOCK_PROJECTS.map(p => ({ ...p, stockQty: 0, retailPrice: 0 })));
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [marketInsights, setMarketInsights] = useState(INITIAL_INSIGHTS);
  
  // Migrated from WorkbenchContext
  const [lastEtsyPulse, setLastEtsyPulse] = useState(localStorage.getItem('lastEtsyPulse') || null);

  useEffect(() => {
    const triggerKeepAlivePulse = () => {
      const thirtyDays = 30 * 24 * 60 * 60 * 1000; 
      const now = Date.now();
      const lastPulseTime = lastEtsyPulse ? new Date(lastEtsyPulse).getTime() : 0;

      if (now - lastPulseTime > thirtyDays) {
        const today = new Date().toISOString();
        localStorage.setItem('lastEtsyPulse', today);
        setLastEtsyPulse(today);
      }
    };
    triggerKeepAlivePulse();
  }, [lastEtsyPulse]);

  // ACTIONS: PROJECTS
  const addProject = (title) => {
    const newProj = {
      id: crypto.randomUUID(),
      title,
      status: 'active',
      stockQty: 0,
      retailPrice: 0,
      demand: 'Unknown',
      competition: 'Unknown',
      created_at: new Date().toISOString(),
      missions: [],
      tags: []
    };
    setProjects([newProj, ...projects]);
  };

  const updateProject = (updatedProject) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // ACTIONS: INVENTORY
  const addAsset = (asset) => setMaterials(prev => [asset, ...prev]);
  const updateAsset = (id, updates) => setMaterials(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  
  const restockAsset = (id, addedQty, totalCost) => {
    setMaterials(prev => prev.map(m => {
      if (m.id === id) {
        const newTotalQty = (parseFloat(m.qty) || 0) + parseFloat(addedQty);
        const oldTotalValue = (parseFloat(m.qty) || 0) * m.costPerUnit;
        const newTotalValue = oldTotalValue + parseFloat(totalCost);
        const newUnitCost = newTotalQty > 0 ? newTotalValue / newTotalQty : m.costPerUnit;
        const historyEntry = { 
            date: new Date().toISOString().split('T')[0], 
            qty: addedQty, 
            unitCost: (totalCost/addedQty), 
            type: 'RESTOCK' 
        };
        return { ...m, qty: newTotalQty, costPerUnit: newUnitCost, lastUsed: new Date().toISOString().split('T')[0], history: [historyEntry, ...(m.history || [])] };
      }
      return m;
    }));
  };

  // ACTIONS: MANUFACTURING
  const manufactureProduct = (projectId, recipe, batchSize = 1) => {
    let sufficientStock = true;
    let missingItem = '';
    
    recipe.forEach(item => {
      const mat = materials.find(m => m.id === parseInt(item.matId));
      if (mat) {
        const totalReq = convertToStockUnit(item.reqPerUnit, item.unit, mat.unit) * batchSize;
        if (mat.qty < totalReq) {
          sufficientStock = false;
          missingItem = `${mat.name} (Need ${totalReq.toFixed(2)} ${mat.unit})`;
        }
      }
    });

    if (!sufficientStock) return { success: false, message: `Insufficient Inventory: ${missingItem}` };

    let batchCost = 0;
    const today = new Date().toISOString().split('T')[0];
    
    setMaterials(prev => prev.map(m => {
      const ingredient = recipe.find(r => r.matId === m.id);
      if (ingredient) {
        const totalDeduct = convertToStockUnit(ingredient.reqPerUnit, ingredient.unit, m.unit) * batchSize;
        batchCost += (totalDeduct * m.costPerUnit);
        return { ...m, qty: m.qty - totalDeduct, lastUsed: today };
      }
      return m;
    }));

    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, status: 'active', stockQty: (p.stockQty || 0) + batchSize } : p
    ));

    return { success: true, message: `Manufactured ${batchSize} Units. Cost: $${batchCost.toFixed(2)}`, cost: batchCost };
  };

  return (
    <InventoryContext.Provider value={{
      projects, addProject, updateProject, deleteProject,
      materials, addAsset, updateAsset, restockAsset,
      marketInsights, setMarketInsights,
      manufactureProduct,
      lastEtsyPulse
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useInventory = () => useContext(InventoryContext);