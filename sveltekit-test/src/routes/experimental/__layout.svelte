<script lang="ts">
	import { Background } from '$components/Background';
	import Head from '$lib/Components/Head/Head.svelte';
</script>

<Head />

<Background
	center="hsla(206, 100%, 50.0%, 0.4)"
	outside="hsla(206, 100%, 50.0%, 0)"
/>

<div class="relative">
	<slot />
</div>
