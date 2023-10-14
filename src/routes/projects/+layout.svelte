<script lang="ts">
	logger.page('projects: +layout.svelte');
	// ----------------------------------------------------------------
	import { green, greenDark } from '@radix-ui/colors';

	import { Background } from '$components/Background';
	import { Head } from '$components/Head';

	import { logger } from '$utils/logger';
</script>

<Head
	additionalMetaTags={[
		{
			name: 'theme-color',
			content: green.green3,
			media: '(prefers-color-scheme: light)'
		},
		{
			name: 'theme-color',
			content: greenDark.green3,
			media: '(prefers-color-scheme: dark)'
		}
	]}
/>

<Background
	center="hsl(var(--drds-green-5) / 0.4)"
	outside="hsl(var(--drds-green-5) / 0)"
/>

<slot />
