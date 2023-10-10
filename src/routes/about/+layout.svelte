<script lang="ts">
	logger.page('about: +layout.svelte');
	// ----------------------------------------------------------------

	import { Background } from '$components/Background';
	import { Head } from '$components/Head';

	import { logger } from '$utils/logger';
</script>

<Head
	additionalMetaTags={[
		{
			name: 'theme-color',
			// purple-3
			content: '#F9F1FE',
			media: '(prefers-color-scheme: light)'
		},
		{
			name: 'theme-color',
			content: '#301A3A',
			media: '(prefers-color-scheme: dark)'
		}
	]}
/>

<Background
	center="hsl(var(--drds-purple-6) / 0.4)"
	outside="hsl(var(--drds-purple-6) / 0)"
/>

<slot />
