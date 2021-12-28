<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { replaceStateWithQuery } from '$utils';

	import { writable } from 'svelte/store';

	let tags = writable<string[]>([]);
	let mounted = false;
	onMount(() => {
		mounted = true;
		const encoded = $page.query.get('tags');
		const decoded = decodeURIComponent(encoded);
		if (decoded && decoded !== 'null') {
			const candidates = decoded.split(',');
			const final = [];

			let filter = false;
			candidates.forEach((candidate) => {
				if (!availableTags.includes(candidate)) {
					filter = true;
					return;
				}
				final.push(candidate);
			});

			$tags = [...final];
			if (filter) {
				replaceStateWithQuery({
					tags: $tags.join(',')
				});
			}
		}
	});

	const updateQuery = (query: string) => {
		if ($tags.includes(query)) {
			$tags = $tags.filter((tag) => tag != query);
		} else {
			$tags = [...$tags, query];
		}
	};

	$: if (mounted) {
		replaceStateWithQuery({
			tags: $tags.join(',')
		});
	}

	const availableTags = ['123', '456', '789'];
</script>

<main class="flex flex-col items-center p-4">
	<button on:click={() => updateQuery('123')}>Set query param 123</button>
	<button on:click={() => updateQuery('456')}>Set query param 456</button>
	<button on:click={() => updateQuery('789')}>Set query param 789</button>
	<h1>{$tags.toString()}</h1>
	<button on:click={() => console.log($page.query.get('tags'))}>print weather to console</button>
</main>
