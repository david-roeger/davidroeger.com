import type { User } from '@supabase/supabase-js';
import { readable } from 'svelte/store';

import { getSupabaseProfile } from './request';
import { supabase } from './supabaseClient';

const getUser = async () => {
	const { data } = await supabase.auth.getSession();
	return data.session?.user;
};

export const user = readable<User | undefined>(await getUser(), (set) => {
	supabase.auth.onAuthStateChange(async (event, session) => {
		console.log('auth state changed', event, session);
		if (event === 'SIGNED_IN') {
			if (session?.user) {
				set(session.user);
			}
		} else {
			set(undefined);
		}
	});
});

export const profile = readable<
	| undefined
	| {
			username: string;
			createdAt: string;
			updatedAt: string;
	  }
>(undefined, (set) => {
	user.subscribe(async (newUser) => {
		if (newUser) {
			const newProfile = await getSupabaseProfile({ user: newUser });
			set(newProfile);
		} else {
			set(undefined);
		}
	});
});
