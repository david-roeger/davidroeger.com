<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	import Navigation from '$lib/components/Navigation/Navigation.svelte';
	//const { path } = page;
	console.log($page.path);
</script>

<Navigation />
<slot />
