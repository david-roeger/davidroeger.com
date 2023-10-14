<script lang="ts">
	logger.page('contact: +layout.svelte');
	// ----------------------------------------------------------------
	import { orange, orangeDark } from '@radix-ui/colors';

	import { Background } from '$components/Background';
	import { Head } from '$components/Head';

	import { logger } from '$utils/logger';
</script>

<Head
	additionalMetaTags={[
		{
			name: 'theme-color',
			content: orange.orange3,
			media: '(prefers-color-scheme: light)'
		},
		{
			name: 'theme-color',
			content: orangeDark.orange3,
			media: '(prefers-color-scheme: dark)'
		}
	]}
/>

<Background
	center="hsl(var(--drds-orange-5) / 0.4)"
	outside="hsl(var(--drds-orange-5) / 0)"
/>

<slot />
