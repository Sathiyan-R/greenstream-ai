
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kzxusjxvgrtchjrzwrzd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6eHVzanh2Z3J0Y2hqcnp3cnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NzQwOTcsImV4cCI6MjA4NjQ1MDA5N30.8erhXhrQ0DPpjmVBJV72F1dd9tDrdNXzCyLnzevXqMU";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});