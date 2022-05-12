import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import adapter from '@sveltejs/adapter-netlify';

import preprocess from 'svelte-preprocess';

import path from 'path';
import svg from '@poppanator/sveltekit-svg';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],

	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess(), mdsvex(mdsvexConfig)],

	kit: {
		adapter: adapter(),

		vite: {
			resolve: {
				alias: {
					// these are the aliases and paths to them
					$actions: path.resolve('./src/lib/Actions'),
					$primitives: path.resolve('./src/lib/Primitives'),
					$components: path.resolve('./src/lib/Components'),
					$slices: path.resolve('./src/lib/Slices'),
					$utils: path.resolve('./src/lib/Utils'),
					$assets: path.resolve('./src/lib/Assets')
				}
			},
			plugins: [svg()]
		}
	}
};

export default config;
