/* src/supabaseClient.js */
/* global process */
import { createClient } from '@supabase/supabase-js';

// The '?' (Optional Chaining) stops Node from crashing when import.meta.env is undefined.
// The typeof process check stops the browser from crashing when process is undefined.
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_URL : '');
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_ANON_KEY : '');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);