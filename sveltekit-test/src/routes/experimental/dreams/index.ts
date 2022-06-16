import type { Dream } from '$lib/types';
import type { RequestHandler } from '@sveltejs/kit';
import { getDreams } from '$lib/Utils/Auth/request';

type Params = Record<string, string>;
type OutputType = { dreams?: Dream[]; error?: Error };

export const get: RequestHandler<Params, OutputType> = async () => {
	const { dreams, error, status } = await getDreams();
	if (error) {
		return {
			status,
			body: { error: new Error(error.message) },
		};
	}

	return {
		status: 200,
		body: { dreams },
	};
};
