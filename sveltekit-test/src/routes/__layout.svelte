<script lang="ts">
	import { Header } from '$lib/Slices/Header';
	import '../app.css';

	import { page } from '$app/stores';

	const getTitle = (path: string) => {
		const pathArray = path.split('/').filter((item) => item !== '');
		if (pathArray.length === 0) {
			return 'David Roeger Portfolio';
		}

		let finalPath = 'DR';
		pathArray.forEach((item) => {
			finalPath = finalPath + ` | ${item.charAt(0).toUpperCase()}${item.slice(1)}`;
		});
		return finalPath;
	};
	$: title = getTitle($page.url.pathname);
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="text-mauve-12">
	<Header class="z-30" />

	<main class="z-10 xl:max-w-7xl xl:border-r border-mauve-6">
		<slot />
	</main>

	<footer class="z-20" />
</div>
