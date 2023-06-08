import adapter from '@sveltejs/adapter-node';
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
		inlineStyleThreshold: 1024 * 4,
		adapter: adapter(),
		csp: {
			mode: 'auto',
			directives: {
				// 'default-src': [
				// 	'self',
				// 	'unsafe-inline',
				// 	'*.davidroeger.com',
				// 	// inter font files
				// 	'rsms.me',
				// 	// supabase
				// 	'*.supabase.co',
				// 	// netlify asset output cache
				// 	'*.cloudfront.net'
				// ],
				// // needs unsafe-inline for svelte transitions
				// // https://github.com/sveltejs/kit/issues/5215
				// 'style-src': [
				// 	'self',
				// 	'unsafe-inline',
				// 	'*.davidroeger.com',
				// 	// inter css
				// 	'rsms.me'
				// ],
				// 'img-src': ['*', 'data:']
			}
		},
		alias: {
			$lib: 'src/lib',
			'$routes/*': 'src/routes/*',
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
