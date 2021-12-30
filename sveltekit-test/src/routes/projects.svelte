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
	import * as Gallery from '$primitives/Gallery';
	import type { ProjectMetaData, ProjectWithGallery } from '$lib/types';
	import { TransparentSection } from '$lib/Components/TransparentSection';
	import Headline from '$lib/Components/Headline/Headline.svelte';

	import East from '$assets/icons/24/east.svg';
	import West from '$assets/icons/24/west.svg';
	import East16 from '$assets/icons/16/east.svg';

	import AccessibleIcon from '$lib/Components/AccessibleIcon';

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
		<TransparentSection>
			<Headline>Projekte</Headline>
			<Tags.List class="flex flex-wrap gap-2 m-2">
				{#each [...availableTags] as tag (tag)}
					<Tags.Tag
						value={tag}
						class={`touch-manipulation px-4 py-1 border text-xs rounded-full p-2 block focus:outline-none ring-mauve-12 focus:ring-1 ${
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
						<Headline type="secondary" class="border-b-0">{project.title}</Headline>
						<Gallery.Root class="relative">
							<Gallery.Previous
								class="bg-white absolute top-0 right-0 transform -translate-y-1/2 -translate-x-[calc(100%+16px)] block p-1 text-xs  border rounded-full md:p-2 touch-manipulation focus:outline-none ring-mauve-12 focus:ring-1"
								><AccessibleIcon label="Go to previous"><West /></AccessibleIcon></Gallery.Previous
							>
							<Gallery.Next
								class="absolute top-0 right-0 block p-1 text-xs transform -translate-x-2 -translate-y-1/2 bg-white border rounded-full md:p-2 touch-manipulation focus:outline-none ring-mauve-12 focus:ring-1"
								><AccessibleIcon label="Go to next"><East /></AccessibleIcon></Gallery.Next
							>

							<Gallery.Content
								class="flex border border-r-0 h-96 md:h-[32rem] focus:outline-none ring-mauve-12 focus:ring-1 scroll-mt-[59px]"
							>
								<img
									alt="img"
									class="block h-full border-r max-w-none"
									src="./assets/projects/obskurra/boys.png"
								/>
								<div
									class="flex flex-col justify-between flex-shrink-0 w-4/6 p-2 pt-4 border-r md:w-1/2 lg:w-1/3"
								>
									<p>{project.description}</p>
								</div>
								<img
									alt="img"
									class="block h-full border-r max-w-none"
									src="./assets/projects/obskurra/void.png"
								/>
								<img
									alt="img"
									class="block h-full border-r max-w-none"
									src="./assets/projects/obskurra/typeset.png"
								/>
								<img
									alt="img"
									class="block h-full max-w-none"
									src="./assets/projects/obskurra/lady.png"
								/>
							</Gallery.Content>
						</Gallery.Root>
						<div class="md:flex md:flex-wrap md:justify-between">
							<div class="flex flex-wrap border-b md:border-b-0">
								{#each project.tags as tag (tag)}
									<Tags.Tag
										value={tag}
										class={`touch-manipulation px-4 py-1 border text-xs rounded-full block m-2 focus:outline-none ring-mauve-12 focus:ring-1 ${
											$tags.has(tag) ? 'bg-grass-6' : ''
										}`}>{tag}</Tags.Tag
									>
								{/each}
							</div>
							<a
								sveltekit:prefetch
								class="inline-flex items-center gap-2 px-4 py-1 m-2 text-xs border md:justify-between hover:gap-4 hover:pr-2 focus:outline-none ring-mauve-12 focus:ring-1"
								href={`projects/${project.slug}`}
							>
								Read More <East16 />
							</a>
						</div>
					</section>
				{/each}
			</div>
		</div>
	</Tags.Root>
</section>
