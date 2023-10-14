<script lang="ts">
	logger.page('about: +layout.svelte');
	// ----------------------------------------------------------------
	import { purple, purpleDark } from '@radix-ui/colors';

	import { Background } from '$components/Background';
	import { Head } from '$components/Head';

	import { logger } from '$utils/logger';
</script>

<Head
	additionalMetaTags={[
		{
			name: 'theme-color',
			content: purple.purple3,
			media: '(prefers-color-scheme: light)'
		},
		{
			name: 'theme-color',
			content: purpleDark.purple3,
			media: '(prefers-color-scheme: dark)'
		}
	]}
/>

<Background
	center="hsl(var(--drds-purple-5) / 0.4)"
	outside="hsl(var(--drds-purple-5) / 0)"
/>

<slot />
