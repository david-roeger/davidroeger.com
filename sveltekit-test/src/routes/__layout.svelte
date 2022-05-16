<script lang="ts">
	import '../app.css';
	import { BreakpointProvider } from '$lib/Provider/Breakpoint';
	import { Header } from '$lib/Slices/Header';
	import { BttButton } from '$lib/Components/BttButton';
	import AccessibleIcon from '$lib/Components/AccessibleIcon';
	import North from '$assets/Icons/24/north.svg';

	import { page } from '$app/stores';
	import Head from '$lib/Components/Head/Head.svelte';
	import DefaultHead from '$lib/Components/Head/DefaultHead.svelte';
	import { derived } from 'svelte/store';

	const getTitle = (path: string) => {
		const pathArray = path.split('/').filter((item) => item !== '');

		let finalPath = '';
		pathArray.forEach((item) => {
			finalPath =
				finalPath +
				` | ${item.charAt(0).toUpperCase()}${item.slice(1)}`;
		});
		return finalPath;
	};

	$: console.log();
</script>

<DefaultHead titleTemplate="DR %s" title={getTitle($page.url.pathname)} />

<div class="font-sans text-mauve-12">
	<Header class="z-30" />
	<main class="z-10 xl:max-w-7xl xl:border-r border-mauve-6">
		<BreakpointProvider>
			<slot />
		</BreakpointProvider>
	</main>

	<BttButton>
		<AccessibleIcon label="Back to top"><North /></AccessibleIcon>
	</BttButton>
	<!--footer class="z-20 " /-->
</div>
