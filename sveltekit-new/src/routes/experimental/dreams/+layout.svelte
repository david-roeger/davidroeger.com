<script lang="ts">
	console.info('experimental/dreams: +layout.svelte');

	import { profile, user } from '$lib/Utils/Auth/store';
	import { onMount } from 'svelte';

	onMount(() => {
		console.info('experimental/dreams: +layout.svelte // mount');
		console.log($user);
		console.log($profile);
		console.log('-----');
	});
</script>

<slot />
