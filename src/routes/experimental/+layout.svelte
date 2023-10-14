<script lang="ts">
	logger.page('experimental: +layout.svelte');
	// ----------------------------------------------------------------
	import { blue, blueDark } from '@radix-ui/colors';

	import { Background } from '$components/Background';
	import { Head } from '$components/Head';

	import { logger } from '$utils/logger';
</script>

<Head
	additionalMetaTags={[
		{
			name: 'theme-color',
			content: blue.blue3,
			media: '(prefers-color-scheme: light)'
		},
		{
			name: 'theme-color',
			content: blueDark.blue3,
			media: '(prefers-color-scheme: dark)'
		}
	]}
/>

<Background
	center="hsl(var(--drds-blue-5) / 0.4)"
	outside="hsl(var(--drds-blue-5) / 0)"
/>

<slot />
