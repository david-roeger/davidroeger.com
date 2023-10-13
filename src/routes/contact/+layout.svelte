<script lang="ts">
	logger.page('contact: +layout.svelte');
	// ----------------------------------------------------------------

	import { Background } from '$components/Background';
	import { Head } from '$components/Head';

	import { logger } from '$utils/logger';
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
	center="hsl(var(--drds-orange-5) / 0.4)"
	outside="hsl(var(--drds-orange-5) / 0)"
/>

<slot />
