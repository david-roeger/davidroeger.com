import { building } from '$app/environment';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { env } from '$env/dynamic/public';

// Create a single supabase client for interacting with your database

let supabase: SupabaseClient;

if (!building) {
	supabase = createClient(
		env.PUBLIC_SUPABASE_URL,
		env.PUBLIC_SUBAPASE_ANON_KEY,
		{
			realtime: {
				params: {
					eventsPerSecond: 1
				}
			}
		}
	);
}

// @ts-expect-error - https://kit.svelte.dev/docs/building-your-app#during-the-build
export default supabase;
