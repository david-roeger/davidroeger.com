import { skHelper } from '@supabase/auth-helpers-sveltekit';

const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const { supabaseClient } = skHelper(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

export { supabaseClient };
