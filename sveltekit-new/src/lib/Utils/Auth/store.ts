import { readable } from 'svelte/store';

import { getSupabaseProfile } from './request';
import { supabase } from './supabaseClient';

export const user = readable(supabase.auth.user(), (set) => {
	supabase.auth.onAuthStateChange(async (event, session) => {
		console.log('auth state changed', event, session);
		if (event === 'SIGNED_IN') {
			if(session?.user) {
				set(session.user);
			}
		} else {
			set(null);
		}
	});
});

export const profile = readable<null | {
    username: string;
    createdAt: string;
    updatedAt: string;
}>(null, (set) => {
	user.subscribe(async (newUser) => {
		if (newUser) {
			const newProfile = await getSupabaseProfile({ user: newUser });
			set(newProfile);
		} else {
			set(null);
		}
	});
});
