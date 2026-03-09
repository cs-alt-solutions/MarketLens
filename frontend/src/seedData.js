/* src/seedData.js */
/* eslint-env node */
/* global global, process */
import 'dotenv/config';

// The rest of your bridge stays the same!
global.import = {
  meta: {
    env: {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
    }
  }
};

import { supabase } from './supabaseClient.js';

const seedStudio = async () => {
  console.log("🚀 Initializing Bulk Data Injection...");

  // 1. CLEAR OLD DATA (Optional - keeps your demo clean)
  // await supabase.from('transactions').delete().neq('id', 0);
  // await supabase.from('inventory').delete().neq('id', 0);

  // 2. INJECT VENDORS
  const { data: vends } = await supabase.from('vendors').insert([
    { name: 'Pure Wax Supply', lead_time: 5 },
    { name: 'Amber Glassworks', lead_time: 12 },
    { name: 'Scent & Soul Co.', lead_time: 7 }
  ]).select();

  // 3. INJECT INVENTORY (Raw Materials & Shipping)
  const { data: mats } = await supabase.from('inventory').insert([
    { name: 'Organic Soy Wax', brand: 'Eco-Melt', category: 'Raw Material', qty: 250, unit: 'lbs', cost_per_unit: 3.15, vendor_id: vends[0].id },
    { name: 'Santal Fragrance', brand: 'Premium Oil', category: 'Raw Material', qty: 64, unit: 'oz', cost_per_unit: 2.45, vendor_id: vends[2].id },
    { name: '8oz Amber Jar', brand: 'Standard', category: 'Packaging', qty: 144, unit: 'count', cost_per_unit: 0.95, vendor_id: vends[1].id },
    { name: 'Shipping Box 6x6', brand: 'U-Line', category: 'Shipping', qty: 50, unit: 'count', cost_per_unit: 0.75 }
  ]).select();

  // 4. INJECT PROJECTS (Active & Drafts)
  await supabase.from('projects').insert([
    { 
      title: 'Obsidian Santal Candle', status: 'active', stock_qty: 24, retail_price: 32.00, 
      tags: ['Noir Series', 'Best Seller'],
      recipe: [
        { matId: mats[0].id, reqPerUnit: 0.5, unit: 'lbs', name: 'Soy Wax' },
        { matId: mats[1].id, reqPerUnit: 1, unit: 'oz', name: 'Santal Fragrance' }
      ]
    },
    { title: 'Velvet Moss Diffuser', status: 'draft', stock_qty: 0, retail_price: 0, tags: ['Fall Collection'] }
  ]);

  // 5. INJECT TRANSACTIONS (Simulate Sales History)
  await supabase.from('transactions').insert([
    { description: 'Sale [Etsy] - Obsidian Santal', amount: 32.00, type: 'SALE', sales_channel: 'Etsy' },
    { description: 'Sale [Direct] - Bulk Order x10', amount: 280.00, type: 'SALE', sales_channel: 'Direct' },
    { description: 'Equipment: New Melting Pot', amount: -150.00, type: 'EXPENSE' }
  ]);

  console.log("✅ Data Injection Complete! Your studio is now fully populated.");
};

seedStudio();