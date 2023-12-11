import { sveltekit } from '@sveltejs/kit/vite';

import { imagetools } from 'vite-imagetools';
import svg from '@poppanator/sveltekit-svg';

import * as child from 'child_process';

// const commitHash = child.execSync('git rev-parse --short HEAD').toString();
// const commitBranch = child
// 	.execSync('git rev-parse --abbrev-ref HEAD')
// 	.toString()
// 	.trim();

/** @type {import('vite').UserConfig} */
const config = {
	define: {
		// __BUILD_TIME__: `${new Date().toString()} (UTC)`
		__BUILD_TIME__: JSON.stringify(
			`${new Date().toLocaleDateString(
				'en-GB'
			)} ${new Date().toLocaleTimeString('en-GB')}`
		)
		// __BUILD_HASH__: JSON.stringify(`#${commitHash} (${commitBranch})`)
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
