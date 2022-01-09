<script lang="ts">
	import { Header } from '$lib/Slices/Header';
	import '../app.css';
</script>

<div class="text-mauve-12">
	<Header class="z-30" />

	<main class="z-10 xl:container xl:border-r border-mauve-6">
		<slot />
	</main>

	<footer class="z-20" />
</div>
