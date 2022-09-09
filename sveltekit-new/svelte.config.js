import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess(), mdsvex(mdsvexConfig)],

	kit: {
		adapter: adapter(),
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self', '*.davidroeger.com', '*.supabase.co'],
				// needs unsafe-inline for svelte transitions
				// https://github.com/sveltejs/kit/issues/5215
				'style-src': ['self', '*.davidroeger.com', 'unsafe-inline'],
				'img-src': ['*']
			}
		},
		alias: {
			$lib: 'src/lib',
			$actions: 'src/lib/Actions',
			'$assets/*': 'src/lib/Assets/*',
			'$components/*': 'src/lib/Components/*',
			'$primitives/*': 'src/lib/Primitives/*',
			'$provider/*': 'src/lib/Provider/*',
			'$slices/*': 'src/lib/Slices/*',
			$utils: 'src/lib/Utils'
		}
	}
};

export default config;
