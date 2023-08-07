<script lang="ts">
	logger.page('contact: +layout.svelte');
	// ----------------------------------------------------------------

	import { Background } from '$components/Background';
	import Head from '$components/Head/Head.svelte';

	import { logger } from '$utils';
</script>

<Head
	additionalMetaTags={[
		{
			name: 'theme-color',
			// orange-3
			content: '#FFF1E7',
			media: '(prefers-color-scheme: light)'
		},
		{
			name: 'theme-color',
			content: '#391A03',
			media: '(prefers-color-scheme: dark)'
		}
	]}
/>

<Background
	center="hsla(24, 100%, 75.3%, 0.4)"
	outside="hsla(24, 100%, 75.3%, 0)"
/>

<slot />
