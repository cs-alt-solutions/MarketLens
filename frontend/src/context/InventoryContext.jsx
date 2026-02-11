import React, { createContext, useContext, useState } from 'react';
import { MOCK_PROJECTS } from '../data/mockData';
import { convertToStockUnit } from '../utils/units';

// --- INITIAL MOCK DATA ---
const INITIAL_MATERIALS = [
  { id: 101, name: 'Soy Wax', brand: 'Golden Brands 464', category: 'Raw Material', qty: 45, unit: 'lbs', costPerUnit: 3.50, status: 'Active', usageType: 'Project Component', lastUsed: '2026-02-09', history: [] },
  { id: 102, name: 'Glass Jars', brand: '8oz Amber', category: 'Packaging', qty: 120, unit: 'count', costPerUnit: 1.10, status: 'Active', usageType: 'Project Component', lastUsed: '2025-11-15', history: [] },
  { id: 103, name: 'Walnut Stain', brand: 'Minwax Dark', category: 'Consumables', qty: 0.5, unit: 'gal', costPerUnit: 24.00, status: 'Dormant', usageType: 'Project Component', lastUsed: '2025-09-01', history: [] },
  { id: 104, name: 'Brass Rods', brand: '1/4 Inch Solid', category: 'Hardware', qty: 0, unit: 'ft', costPerUnit: 6.00, status: 'Active', usageType: 'Project Component', lastUsed: '2026-02-05', history: [] },
  { id: 105, name: 'Cotton Wicks', brand: 'CD-12', category: 'Hardware', qty: 500, unit: 'count', costPerUnit: 0.05, status: 'Active', usageType: 'Project Component', lastUsed: '2026-02-01', history: [] },
  { id: 106, name: 'Fragrance Oil', brand: 'Santal & Coconut', category: 'Raw Material', qty: 32, unit: 'oz', costPerUnit: 2.20, status: 'Active', usageType: 'Project Component', lastUsed: '2026-02-10', history: [] },
];

const INITIAL_INSIGHTS = [
  { id: 'tm1', name: "Pet Architecture", growth: "+210%", score: 98, desc: "Modern furniture for pets." },
  { id: 'tm2', name: "Gothic Home Decor", growth: "+125%", score: 85, desc: "Dark aesthetic pieces." },
];

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [projects, setProjects] = useState(MOCK_PROJECTS.map(p => ({ ...p, stockQty: 0, retailPrice: 0 })));
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [marketInsights, setMarketInsights] = useState(INITIAL_INSIGHTS);

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
        const historyEntry = { date: new Date().toISOString().split('T')[0], qty: addedQty, unitCost: (totalCost/addedQty), type: 'RESTOCK' };
        return { ...m, qty: newTotalQty, costPerUnit: newUnitCost, lastUsed: new Date().toISOString().split('T')[0], history: [historyEntry, ...(m.history || [])] };
      }
      return m;
    }));
  };

  // ACTIONS: MANUFACTURING (The Engine)
  const manufactureProduct = (projectId, recipe, batchSize = 1) => {
    let sufficientStock = true;
    let missingItem = '';
    
    // Check Stock
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
    
    // Deduct Stock
    setMaterials(prev => prev.map(m => {
      const ingredient = recipe.find(r => r.matId === m.id);
      if (ingredient) {
        const totalDeduct = convertToStockUnit(ingredient.reqPerUnit, ingredient.unit, m.unit) * batchSize;
        batchCost += (totalDeduct * m.costPerUnit);
        return { ...m, qty: m.qty - totalDeduct, lastUsed: today };
      }
      return m;
    }));

    // Update Project Stock
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
      manufactureProduct
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useInventory = () => useContext(InventoryContext);