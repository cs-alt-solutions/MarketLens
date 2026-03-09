/* src/context/InventoryContext.jsx */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [materials, setMaterials] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [draftProjects, setDraftProjects] = useState([]);
  const [vendors, setVendors] = useState([]); 
  const [pendingShipments, setPendingShipments] = useState([]);
  const [logisticsIntel, setLogisticsIntel] = useState({ maxOrders: 0, bottleneck: null });
  const [loading, setLoading] = useState(true); 

  // --- INTERNAL ENGINES (UI Display Logic) ---
  const calculateSmartReorder = (invData, vendorsData) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return invData.map(item => {
        let totalBurn = 0;
        (item.history || []).forEach(log => {
            if (log.type === 'USAGE' && new Date(log.date) > thirtyDaysAgo) {
                totalBurn += Math.abs(log.qty);
            }
        });

        if (totalBurn === 0) return { ...item, calculatedStatus: 'STOCKED', reorderDate: null, dailyBurn: 0 };

        const dailyBurn = totalBurn / 30;
        const daysUntilZero = item.qty / dailyBurn;
        const vendor = vendorsData.find(v => v.id === item.vendorId);
        const leadTime = vendor?.leadTime || 7;
        const safetyMargin = 3;
        const daysUntilOrderNeeded = daysUntilZero - leadTime - safetyMargin;
        
        let newStatus = 'STOCKED';
        let reorderDate = null;

        if (daysUntilOrderNeeded <= 0) {
            newStatus = 'OUT_OF_STOCK';
            reorderDate = 'NOW';
        } else if (daysUntilOrderNeeded <= 7) {
            newStatus = 'LOW_STOCK';
            const orderOn = new Date();
            orderOn.setDate(orderOn.getDate() + Math.floor(daysUntilOrderNeeded));
            reorderDate = orderOn.toISOString().split('T')[0];
        }

        return { ...item, calculatedStatus: newStatus, dailyBurn, reorderDate };
    });
  };

  const calculateCommittedStock = (invData, activeProjs) => {
     let committedMap = {};
     invData.forEach(m => committedMap[m.id] = 0);

     activeProjs.forEach(proj => {
         if (proj.status === 'In Progress' && proj.recipe) {
             const intendedBatch = proj.intendedBatchSize || 0; 
             if (intendedBatch > 0) {
                 proj.recipe.forEach(item => {
                     if (committedMap[item.matId] !== undefined) {
                         committedMap[item.matId] += (item.reqPerUnit * intendedBatch);
                     }
                 });
             }
         }
     });

     return invData.map(m => ({
         ...m,
         committedQty: committedMap[m.id] || 0,
         availableQty: m.qty - (committedMap[m.id] || 0) 
     }));
  };

  const calculateLogisticsCapacity = (invData) => {
    const shippingSupplies = invData.filter(item => 
      ['Shipping', 'Packaging'].includes(item.category)
    );

    if (shippingSupplies.length === 0) return { maxOrders: 0, bottleneck: 'No Shipping Data' };

    let minCapacity = Infinity;
    let bottleneckItem = null;

    shippingSupplies.forEach(item => {
      if (item.qty < minCapacity) {
        minCapacity = item.qty;
        bottleneckItem = item.name;
      }
    });

    return {
      maxOrders: minCapacity === Infinity ? 0 : minCapacity,
      bottleneck: bottleneckItem
    };
  };

  // --- READ FROM SUPABASE (UI Data Fetch) ---
  const fetchStudioData = useCallback(async () => {
    setLoading(true); 
    try {
      const [invRes, projRes, vendorRes, shipRes] = await Promise.all([
        supabase.from('inventory').select('*').order('name', { ascending: true }),
        supabase.from('projects').select('*'),
        supabase.from('vendors').select('*').order('name', { ascending: true }),
        supabase.from('shipments').select('*').eq('status', 'PENDING')
      ]);

      if (invRes.error) throw invRes.error;
      const rawVendors = vendorRes.data || [];
      const rawProjects = projRes.data || [];
      let rawMaterials = invRes.data || [];

      rawMaterials = calculateSmartReorder(rawMaterials, rawVendors);
      const activeProjFilter = rawProjects.filter(p => p.status === 'In Progress' || p.status === 'Completed' || p.status === 'active');
      rawMaterials = calculateCommittedStock(rawMaterials, activeProjFilter);

      setLogisticsIntel(calculateLogisticsCapacity(rawMaterials));
      setPendingShipments(shipRes.data || []);
      setMaterials(rawMaterials);
      setVendors(rawVendors);
      setActiveProjects(activeProjFilter);
      setDraftProjects(rawProjects.filter(p => p.status === 'Planning' || p.status === 'Draft' || p.status === 'idea' || !p.status));

    } catch (err) {
      console.error("Supabase Error fetching studio telemetry:", err);
    } finally {
      setLoading(false); 
    }
  }, []);

  useEffect(() => {
    fetchStudioData();
  }, [fetchStudioData]);

  // --- ACTIONS (Write via Python Engine) ---

  // 🔥 THE PYTHON BRIDGE FOR SMART TAXONOMY 🔥
  const addMaterial = async (payload) => {
    try {
      // TODO: Replace this URL with your actual Python math_engine endpoint (e.g., localhost:8000/api/intake)
      // We send the JSON to Python, let Python do the math, and let Python write to Supabase.
      /*
      const response = await fetch('http://localhost:5000/api/engine/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Python Engine rejected the payload");
      */

      // [DEV FALLBACK] If your Python engine API isn't live yet, we insert directly so the UI still works today!
      await supabase.from('inventory').insert([payload]);
      
      // Once Python/Supabase is updated, we refresh the UI
      fetchStudioData();
    } catch (err) {
      console.error("Failed to process material through math engine:", err);
    }
  };

  // Other Actions...
  const updateInventoryItem = async (id, updates) => {
    await supabase.from('inventory').update(updates).eq('id', id);
    fetchStudioData();
  };

  const deleteInventoryItem = async (id) => {
    await supabase.from('inventory').delete().eq('id', id);
    fetchStudioData();
  };

  const addVendor = async (newVendor) => {
    const { data, error } = await supabase.from('vendors').insert([newVendor]).select();
    if (error) return null;
    fetchStudioData();
    return data[0];
  };

  const updateVendor = async (id, updates) => {
    await supabase.from('vendors').update(updates).eq('id', id);
    fetchStudioData();
  };

  const deleteVendor = async (id) => {
    await supabase.from('vendors').delete().eq('id', id);
    fetchStudioData();
  };

  const addProject = async (newProject) => {
    const { data } = await supabase.from('projects').insert([newProject]).select();
    fetchStudioData();
    return data ? data[0] : null;
  };

  const updateProject = async (updatedProject) => {
    await supabase.from('projects').update(updatedProject).eq('id', updatedProject.id);
    fetchStudioData();
  };

  const deleteProject = async (id) => {
    await supabase.from('projects').delete().eq('id', id);
    fetchStudioData();
  };

  const createFulfillmentTicket = async (orderData) => {
    const { data, error } = await supabase.from('shipments').insert([
        { ...orderData, status: 'PENDING', created_at: new Date().toISOString() }
    ]).select();
    if (error) { console.error("Ticket error:", error); return null; }
    fetchStudioData();
    return data[0];
  };

  const completeFulfillment = async (shipmentId) => {
    const { error } = await supabase.from('shipments').update({ 
      status: 'SHIPPED', 
      shipped_at: new Date().toISOString() 
    }).eq('id', shipmentId);
    if (error) return false;
    fetchStudioData();
    return true;
  };

  const manufactureProduct = async (projectId, recipe, batchSize) => {
    // Note: If manufacturing requires heavy math, this should ALSO hit your Python engine eventually!
    try {
      const targetProject = [...activeProjects, ...draftProjects].find(p => p.id === projectId);
      for (const item of recipe) {
        const invItem = materials.find(m => m.id === item.matId);
        const totalNeeded = item.reqPerUnit * batchSize;
        if (!invItem || invItem.qty < totalNeeded) return { success: false, message: `Insufficient ${item.name}` };
      }
      for (const item of recipe) {
        const invItem = materials.find(m => m.id === item.matId);
        const totalNeeded = item.reqPerUnit * batchSize;
        const newQty = invItem.qty - totalNeeded;
        const historyEntry = { date: new Date().toISOString(), qty: -totalNeeded, type: 'USAGE', note: `Production run: ${targetProject?.title}` };
        const newHistory = [historyEntry, ...(invItem.history || [])];
        await supabase.from('inventory').update({ qty: newQty, history: newHistory }).eq('id', item.matId);
      }
      if (targetProject) {
        const newStockQty = (targetProject.stockQty || 0) + batchSize;
        await supabase.from('projects').update({ stockQty: newStockQty, intendedBatchSize: 0 }).eq('id', projectId);
      }
      fetchStudioData();
      return { success: true };
    } catch (err) { 
      console.error("Manufacturing Error:", err);
      return { success: false, message: "System failure during production." }; 
    }
  };

  return (
    <InventoryContext.Provider value={{ 
      materials, activeProjects, draftProjects, vendors, logisticsIntel, pendingShipments, loading, 
      fetchStudioData, 
      addMaterial, // EXPORTING THE CORRECT FUNCTION NAME NOW
      updateInventoryItem, deleteInventoryItem,
      addProject, updateProject, deleteProject, manufactureProduct,
      addVendor, updateVendor, deleteVendor, createFulfillmentTicket, completeFulfillment
    }}>
      {children}
    </InventoryContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useInventory = () => useContext(InventoryContext);