<script lang="ts">
	import { Background } from '$components/Background';
	import Head from '$lib/Components/Head/Head.svelte';
</script>

<Head />

<Background
	center="hsla(273, 61%, 82%, 0.4)"
	outside="hsla(273, 61%, 82%, 0)"
/>

<div>
	<slot />
</div>
