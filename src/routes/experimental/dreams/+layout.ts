import type { LayoutLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { getSupabaseProfile } from '$lib/Utils/Dreams/supabaseRequest';

export const load: LayoutLoad = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	let profile:
		| {
				username: string;
				createdAt: string;
				updatedAt: string;
		  }
		| undefined;
	if (session) {
		profile = await getSupabaseProfile(session.user, supabaseClient);
	}

	return { session, profile };
};
