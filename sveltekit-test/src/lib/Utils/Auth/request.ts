import type { Dream } from '$lib/types';
import type { User } from '@supabase/supabase-js';
import { browser } from '$app/env';
import { supabaseServerClient } from '@supabase/auth-helpers-sveltekit';

export const getSupabaseProfile = async (
	user: User,
	session: App.Session,
): Promise<{
	username: string;
	createdAt: string;
	updatedAt: string;
}> => {
	try {
		if (!user || !user.id) throw new Error('Please sign first in');

		const { data, error, status } = await supabaseServerClient(
			session.accessToken,
		)
			.from('profiles')
			.select(`username, created_at, updated_at`)
			.eq('id', user.id)
			.single();

		if (error && status !== 406) throw error;
		if (data) {
			return {
				username: data.username,
				createdAt: data.created_at,
				updatedAt: data.updated_at,
			};
		}

		return null;
	} catch (error) {
		console.error(error.error_description || error.message);
		return undefined;
	}
};

export const getDreams = async ({
	session,
}: {
	session: App.Session;
}): Promise<{
	dreams?: Dream[];
	error?: Error;
	status?: number;
}> => {
	try {
		const {
			data: dreams,
			error,
			status,
		} = await supabaseServerClient(session.accessToken)
			.from('dreams')
			.select(`id, text, emoji, created_at, updated_at`);

		if (error && status !== 406) throw error;

		return { dreams: dreams as Dream[] };
	} catch (error) {
		return { error, status: 500 };
	}
};
