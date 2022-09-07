<script lang="ts">
	import { Background } from '$components/Background';
	import Head from '$components/Head/Head.svelte';
</script>

<Head
	additionalMetaTags={[
		{
			name: 'theme-color',
			content: '#F9F1FE',
		},
	]}
/>

<Background
	center="hsla(273, 61%, 82%, 0.4)"
	outside="hsla(273, 61%, 82%, 0)"
/>

<div>
	<slot />
</div>
