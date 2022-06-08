import type { Dream } from '$lib/types';
import { readable, type Readable, type Writable } from 'svelte/store';
import { getSupabaseProfile } from './request';
import { session } from '$app/stores';
import { writable } from 'svelte/store';

export const profile: Readable<{
	username: string;
	createdAt: string;
	updatedAt: string;
}> = readable(null, (set) => {
	session.subscribe(async (newSession) => {
		if (newSession.user) {
			const newProfile = await getSupabaseProfile(newSession.user);
			set(newProfile);
		} else {
			set(null);
		}
	});
});
export const dreamsStore: Writable<Dream[]> = writable(undefined);
