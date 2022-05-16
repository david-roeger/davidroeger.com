<script lang="ts">
	import { Background } from '$components/Background';
	import Head from '$lib/Components/Head/Head.svelte';
</script>

<Head
	additionalMetaTags={[
		{
			name: 'theme-color',
			content: '#FFB380',
		},
	]}
/>

<Background
	center="hsla(24, 100%, 75.3%, 0.4)"
	outside="hsla(24, 100%, 75.3%, 0)"
/>

<div class="relative">
	<slot />
</div>
