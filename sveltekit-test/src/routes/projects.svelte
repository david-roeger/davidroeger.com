<script context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ fetch }) {
		// Use a `limit` querystring parameter to fetch a limited number of posts
		// e.g. fetch('posts.json?limit=5') for 5 most recent posts
		const projects = await fetch('/projects.json').then((res) => res.json());
		return {
			props: {
				projects
			}
		};
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { replaceStateWithQuery } from '$utils';

	import { writable } from 'svelte/store';

	import * as Tags from '$primitives/Tags';
	import type { ProjectMetaData } from '$lib/types';
	import { TransparentSection } from '$lib/Components/TransparentSection';
	import Headline from '$lib/Components/Headline/Headline.svelte';

	export let projects: ProjectMetaData[] = [];
	export let filteredProjects: ProjectMetaData[] = [];

	let tags = writable<Set<string>>(new Set());
	let availableTags: Set<string> = new Set();

	projects.forEach((project) => {
		project.tags.forEach((tag) => {
			availableTags.add(tag);
		});
	});

	let mounted = false;
	let defaultTags: string[] = [];

	const encoded = $page.query.get('tags');
	const decoded = decodeURIComponent(encoded);
	let filter = false;
	if (decoded && decoded !== 'null') {
		const candidates = decoded.split(',');
		const final: Set<string> = new Set();

		candidates.forEach((candidate) => {
			if (!availableTags.has(candidate)) {
				filter = true;
				return;
			}
			final.add(candidate);
		});

		$tags = new Set([...final]);
		defaultTags = [...final];
	}

	onMount(() => {
		mounted = true;
		if (filter) {
			replaceStateWithQuery({
				tags: [...$tags].join(',')
			});
		}
		updateProjects();
	});

	const updateQueries = (queries: string[]) => {
		$tags = new Set([...queries]);
	};

	$: if (mounted) {
		replaceStateWithQuery({
			tags: [...$tags].join(',')
		});
		updateProjects();
	}

	const updateProjects = () => {
		if ($tags.size) {
			filteredProjects = projects.filter((project) => {
				return project.tags.some((tag) => $tags.has(tag));
			});
			return;
		}
		filteredProjects = projects;
	};
	updateProjects();
</script>

<section class="xl:container xl:border-r">
	<Tags.Root defaultValue={defaultTags} on:valueChange={(e) => updateQueries(e.detail.value)}>
		<TransparentSection class="sticky top-[59px] z-10">
			<Headline>Projekte</Headline>
			<Tags.List class="flex flex-wrap">
				{#each [...availableTags] as tag (tag)}
					<Tags.Tag
						value={tag}
						class={`px-4 py-1 border text-xs rounded-full p-2 block m-2 focus:outline-none ring-mauve-12 focus:ring-1 ${
							$tags.has(tag) ? 'bg-grass-6' : 'bg-white'
						}`}>{tag}</Tags.Tag
					>
				{/each}
			</Tags.List>
		</TransparentSection>
		<div>
			<div>
				{#each filteredProjects as project (project.title)}
					<section class="border-b">
						<Headline type="secondary">{project.title}</Headline>

						<p class="border-b">{project.description}</p>

						<div class="flex flex-wrap">
							{#each project.tags as tag (tag)}
								<Tags.Tag
									value={tag}
									class={`px-4 py-1 border text-xs rounded-full p-2 block m-2 focus:outline-none ring-mauve-12 focus:ring-1 ${
										$tags.has(tag) ? 'bg-grass-6' : ''
									}`}>{tag}</Tags.Tag
								>
							{/each}
						</div>
					</section>
				{/each}
			</div>
		</div>
	</Tags.Root>
</section>
