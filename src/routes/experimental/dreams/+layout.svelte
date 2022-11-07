<script lang="ts">
	console.info('experimental/dreams: +layout.svelte');

	import { supabaseClient } from '$utils/Dreams/subabaseClient';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		console.info('experimental/dreams: +layout.svelte // mount');
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidate('/experimental/dreams');
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<slot />
