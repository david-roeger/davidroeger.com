<script lang="ts">
	import { Header } from '$lib/Slices/Header';
	import '../app.css';

	import { page } from '$app/stores';
	$: console.log($page.path);
</script>

<div class="text-mauve-12 border-mauve-12">
	<Header />

	<main>
		<slot />
	</main>

	<footer />
</div>
