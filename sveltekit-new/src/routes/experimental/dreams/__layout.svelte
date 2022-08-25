<script context="module" lang="ts">
	console.info('experimental/dreams Layout: script module call');
</script>

<script lang="ts">
	import { profile, user } from '$lib/Utils/Auth/store';
	import { onMount } from 'svelte';
	console.info('experimental/dreams Layout: script call');

	onMount(() => {
		console.log('experimental/dreams Layout: mount');
		console.log($user);
		console.log($profile);
		console.log('-----');
	});
</script>

<slot />
