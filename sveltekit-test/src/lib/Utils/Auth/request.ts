import type { Dream } from '$lib/types';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

export const getSupabaseProfile = async (
	user: User,
): Promise<{
	username: string;
	createdAt: string;
	updatedAt: string;
}> => {
	try {
		if (!user || !user.id) throw new Error('Please sign first in');

		const { data, error, status } = await supabase
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
		alert(error.error_description || error.message);
	}
};

export const getDreams = async (): Promise<{
	dreams?: Dream[];
	error?: Error;
	status?: number;
}> => {
	try {
		const {
			data: dreams,
			error,
			status,
		} = await supabase
			.from('dreams')
			.select(`id, text, emoji, created_at, updated_at`);

		if (error && status !== 406) throw error;

		return { dreams: dreams as Dream[] };
	} catch (error) {
		return { error, status: 500 };
	}
};
