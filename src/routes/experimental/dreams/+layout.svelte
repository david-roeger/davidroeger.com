<script lang="ts">
	import Head from '$lib/Components/Head/Head.svelte';

	console.info('experimental/dreams:  +layout.svelte');
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
			// blue-3
			content: '#EDF6FF',
			media: '(prefers-color-scheme: light)'
		},
		{
			name: 'theme-color',
			content: '#10243E',
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
