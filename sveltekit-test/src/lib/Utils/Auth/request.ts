import { supabase } from './supabaseClient';

export const getSupabaseProfile = async (
	user: { id: string } = { id: undefined },
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
