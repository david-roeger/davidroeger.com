import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		vite: {
			resolve: {
				alias: {
					// these are the aliases and paths to them
					$actions: path.resolve('./src/lib/Actions'),
					$primitives: path.resolve('./src/lib/Primitives'),
					$components: path.resolve('./src/lib/Components'),
					$slices: path.resolve('./src/lib/Slices'),
					$utils: path.resolve('./src/lib/Utils')
				}
			}
		}
	}
};

export default config;
