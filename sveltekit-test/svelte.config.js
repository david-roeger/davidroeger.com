import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

import path from 'path';

import { imagetools } from 'vite-imagetools';
import svg from '@poppanator/sveltekit-svg';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],

	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess(), mdsvex(mdsvexConfig)],

	kit: {
		adapter: adapter(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: 'body',

		vite: {
			resolve: {
				alias: {
					// these are the aliases and paths to them
					$actions: path.resolve('./src/lib/Actions'),
					$primitives: path.resolve('./src/lib/Primitives'),
					$components: path.resolve('./src/lib/Components'),
					$slices: path.resolve('./src/lib/Slices'),
					$utils: path.resolve('./src/lib/Utils'),
					$assets: path.resolve('./src/lib/Assets'),
				},
			},

			plugins: [svg(), imagetools({ force: true })],
		},
	},
};

export default config;
