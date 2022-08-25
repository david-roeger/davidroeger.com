<script lang="ts">
	import { Background } from '$components/Background';
	import Head from '$components/Head/Head.svelte';
</script>

<Head
	additionalMetaTags={[
		{
			name: 'theme-color',
			content: '#EDF6FF'
		}
	]}
/>

<Background center="hsla(206, 100%, 50.0%, 0.4)" outside="hsla(206, 100%, 50.0%, 0)" />

<div class="relative">
	<slot />
</div>
