/* src/seedData.js */
/* eslint-env node */
/* global global, process */
import 'dotenv/config';

// Bridge for Vite's import.meta.env
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
  console.log("🚀 Initializing MASSIVE Bulk Data Injection...");

  // 0. CLEANUP EXISTING DATA (To prevent duplicates if you run it twice)
  await supabase.from('project_sops').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('inventory').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('vendors').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('material_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('tax_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('standard_actions').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 1. INJECT TAX CATEGORIES
  const { data: taxes } = await supabase.from('tax_categories').insert([
    { name: 'Cost of Goods Sold (COGS)', description: 'Direct materials.', irs_reference: 'Part III' },
    { name: 'Supplies & Small Tools', description: 'Consumables, sandpaper, bits.', irs_reference: 'Line 22' },
    { name: 'Shipping & Packaging', description: 'Boxes, tape, postage.', irs_reference: 'Line 27a' },
    { name: 'Advertising & Marketing', description: 'Ads, business cards.', irs_reference: 'Line 8' },
    { name: 'Equipment Depreciation', description: 'Large machinery over $500.', irs_reference: 'Line 13' }
  ]).select();

  // 2. INJECT SMART TAXONOMY
  const { data: taxons } = await supabase.from('material_categories').insert([
    { broad_category: 'Woodworking', type_name: 'Lumber', species_or_specific: 'Walnut (Domestic)', default_uom: 'Board Feet', tax_category_id: taxes[0].id },
    { broad_category: 'Woodworking', type_name: 'Lumber', species_or_specific: 'Maple (Hard)', default_uom: 'Board Feet', tax_category_id: taxes[0].id },
    { broad_category: 'Resin Art', type_name: 'Epoxy', species_or_specific: 'Deep Pour Resin', default_uom: 'Gallons', tax_category_id: taxes[0].id },
    { broad_category: 'Resin Art', type_name: 'Pigment', species_or_specific: 'Mica Powder', default_uom: 'Grams', tax_category_id: taxes[0].id },
    { broad_category: '3D Printing', type_name: 'Filament', species_or_specific: 'PLA Matte', default_uom: 'Kilograms', tax_category_id: taxes[0].id },
    { broad_category: 'Hardware', type_name: 'Fasteners', species_or_specific: '1/4-20 Threaded Inserts', default_uom: 'Count', tax_category_id: taxes[0].id },
    { broad_category: 'Packaging', type_name: 'Box', species_or_specific: '12x12x6 Corrugated', default_uom: 'Count', tax_category_id: taxes[2].id }
  ]).select();

  // 3. INJECT STANDARD SOP ACTIONS
  const { data: actions } = await supabase.from('standard_actions').insert([
    { step_type: 'Prep', action_name: 'Joint & Plane', help_text: 'Square the lumber before any cuts.' },
    { step_type: 'Prep', action_name: 'CNC Cut', help_text: 'Load g-code and monitor the first pass.' },
    { step_type: 'Mix', action_name: '2:1 Epoxy Mix', help_text: 'Mix for 5 straight minutes. Do not rush.' },
    { step_type: 'Assemble', action_name: 'Clamp & Glue', help_text: 'Check for square before it dries.' },
    { step_type: 'Finish', action_name: 'Sand up to 320', help_text: 'Don\'t skip grits.' },
    { step_type: 'Finish', action_name: 'Apply Hard Wax', help_text: 'Buff off after 15 minutes.' }
  ]).select();

  // 4. INJECT VENDORS
  const { data: vends } = await supabase.from('vendors').insert([
    { name: 'Local Hardwoods Co.', lead_time: 2 },
    { name: 'Liquid Glass Epoxy', lead_time: 5 },
    { name: 'PolyMaker Direct', lead_time: 3 },
    { name: 'Uline Packaging', lead_time: 2 }
  ]).select();

  // 5. INJECT INVENTORY (Massive Load)
  const { data: mats } = await supabase.from('inventory').insert([
    { alias: 'Premium Walnut 8/4', material_category_id: taxons[0].id, name: '8/4 Black Walnut', brand: 'Local', category: 'Raw Material', qty: 150, unit: 'Board Feet', cost_per_unit: 12.50, vendor_id: vends[0].id },
    { alias: 'River Pour Resin', material_category_id: taxons[2].id, name: 'Deep Pour 2:1', brand: 'Liquid Glass', category: 'Raw Material', qty: 15, unit: 'Gallons', cost_per_unit: 95.00, vendor_id: vends[1].id },
    { alias: 'Matte Black PLA', material_category_id: taxons[4].id, name: 'Black PLA 1.75mm', brand: 'PolyMaker', category: 'Raw Material', qty: 12, unit: 'Kilograms', cost_per_unit: 22.00, vendor_id: vends[2].id },
    { alias: 'Onyx Black Mica', material_category_id: taxons[3].id, name: 'Onyx Pigment', brand: 'EyeCandy', category: 'Raw Material', qty: 500, unit: 'Grams', cost_per_unit: 0.15, vendor_id: vends[1].id },
    { alias: 'Standard Shipping Box', material_category_id: taxons[6].id, name: '12x12x6 Box', brand: 'Uline', category: 'Packaging', qty: 250, unit: 'Count', cost_per_unit: 1.15, vendor_id: vends[3].id }
  ]).select();

  // 6. INJECT PROJECTS
  const { data: projs } = await supabase.from('projects').insert([
    { title: 'Walnut River Coffee Table', status: 'active', stock_qty: 2, sold_qty: 5, retail_price: 1250.00, tags: ['Furniture', 'High Margin'], recipe: [{ matId: mats[0].id, reqPerUnit: 12, unit: 'Board Feet', name: 'Walnut' }, { matId: mats[1].id, reqPerUnit: 3, unit: 'Gallons', name: 'Epoxy' }] },
    { title: 'Matte Black Geometric Planter', status: 'active', stock_qty: 45, sold_qty: 120, retail_price: 35.00, tags: ['3D Print', 'Home Decor'], recipe: [{ matId: mats[2].id, reqPerUnit: 0.4, unit: 'Kilograms', name: 'PLA' }] },
    { title: 'Ocean Resin Coaster Set (4)', status: 'draft', stock_qty: 0, sold_qty: 0, retail_price: 45.00, tags: ['Resin', 'Gifts'], recipe: [{ matId: mats[1].id, reqPerUnit: 0.1, unit: 'Gallons', name: 'Epoxy' }, { matId: mats[3].id, reqPerUnit: 5, unit: 'Grams', name: 'Mica' }] }
  ]).select();

  // 7. INJECT PROJECT SOPS
  await supabase.from('project_sops').insert([
    { project_id: projs[0].id, standard_action_id: actions[0].id, step_order: 1, estimated_minutes: 45 },
    { project_id: projs[0].id, standard_action_id: actions[2].id, step_order: 2, estimated_minutes: 30 },
    { project_id: projs[0].id, standard_action_id: actions[4].id, step_order: 3, estimated_minutes: 120 },
    { project_id: projs[1].id, standard_action_id: actions[1].id, step_order: 1, estimated_minutes: 5 },
    { project_id: projs[1].id, standard_action_id: actions[5].id, step_order: 2, estimated_minutes: 15 }
  ]);

  // 8. INJECT MASSIVE TRANSACTIONS LIST (For beautiful charts)
  // We use dates spread across the last month to make the Revenue Chart pop.
  const today = new Date();
  const daysAgo = (days) => new Date(today.getTime() - (days * 24 * 60 * 60 * 1000)).toISOString();

  await supabase.from('transactions').insert([
    { description: 'Sale [Etsy] - Geometric Planter (x2)', amount: 70.00, type: 'SALE', sales_channel: 'Etsy', created_at: daysAgo(1) },
    { description: 'Sale [Shopify] - Walnut River Table', amount: 1250.00, type: 'SALE', sales_channel: 'Shopify', created_at: daysAgo(3) },
    { description: 'Sale [Craft Fair] - Geometric Planter (x5)', amount: 175.00, type: 'SALE', sales_channel: 'In-Person', created_at: daysAgo(5) },
    { description: 'Sale [Shopify] - Geometric Planter', amount: 35.00, type: 'SALE', sales_channel: 'Shopify', created_at: daysAgo(7) },
    { description: 'Sale [Etsy] - Walnut River Table', amount: 1250.00, type: 'SALE', sales_channel: 'Etsy', created_at: daysAgo(12) },
    { description: 'Sale [Shopify] - Geometric Planter (x3)', amount: 105.00, type: 'SALE', sales_channel: 'Shopify', created_at: daysAgo(15) },
    
    // Expenses
    { description: 'Lumber Restock (Walnut)', amount: -450.00, type: 'EXPENSE', tax_category_id: taxes[0].id, created_at: daysAgo(2) },
    { description: 'Uline Box Order', amount: -150.00, type: 'EXPENSE', tax_category_id: taxes[2].id, created_at: daysAgo(8) },
    { description: 'Instagram Ads', amount: -75.00, type: 'EXPENSE', tax_category_id: taxes[3].id, created_at: daysAgo(10) },
    { description: 'New Festool Sander', amount: -650.00, type: 'EXPENSE', tax_category_id: taxes[4].id, created_at: daysAgo(14) },
    { description: 'Epoxy Restock (3 Gal)', amount: -285.00, type: 'EXPENSE', tax_category_id: taxes[0].id, created_at: daysAgo(20) }
  ]);

  console.log("✅ BOOM! Massive Data Injection Complete. Your charts are going to look incredible.");
};

seedStudio();