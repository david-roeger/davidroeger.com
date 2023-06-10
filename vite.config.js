import { sveltekit } from '@sveltejs/kit/vite';

import { imagetools } from 'vite-imagetools';
import svg from '@poppanator/sveltekit-svg';

/** @type {import('vite').UserConfig} */
const config = {
	define: {
		__BUILD_TIME__: JSON.stringify(
			`${new Date().toJSON().split('T')[0]} // ${
				new Date().toJSON().split('T')[1].split('Z')[0].split('.')[0]
			} (UTC)`
		)
	},
	plugins: [
		sveltekit(),
		svg({
			// preserve viewbox
			svgoOptions: {
				plugins: [
					{
						name: 'preset-default',
						params: { overrides: { removeViewBox: false } }
					}
				]
			}
		}),
		imagetools({ force: true })
	]
};

export default config;
