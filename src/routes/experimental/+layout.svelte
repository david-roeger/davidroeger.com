<script lang="ts">
	logger.page('experimental: +layout.svelte');
	// ----------------------------------------------------------------

	import { Background } from '$components/Background';
	import { Head } from '$components/Head';

	import { logger } from '$utils/logger';
</script>

<Head
	additionalMetaTags={[
		{
			name: 'theme-color',
			// blue-3
			content: '#EDF6FF',
			media: '(prefers-color-scheme: light)'
		},
		{
			name: 'theme-color',
			content: '#10243E',
			media: '(prefers-color-scheme: dark)'
		}
	]}
/>

<Background
	center="hsl(var(--drds-blue-5) / 0.4)"
	outside="hsl(var(--drds-blue-5) / 0)"
/>

<slot />
