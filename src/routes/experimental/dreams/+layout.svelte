<script lang="ts">
	logger.page('experimental/dreams:  +layout.svelte');
	// ----------------------------------------------------------------
	import { blue, blueDark } from '@radix-ui/colors';

	import { Head } from '$components/Head';

	import { logger } from '$utils/logger';
</script>

<Head
	additionalLinkTags={[
		// manifest
		{
			rel: 'manifest',
			href: '/dreams.webmanifest'
		}
	]}
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
		},
		{
			name: 'apple-mobile-web-app-capable',
			content: 'yes'
		},
		{
			name: 'apple-mobile-web-app-status-bar-style',
			content: 'default'
		}
	]}
/>

<slot />
