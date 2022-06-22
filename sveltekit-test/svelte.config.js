import adapter from '@sveltejs/adapter-auto';
import { imagetools } from 'vite-imagetools';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import path from 'path';
import preprocess from 'svelte-preprocess';
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
			define: {
				'process.env.VITE_BUILD_TIME': JSON.stringify(
					`${new Date().toJSON().split('T')[0]} // ${
						new Date()
							.toJSON()
							.split('T')[1]
							.split('Z')[0]
							.split('.')[0]
					} (UTC)`,
				),
			},
			resolve: {
				alias: {
					// these are the aliases and paths to them
					$actions: path.resolve('./src/lib/Actions'),
					$primitives: path.resolve('./src/lib/Primitives'),
					$components: path.resolve('./src/lib/Components'),
					$slices: path.resolve('./src/lib/Slices'),
					$provider: path.resolve('./src/lib/Provider'),
					$assets: path.resolve('./src/lib/Assets'),
				},
			},

			plugins: [
				svg({
					// preserve viewbox
					svgoOptions: {
						plugins: [
							{
								name: 'preset-default',
								params: { overrides: { removeViewBox: false } },
							},
						],
					},
				}),
				imagetools({ force: true }),
			],
		},
	},
};

export default config;
