/* src/verifyV2.js */
/* eslint-env node */
/* global global, process */
import 'dotenv/config';

// The Architecture Bridge
global.import = {
  meta: {
    env: {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
    }
  }
};

import { supabase } from './supabaseClient.js';

async function verifySystem() {
  console.log("🔍 AUDITING V2 ARCHITECTURE...");

  const { data: taxons, error: tErr } = await supabase.from('material_categories').select('count');
  const { data: inv, error: iErr } = await supabase.from('inventory').select('count');

  if (tErr || iErr) {
    console.error("❌ AUDIT FAILED: Tables not found or inaccessible.");
    return;
  }

  console.log(`✅ TAXONOMY ONLINE: ${taxons[0].count} Categories Loaded.`);
  console.log(`✅ INVENTORY ONLINE: ${inv[0].count} Items Tracked.`);
  console.log("🚀 SYSTEM READY FOR FRIDAY LAUNCH.");
}

verifySystem();