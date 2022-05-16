<script lang="ts">
	import { Background } from '$components/Background';
	import Head from '$lib/Components/Head/Head.svelte';
</script>

<Background
	center="hsla(146, 38%, 69%, 0.4)"
	outside="hsla(146, 38%, 69%, 0)"
/>

<div class="relative">
	<slot />
</div>
