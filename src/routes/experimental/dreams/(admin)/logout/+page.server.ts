console.info('experimental/dreams/(admin)/logout: +page.server.ts');

import { FORM_STATE, type FormSuccess } from '$lib/Utils/Form';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { ActionData, Actions } from './$types';

export type DreamsLogoutFormActionData = ActionData;

export const actions: Actions = {
	default: async (
		event
	): Promise<
		FormSuccess<'dreamsLogoutForm'> & {
			formId: 'dreamsLogoutForm';
			state: FORM_STATE.SUCCESS;
			notification: {
				type: 'green' | 'orange' | 'blue';
				html: string;
			};
		}
	> => {
		console.info(
			'experimental/dreams/(admin)/logout: +page.server.ts // Action // default'
		);

		const { supabaseClient } = await getSupabase(event);
		await supabaseClient.auth.signOut();
		return {
			formId: 'dreamsLogoutForm',
			state: FORM_STATE.SUCCESS,
			notification: {
				type: 'blue',
				html: `<h3>All good!</h3><p>You are now logged out.</p>`
			}
		};
	}
};
