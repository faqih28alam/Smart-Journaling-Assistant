// supabaseClient.js
// src/lib/supabaseClient.js

import { createClient } from '@supabase/supabase-js'

console.log("URL:", import.meta.env.VITE_SUPABASE_URL);

// Define the Database types (Optional: you can generate these via Supabase CLI later)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase Environment Variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)