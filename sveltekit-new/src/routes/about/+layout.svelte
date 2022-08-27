<script lang="ts">
	import { Background } from '$components/Background';
	import Head from '$components/Head/Head.svelte';
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

<!--Background center="hsla(273, 61%, 82%, 0.4)" outside="hsla(273, 61%, 82%, 0)" /-->

<div>
	<slot />
</div>
