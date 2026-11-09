import { createClient } from '@supabase/supabase-js';

// Fallback values prevent static build failures in CI (e.g. Netlify) if environment variables are not yet injected
const defaultUrl = 'https://kpgumcptchgrfdtsiiki.supabase.co';
const defaultAnonKey = 'sb_publishable_8rAVw10sVFkaDCwOqkkAAA_HwiVrF0f';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || defaultUrl;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultAnonKey;

// Browser Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
    detectSessionInUrl: typeof window !== 'undefined',
  },
});

export const WIZARD_TREE_COMPANY_ID =
  process.env.NEXT_PUBLIC_WIZARD_TREE_COMPANY_ID ||
  process.env.NEXT_PUBLIC_WIZARD_TREE_COMPANY ||
  '13fe853f-db93-4eef-be63-be7d97407ecc';


