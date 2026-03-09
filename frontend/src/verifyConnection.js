
/* src/verifyConnection.js */
/* eslint-env node */
/* global global, process */
import 'dotenv/config';

// Create a bridge for Vite's import.meta.env
global.import = {
  meta: {
    env: {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
    }
  }
};

import { supabase } from './supabaseClient.js';

const verifySystemLink = async () => {
  console.log("🛠 Checking Supabase Connectivity...");
  
  try {
    const { data, error, status } = await supabase
      .from('vendors')
      .select('name')
      .limit(1);

    if (error) {
      if (status === 401) {
        console.error("❌ Auth Error: Check your VITE_SUPABASE_ANON_KEY in .env");
      } else if (status === 404) {
        console.error("❌ Schema Error: The 'vendors' table does not exist yet.");
      } else {
        console.error(`❌ Connection Failed: ${error.message}`);
      }
      return;
    }

    const connectionType = data.length > 0 ? "Active Data Flow" : "Empty Table (Success)";
    console.log(`✅ Connection Verified: ${connectionType}`);
    
  } catch (err) {
    console.error("❌ Critical System Failure:", err.message);
  }
};

verifySystemLink();