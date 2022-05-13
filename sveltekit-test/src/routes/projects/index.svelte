<script context="module" lang="ts">
	export const prerender = true;

	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ fetch }) {
		// Use a `limit` querystring parameter to fetch a limited number of posts
		// e.g. fetch('posts.json?limit=5') for 5 most recent posts
		const projects = await fetch('/projects.json').then((res) =>
			res.json(),
		);
		const experimental = await fetch('/experimental.json').then((res) =>
			res.json(),
		);

		return {
			props: {
				projects,
				experimental,
			},
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
	import { Media } from '$lib/Components/Media';
	import East from '$assets/Icons/24/east.svg';
	import West from '$assets/Icons/24/west.svg';
	import East16 from '$assets/Icons/16/east.svg';
	import Close16 from '$assets/Icons/16/close.svg';

	import AccessibleIcon from '$lib/Components/AccessibleIcon';

	import BezierEasing from 'bezier-easing';
	import TagIcon from '$assets/Icons/24/tag.svg';

	import type { ProjectMediaData } from '$lib/types';
	import projectsMediaData from '$assets/projectsMediaData.json';

	export let projects: ProjectMetaData[] = [];
	export let experimental: { slug: string; thumbnail?: string }[] = [];

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
				tags: [...$tags].join(','),
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
			tags: [...$tags].join(','),
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
	function slideLeft(
		node,
		{ start = -34, end = 0, duration = 150, easing = baseEasing },
	) {
		return {
			duration,
			css: (t: number) => {
				const eased = easing(t);
				const mapped = mapToRange(eased, 0, 1, start, end);
				return `margin-left: ${mapped}px;`;
			},
		};
	}

	const getProjectMediaData = (slug: string) => {
		return projectsMediaData[slug] as ProjectMediaData;
	};
</script>

<Tags.Root
	defaultValue={defaultTags}
	on:valueChange={(e) => updateQueries(e.detail.value)}
>
	<Tags.List
		class="flex flex-wrap p-1 transition-all border-b border-mauve-6"
	>
		{#if $tags.size}
			<div
				in:slideLeft|local
				out:slideLeft|local={{ easing: reversedEasing }}
			>
				<Tags.Unset
					class="p-1 m-1 text-xs border rounded-full touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
				>
					<AccessibleIcon label="Unselect all tags">
						<Close16 />
					</AccessibleIcon>
				</Tags.Unset>
			</div>
		{/if}
		{#each [...availableTags] as tag (tag)}
			<Tags.Tag
				value={tag}
				class=" transition-[margin] m-1 touch-manipulation px-4 py-1 border border-mauve-12 text-xs rounded-full focus:outline-none ring-mauve-12 focus:ring-1 {$tags.has(
					tag,
				)
					? 'bg-green-5'
					: 'bg-white'}"
			>
				{tag}
			</Tags.Tag>
		{/each}
	</Tags.List>
	<Headline containerClass="py-8 md:py-16">My Projects</Headline>

	<div class={$tags.size ? 'pb-32' : ''}>
		{#each filteredProjects as project, index (project.title)}
			{@const projectMediaData = getProjectMediaData(project.slug)}
			<section
				class="mb-8 border-t border-b first:border-t-0 border-mauve-6 md:mb-16 last:mb-0"
			>
				<Headline
					as="h2"
					type="secondary"
					containerClass="bg-white border-b-0"
					id="gallery-headline-{encodeURIComponent(project.title)}"
				>
					<a
						sveltekit:prefetch
						class="focus:outline-none growing-underline"
						href="projects/{project.slug}"
					>
						{project.title}
					</a>
				</Headline>
				<Gallery.Root
					class="relative bg-white/[.85]"
					step={0.6}
					labelledby="gallery-headline-{encodeURIComponent(
						project.title,
					)}"
				>
					<Gallery.Previous
						class="cursor-w-resize bg-white absolute top-0 lg:top-1/2 right-0 lg:left-2 lg:right-auto z-10 transform -translate-y-1/2 -translate-x-[calc(100%+16px)] lg:translate-x-0 block p-1 text-xs  border rounded-full md:p-2 touch-manipulation focus:outline-none ring-mauve-12 focus:ring-1"
					>
						<AccessibleIcon label="Go to previous">
							<West />
						</AccessibleIcon>
					</Gallery.Previous>
					<Gallery.Next
						class="absolute top-0 right-0 z-10 block p-1 text-xs transform -translate-x-2 -translate-y-1/2 bg-white border rounded-full cursor-e-resize lg:translate-x-0 lg:top-1/2 lg:right-2 md:p-2 touch-manipulation focus:outline-none ring-mauve-12 focus:ring-1"
					>
						<AccessibleIcon label="Go to next">
							<East />
						</AccessibleIcon>
					</Gallery.Next>
					<Gallery.Content
						class="flex border-b border-t border-mauve-6 border-r-0 h-96 md:h-[32rem] focus:outline-none ring-mauve-6 focus:ring-1 no-scrollbar"
					>
						{#if project.vertical && projectMediaData && projectMediaData[project.vertical]}
							<Media
								media={projectMediaData[project.vertical]}
								src="./assets/projects/{project.slug}/{projectMediaData[
									project.vertical
								].src}"
								alt=""
								class="block h-full border-r last:border-r-0 border-mauve-6 max-w-none"
								loading={index > 1 ? 'lazy' : undefined}
							/>
						{/if}
						{#if project.horizontal && projectMediaData && projectMediaData[project.horizontal]}
							<Media
								media={projectMediaData[project.horizontal]}
								src="./assets/projects/{project.slug}/{projectMediaData[
									project.horizontal
								].src}"
								alt=""
								class="block h-full border-r last:border-r-0 border-mauve-6 max-w-none"
								loading={index > 1 ? 'lazy' : undefined}
							/>
						{/if}
						{#if project.media}
							{#each project.media as media (media)}
								{#if media && projectsMediaData && projectMediaData[media]}
									<Media
										media={projectMediaData[media]}
										src="./assets/projects/{project.slug}/{projectMediaData[
											media
										].src}"
										class="block h-full border-r last:border-r-0 border-mauve-6 max-w-none"
										alt=""
										loading={index > 1 ? 'lazy' : undefined}
									/>
								{/if}
							{/each}
						{/if}
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

{#if !$tags.size && experimental.length}
	<Headline as="h2" containerClass="py-8 md:py-16">
		Experi&shy;mental
	</Headline>

	<section class="mb-32">
		{#each experimental as experiment}
			{@const computed = experiment.slug.replace('-', ' ')}
			<!-- content here -->
			<Headline as="h3" type="secondary" containerClass="!p-0 bg-white">
				<a
					sveltekit:prefetch
					class="group flex justify-between items-center pr-4 transition-[padding] bg-white md:justify-between hover:pr-2 focus:pr-2 focus:outline-none"
					href="experimental/{experiment.slug}"
					title="Read more about the project {experiment.slug}"
				>
					<span class="flex">
						{#if experiment.thumbnail}
							<img
								loading="lazy"
								alt={`Thumbnail for fun Project ${computed}`}
								width="40"
								height="40"
								class="block w-12 h-12 bg-white max-w-none"
								src={`./assets/fun/${experiment.thumbnail}`}
							/>
						{/if}
						<span
							class={`block p-2 group-hover:underline group-focus:underline decoration-from-font ${
								experiment.thumbnail
									? 'border-l border-mauve-6'
									: ''
							}`}
						>
							{computed[0].toUpperCase() + computed.slice(1)}
						</span>
					</span>
					<span aria-hidden="true">
						<East />
					</span>
				</a>
			</Headline>
		{/each}
	</section>
{/if}
