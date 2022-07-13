import { imagetools } from 'vite-imagetools';

import path from 'path';
import svg from '@poppanator/sveltekit-svg';
import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	define: {
		'process.env.VITE_BUILD_TIME': JSON.stringify(
			`${new Date().toJSON().split('T')[0]} // ${
				new Date().toJSON().split('T')[1].split('Z')[0].split('.')[0]
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
		sveltekit(),
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
};

export default config;
