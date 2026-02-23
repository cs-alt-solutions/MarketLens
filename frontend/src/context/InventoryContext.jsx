/* src/context/InventoryContext.jsx */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [materials, setMaterials] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [draftProjects, setDraftProjects] = useState([]);
  const [loading, setLoading] = useState(true); 

  const fetchStudioData = useCallback(async () => {
    setLoading(true); 
    
    try {
      const { data: invData, error: invError } = await supabase
        .from('inventory')
        .select('*')
        .order('name', { ascending: true });

      if (invError) throw invError;
      setMaterials(invData || []);

      const { data: projData, error: projError } = await supabase
        .from('projects')
        .select('*');

      if (projError) throw projError;

      const allProjects = projData || [];
      
      setActiveProjects(allProjects.filter(p => p.status === 'In Progress' || p.status === 'Completed' || p.status === 'active'));
      setDraftProjects(allProjects.filter(p => p.status === 'Planning' || p.status === 'Draft' || p.status === 'draft' || !p.status));

    } catch (error) {
      console.error("Supabase Error fetching studio telemetry:", error);
    } finally {
      setLoading(false); 
    }
  }, []);

  useEffect(() => {
    fetchStudioData();
  }, [fetchStudioData]);

  // --- ASSET LOGIC ---
  const addInventoryItem = async (newItem) => {
    const { data, error } = await supabase.from('inventory').insert([newItem]).select();
    if (error) { console.error("Supabase Error adding item:", error); return null; }
    if (data) { setMaterials(prev => [...prev, data[0]]); return data[0]; }
  };

  const updateInventoryItem = async (id, updates) => {
    const { data, error } = await supabase.from('inventory').update(updates).eq('id', id).select();
    if (error) { console.error("Supabase Error updating item:", error); }
    if (data) { setMaterials(prev => prev.map(item => item.id === id ? data[0] : item)); }
  };

  // --- PROJECT LOGIC ---
  const addProject = async (newProject) => {
    const { data, error } = await supabase.from('projects').insert([newProject]).select();
    if (error) { console.error("Supabase Error adding project:", error); return null; }
    if (data) { setDraftProjects(prev => [...prev, data[0]]); return data[0]; }
  };

  const updateProject = async (updatedProject) => {
    const { data, error } = await supabase.from('projects').update(updatedProject).eq('id', updatedProject.id).select();
    if (error) { console.error("Supabase Error updating project:", error); return null; }
    if (data) { fetchStudioData(); return data[0]; }
  };

  const deleteProject = async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) { console.error("Supabase Error deleting project:", error); return false; }
    fetchStudioData(); return true;
  };

  // --- THE MANUFACTURING ENGINE (NOW WITH HISTORY LOGGING) ---
  const manufactureProduct = async (projectId, recipe, batchSize) => {
    try {
      const allProjects = [...activeProjects, ...draftProjects];
      const targetProject = allProjects.find(p => p.id === projectId);

      // 1. Validate sufficient stock
      for (const item of recipe) {
        const invItem = materials.find(m => m.id === item.matId);
        const totalNeeded = item.reqPerUnit * batchSize;
        if (!invItem || invItem.qty < totalNeeded) {
          return { success: false, message: `Not enough ${item.name}. Need ${totalNeeded}, have ${invItem?.qty || 0}.` };
        }
      }

      // 2. Deduct materials & Log History
      for (const item of recipe) {
        const invItem = materials.find(m => m.id === item.matId);
        const totalNeeded = item.reqPerUnit * batchSize;
        const newQty = invItem.qty - totalNeeded;
        
        // Create the usage ledger entry
        const historyEntry = {
            date: new Date().toISOString(),
            qty: -totalNeeded,
            type: 'USAGE',
            note: `Used for ${batchSize}x ${targetProject?.title || 'Unknown Project'}`
        };
        const newHistory = [historyEntry, ...(invItem.history || [])];
        
        await supabase
          .from('inventory')
          .update({ qty: newQty, history: newHistory })
          .eq('id', item.matId);
      }

      // 3. Add finished products to the project database
      if (targetProject) {
        const newStockQty = (targetProject.stockQty || 0) + batchSize;
        await supabase.from('projects').update({ stockQty: newStockQty }).eq('id', projectId);
      }

      await fetchStudioData();
      return { success: true };
      
    } catch (error) {
      console.error("Manufacturing error:", error);
      return { success: false, message: "System error during production." };
    }
  };

  return (
    <InventoryContext.Provider value={{ 
      materials, activeProjects, draftProjects, loading, 
      fetchStudioData, addInventoryItem, updateInventoryItem,
      addProject, updateProject, deleteProject, manufactureProduct
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useInventory = () => useContext(InventoryContext);