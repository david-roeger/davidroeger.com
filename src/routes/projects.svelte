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
	import type { ProjectMetaData } from '$lib/types';
	import Headline from '$lib/Components/Headline/Headline.svelte';

	import East from '$assets/icons/24/east.svg';
	import West from '$assets/icons/24/west.svg';
	import East16 from '$assets/icons/16/east.svg';
	import Close16 from '$assets/icons/16/close.svg';

	import AccessibleIcon from '$lib/Components/AccessibleIcon';
	import TransparentSection from '$lib/Components/TransparentSection/TransparentSection.svelte';

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

	const encoded = $page.url.searchParams.get('tags');
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

<section class="pb-16 xl:container xl:border-r border-mauve-6">
	<Tags.Root defaultValue={defaultTags} on:valueChange={(e) => updateQueries(e.detail.value)}>
		<Tags.List class="flex flex-wrap gap-2 p-2 pt-8">
			{#each [...availableTags] as tag (tag)}
				<Tags.Tag
					value={tag}
					class={`flex gap-2 touch-manipulation px-4 py-1 border border-mauve-12 text-xs rounded-full p-2 focus:outline-none ring-mauve-12 focus:ring-1 ${
						$tags.has(tag) ? 'bg-purple-5 pr-2' : 'bg-white'
					}`}
					>{tag}
					{#if $tags.has(tag)}<AccessibleIcon label="Unselect Tag"><Close16 /></AccessibleIcon
						>{/if}</Tags.Tag
				>
			{/each}
		</Tags.List>
		<Headline class="flex items-end pb-8">My Projects</Headline>
		{#each filteredProjects as project (project.title)}
			<!-- divider -->
			<!--div class="border-b border-mauve-6">
				<div class="w-16 h-16 m-auto border rounded-full border-mauve-6 md:w-20 md:h-20" />
			</div-->
			<!-- -->
			<section class={`border-b border-mauve-6`}>
				<Headline type="secondary" class="border-b-0"
					><a
						sveltekit:prefetch
						class="focus:outline-none ring-mauve-12 focus:ring-1 hover:underline wave decoration-from-font"
						href={`projects/${project.slug}`}>{project.title}</a
					></Headline
				>
				<Gallery.Root class="relative" step={0.6}>
					<Gallery.Previous
						class="bg-white absolute top-0 lg:top-1/2 right-0 lg:left-2 lg:right-auto z-10 transform -translate-y-1/2 -translate-x-[calc(100%+16px)] lg:translate-x-0 block p-1 text-xs  border rounded-full md:p-2 touch-manipulation focus:outline-none ring-mauve-12 focus:ring-1"
						><AccessibleIcon label="Go to previous"><West /></AccessibleIcon></Gallery.Previous
					>
					<Gallery.Next
						class="absolute top-0 right-0 z-10 block p-1 text-xs transform -translate-x-2 -translate-y-1/2 bg-white border rounded-full lg:translate-x-0 lg:top-1/2 lg:right-2 md:p-2 touch-manipulation focus:outline-none ring-mauve-12 focus:ring-1"
						><AccessibleIcon label="Go to next"><East /></AccessibleIcon></Gallery.Next
					>
					<Gallery.Content
						class="flex border-b border-t border-mauve-6 border-r-0 h-96 md:h-[32rem] focus:outline-none ring-mauve-6 focus:ring-1 scroll-mt-[59px] no-scrollbar"
					>
						{#if project.thumbnail}
							<img
								alt="img"
								class="block h-full border-r max-w-none last:border-r-0 border-mauve-6"
								src={`./assets/projects/${project.thumbnail}`}
							/>
						{/if}
						<div
							class="flex-shrink-0 w-4/6 p-4 border-r last:border-r-0 border-mauve-6 md:w-1/2 lg:w-1/3"
						>
							<p>{project.description}</p>
						</div>
						{#each project.media as media (media)}
							{#if media}
								{#if media.includes('mp4')}
									<video
										muted
										autoplay
										loop
										playsInline
										controls={false}
										alt="video"
										class="block h-full border-r border-mauve-6 max-w-none"
										src={`./assets/projects/${media}`}
									/>
								{:else}
									<img
										alt="img"
										class="block h-full border-r last:border-r-0 border-mauve-6 max-w-none"
										src={`./assets/projects/${media}`}
									/>
								{/if}
							{/if}
						{/each}
					</Gallery.Content>
				</Gallery.Root>
				<div class="md:flex md:flex-wrap md:justify-between">
					<Tags.List
						class="flex flex-wrap items-center p-2 space-x-2 border-b border-mauve-6 md:border-b-0"
					>
						{#each project.tags as tag (tag)}
							<Tags.Tag
								value={tag}
								class={`touch-manipulation px-4 py-1 border border-mauve-12 text-xs rounded-full block focus:outline-none ring-mauve-12 focus:ring-1 ${
									$tags.has(tag) ? 'bg-purple-5' : 'bg-white'
								}`}>{tag}</Tags.Tag
							>
						{/each}
					</Tags.List>
					<a
						sveltekit:prefetch
						class="inline-flex bg-white items-center gap-2 px-4 p-1 m-2 text-xs transition-[gap,padding] border border-mauve-12 md:justify-between hover:gap-4 hover:pr-2 focus:outline-none ring-mauve-12 focus:ring-1"
						href={`projects/${project.slug}`}
					>
						Read More <East16 />
					</a>
				</div>
			</section>
		{/each}
	</Tags.Root>
</section>
