<script context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ fetch }) {
		// Use a `limit` querystring parameter to fetch a limited number of posts
		// e.g. fetch('posts.json?limit=5') for 5 most recent posts
		const projects = await fetch('/projects.json').then((res) => res.json());
		const fun = await fetch('/fun.json').then((res) => res.json());
		console.log(fun);
		return {
			props: {
				projects,
				fun
			}
		};
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { mapToRange, replaceStateWithQuery } from '$utils';

	import { writable } from 'svelte/store';

	import * as Tags from '$primitives/Tags';
	import * as Gallery from '$primitives/Gallery';
	import type { ProjectMetaData } from '$lib/types';
	import Headline from '$lib/Components/Headline/Headline.svelte';

	import East from '$assets/Icons/24/east.svg';
	import West from '$assets/Icons/24/west.svg';
	import East16 from '$assets/Icons/16/east.svg';
	import Close16 from '$assets/Icons/16/close.svg';

	import AccessibleIcon from '$lib/Components/AccessibleIcon';

	import BezierEasing from 'bezier-easing';
	import TagIcon from '$assets/Icons/24/tag.svg';

	export let projects: ProjectMetaData[] = [];
	export let fun: { slug: string; thumbnail?: string }[] = [];

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
		if (filter) {
			replaceStateWithQuery({
				tags: [...$tags].join(',')
			});
		}
		updateProjects();
		mounted = true;
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

	const baseEasing = BezierEasing(0.4, 0, 0.2, 1);
	const reversedEasing = BezierEasing(0.8, 0, 0.6, 1);
	function spin(node, { start = -34, end = 0, duration = 150, easing = baseEasing }) {
		return {
			duration,
			css: (t: number) => {
				const eased = easing(t);
				const mapped = mapToRange(eased, 0, 1, start, end);
				return `margin-left: ${mapped}px;`;
			}
		};
	}
</script>

<Tags.Root defaultValue={defaultTags} on:valueChange={(e) => updateQueries(e.detail.value)}>
	<Tags.List class="flex flex-wrap p-1 transition-all border-b border-mauve-6">
		{#if $tags.size}
			<div in:spin out:spin={{ easing: reversedEasing }}>
				<Tags.Unset
					class="p-1 m-1 text-xs border rounded-full touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
				>
					<AccessibleIcon label="Unselect all tags"><Close16 /></AccessibleIcon></Tags.Unset
				>
			</div>
		{/if}
		{#each [...availableTags] as tag (tag)}
			<Tags.Tag
				value={tag}
				class=" transition-[margin] m-1 touch-manipulation px-4 py-1 border border-mauve-12 text-xs rounded-full focus:outline-none ring-mauve-12 focus:ring-1 {$tags.has(
					tag
				)
					? 'bg-green-5'
					: 'bg-white'}">{tag}</Tags.Tag
			>
		{/each}
	</Tags.List>
	<Headline class="py-8 md:py-16">My Projects</Headline>

	<div class={$tags.size ? 'pb-32' : ''}>
		{#each filteredProjects as project (project.title)}
			<!-- divider -->
			<!--div class="border-b border-mauve-6">
				<div class="w-16 h-16 m-auto border rounded-full border-mauve-6 md:w-20 md:h-20" />
			</div-->
			<!-- -->
			<section class="mb-8 border-t border-b first:border-t-0 border-mauve-6 md:mb-16 last:mb-0">
				<Headline
					type="secondary"
					class="bg-white border-b-0"
					id="gallery-headline-{encodeURIComponent(project.title)}"
					><a
						sveltekit:prefetch
						class="focus:outline-none growing-underline"
						href="projects/{project.slug}">{project.title}</a
					>
				</Headline>
				<Gallery.Root
					class="relative bg-white/[.85]"
					step={0.6}
					labelledby="gallery-headline-{encodeURIComponent(project.title)}"
				>
					<Gallery.Previous
						class="cursor-w-resize bg-white absolute top-0 lg:top-1/2 right-0 lg:left-2 lg:right-auto z-10 transform -translate-y-1/2 -translate-x-[calc(100%+16px)] lg:translate-x-0 block p-1 text-xs  border rounded-full md:p-2 touch-manipulation focus:outline-none ring-mauve-12 focus:ring-1"
						><AccessibleIcon label="Go to previous"><West /></AccessibleIcon></Gallery.Previous
					>
					<Gallery.Next
						class="absolute top-0 right-0 z-10 block p-1 text-xs transform -translate-x-2 -translate-y-1/2 bg-white border rounded-full cursor-e-resize lg:translate-x-0 lg:top-1/2 lg:right-2 md:p-2 touch-manipulation focus:outline-none ring-mauve-12 focus:ring-1"
						><AccessibleIcon label="Go to next"><East /></AccessibleIcon></Gallery.Next
					>
					<Gallery.Content
						class="flex border-b border-t border-mauve-6 border-r-0 h-96 md:h-[32rem] focus:outline-none ring-mauve-6 focus:ring-1 no-scrollbar"
					>
						{#if project.thumbnail}
							<img
								loading="lazy"
								alt=""
								class="relative block h-full border-r max-w-none last:border-r-0 border-mauve-6"
								src="./assets/projects/{project.thumbnail}"
							/>
						{/if}
						<div
							class="flex flex-col justify-between flex-shrink-0 w-4/6 border-r last:border-r-0 border-mauve-6 md:w-1/2 lg:w-1/3"
						>
							<p
								class="flex items-center p-1 text-xs bg-white border-b text-mauve-11 border-mauve-6"
							>
								<AccessibleIcon label="Tags"><TagIcon /></AccessibleIcon>
								{#each project.tags as tag (tag)}
									<span class="{$tags.has(tag) ? 'underline decoration-from-font' : ''} p-1"
										>{tag}
									</span>
								{/each}
							</p>
							<div class="m-4">
								<p>{project.description}</p>
								<p class="text-xs">More Meta Data?</p>
								<p class="text-xs">More Meta Data?</p>
							</div>
						</div>
						{#each project.media as media (media)}
							{#if media}
								{#if media.includes('mp4')}
									<video
										loading="lazy"
										muted
										autoplay
										loop
										playsInline
										controls={false}
										alt=""
										class="block h-full border-r border-mauve-6 max-w-none"
										src="./assets/projects/{media}"
									/>
								{:else}
									<img
										loading="lazy"
										alt=""
										class="block h-full border-r last:border-r-0 border-mauve-6 max-w-none"
										src="./assets/projects/{media}"
									/>
								{/if}
							{/if}
						{/each}
					</Gallery.Content>
				</Gallery.Root>
				<div class="bg-white md:flex md:flex-wrap md:justify-between">
					<a
						sveltekit:prefetch
						class="inline-flex items-center gap-2 px-4 p-1 m-2 text-xs transition-[gap,padding] border border-mauve-12 bg-white md:justify-between hover:gap-4 hover:pr-2 focus:gap-4 focus:pr-2 focus:outline-none ring-mauve-12 focus:ring-1"
						href="projects/{project.slug}"
						title="Read more about the project {project.slug}"
					>
						Read More <span aria-hidden="true">
							<East16 />
						</span>
					</a>
				</div>
			</section>
		{/each}
	</div>
</Tags.Root>

{#if !$tags.size && fun.length}
	<Headline class="py-8 md:py-16">Just for fun</Headline>

	<section class="mb-32">
		{#each fun as funsie}
			{@const computed = funsie.slug.replace('-', ' ')}
			<!-- content here -->
			<Headline type="secondary" class="!p-0 bg-white"
				><a
					sveltekit:prefetch
					class="group flex justify-between items-center pr-4 transition-[padding] bg-white md:justify-between hover:pr-2 focus:pr-2 focus:outline-none"
					href="fun/{funsie.slug}"
					title="Read more about the project {funsie.slug}"
				>
					<span class="flex">
						{#if funsie.thumbnail}
							<img
								loading="lazy"
								alt={`Thumbnail for fun Project ${computed}`}
								width="40"
								height="40"
								class="block w-12 h-12 bg-white max-w-none"
								src={`./assets/fun/${funsie.thumbnail}`}
							/>
						{/if}
						<span
							class={`block p-2 group-hover:underline group-focus:underline decoration-from-font ${
								funsie.thumbnail ? 'border-l border-mauve-6' : ''
							}`}>{computed[0].toUpperCase() + computed.slice(1)}</span
						>
					</span>
					<span aria-hidden="true">
						<East />
					</span>
				</a>
			</Headline>
		{/each}
	</section>
{/if}
