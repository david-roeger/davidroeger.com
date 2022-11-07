import type { Dream } from '$lib/types';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { PostgrestError, User } from '@supabase/supabase-js';

export const getSupabaseProfile = async (
	user: User,
	supabaseClient: TypedSupabaseClient
): Promise<
	| {
			username: string;
			createdAt: string;
			updatedAt: string;
	  }
	| undefined
> => {
	try {
		if (!user || !user.id) throw new Error('Please sign first in');

		const { data, error, status } = await supabaseClient
			.from('profiles')
			.select(`username, created_at, updated_at`)
			.eq('id', user.id)
			.single();

		if (error && status !== 406) throw error;
		if (data) {
			return {
				username: data.username,
				createdAt: data.created_at,
				updatedAt: data.updated_at
			};
		}

		return undefined;
	} catch (error) {
		return undefined;
	}
};

export const getDreams = async (
	supabaseClient: TypedSupabaseClient
): Promise<{
	dreams?: Dream[];
	error?: PostgrestError;
	status?: number;
}> => {
	try {
		const {
			data: dreams,
			error,
			status
		} = await supabaseClient

			.from('dreams')
			.select(`id, text, emoji, created_at, updated_at`);

		if (error && status !== 406) throw error;

		return { dreams: dreams as Dream[] };
	} catch (error) {
		return { error: error as PostgrestError, status: 500 };
	}
};

export const insertDream = async (
	newDream: {
		text: string;
		created_by: string;
		emoji: string;
	},
	supabaseClient: TypedSupabaseClient
): Promise<{
	dream?: Dream;
	error?: PostgrestError;
	status?: number;
}> => {
	try {
		const {
			data: dream,
			status,
			error
		} = await supabaseClient
			.from('dreams')
			.insert([newDream])
			.select()
			.single();
		if (error && status !== 406) throw error;

		return { dream: dream as Dream };
	} catch (error) {
		return { error: error as PostgrestError, status: 500 };
	}
};

export const updateDream = async (
	{
		text,
		emoji,
		id
	}: {
		text?: string;
		emoji?: string;
		id: number;
	},
	supabaseClient: TypedSupabaseClient
): Promise<{
	dream?: Dream;
	error?: PostgrestError;
	status?: number;
}> => {
	try {
		const updateOptions: { text?: string; emoji?: string } = {};
		if (text) updateOptions.text = text;
		if (emoji) updateOptions.emoji = emoji;

		const {
			data: dream,
			error,
			status
		} = await supabaseClient
			.from('dreams')
			.update(updateOptions)
			.eq('id', id)
			.select()
			.single();

		if (error && status !== 406) throw error;

		return { dream: dream as Dream };
	} catch (error) {
		return { error: error as PostgrestError, status: 500 };
	}
};

export const deleteDream = async (
	{
		id
	}: {
		id: number;
	},
	supabaseClient: TypedSupabaseClient
): Promise<{
	dream?: Dream;
	error?: PostgrestError;
	status?: number;
}> => {
	try {
		const {
			data: dream,
			error,
			status
		} = await supabaseClient
			.from('dreams')
			.delete()
			.eq('id', id)
			.select()
			.single();

		if (error && status !== 406) throw error;

		return { dream: dream as Dream };
	} catch (error) {
		return { error: error as PostgrestError, status: 500 };
	}
};
