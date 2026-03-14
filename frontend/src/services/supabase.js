import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://gdfvfhvgseufsgndnasq.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkZnZmaHZnc2V1ZnNnbmRuYXNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMjM2MzYsImV4cCI6MjA4ODY5OTYzNn0.c2Iuj82OQygK5nAJjEun_Z_nsMaimAifypT_pjAxsWE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
