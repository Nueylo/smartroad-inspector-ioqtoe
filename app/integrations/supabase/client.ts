
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://rpbgdlnyltbkzvojelld.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwYmdkbG55bHRia3p2b2plbGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzOTYyMTgsImV4cCI6MjA2Njk3MjIxOH0.yGUpYC_uCJl9HQr9_TUqKFZ_jzTbxKkiHrRa6tsaHLg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
