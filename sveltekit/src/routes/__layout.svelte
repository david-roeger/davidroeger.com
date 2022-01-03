<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	import Navigation from '$lib/components/Navigation/Navigation.svelte';
</script>

<Navigation />
<slot />
