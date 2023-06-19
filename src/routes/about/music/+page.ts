console.info('about/music: +page.ts');

import type { PageLoad } from './$types';
import { MUSIC_KEYS, createStateFromParam } from './constants';

const constructParams = (type: string, range?: string) => {
	const newParams = new URLSearchParams();
	if (type) newParams.append('type', type);
	if (range) newParams.append('range', range);
	return newParams;
};

export const load: PageLoad = async ({ parent, url, fetch }) => {
	console.info('about/music: +page.ts // load');

	const { queryClient } = await parent();

	const s = url.searchParams.get('s');
	const state = createStateFromParam(s);

	const lastTrackParams = constructParams('lastTrack');
	const lastTrackQueryFunction = () =>
		fetch(`/_api/_cachable/music?${lastTrackParams.toString()}`);

	const intialTabParams = constructParams(state.tab, state.range);
	const intitalTabQueryFunction = () =>
		fetch(`/_api/_cachable/music?${intialTabParams.toString()}`);

	const lastTrackQuery = queryClient.prefetchQuery({
		queryKey: MUSIC_KEYS.type('lastTrack'),
		queryFn: async () => (await lastTrackQueryFunction()).json()
	});

	const initalTabQuery = queryClient.prefetchQuery({
		queryKey: MUSIC_KEYS.range(state.tab, state.range),
		queryFn: async () => (await intitalTabQueryFunction()).json()
	});

	await Promise.all([lastTrackQuery, initalTabQuery]);

	return {
		initalState: state
	};
};

export const prerender = false;
