<script lang="ts">
	logger.page('projects: +page.svelte');
	// ----------------------------------------------------------------

	import { writable } from 'svelte/store';

	import BezierEasing from 'bezier-easing';

	import { page } from '$app/stores';
	import { browser, building } from '$app/environment';

	import { mapToRange, replaceStateWithQuery } from '$utils';
	import { logger } from '$utils/logger';

	import * as Tags from '$primitives/Tags';
	import * as Gallery from '$primitives/Gallery';

	import { Headline } from '$components/Headline';
	import West from '$assets/Icons/24/west.svg?component';
	import Close16 from '$assets/Icons/16/close.svg?component';
	import East16 from '$assets/Icons/16/east.svg?component';
	import { Media } from '$components/Media';
	import { AnimatedEntry } from '$components/AnimatedEntry';
	import { AccessibleIcon } from '$components/AccessibleIcon';

	import East from '$assets/Icons/24/east.svg?component';
	import pmd from '$assets/projectsMediaData.json';

	import type { ProjectMetaData, ProjectsMediaData } from '$types';
	// ----------------------------------------------------------------

	export let data: PageData;
	import type { PageData } from './$types';

	const projectsMediaData: ProjectsMediaData = { ...pmd };

	const projects = data.projects;
	const experimental = data.experimental;

	let filteredProjects: ProjectMetaData[] = [];

	let tags = writable<Set<string>>(new Set());
	let availableTags: Set<string> = new Set();

	projects.forEach((project) => {
		project.tags.forEach((tag) => {
			availableTags.add(tag);
		});
	});

	let defaultTags: string[] = [];

	const encoded = building ? null : $page.url.searchParams.get('tags');
	const decoded = decodeURIComponent(encoded ?? '');

	if (decoded && decoded !== 'null') {
		const candidates = decoded.split(',');
		const final: Set<string> = new Set();

		candidates.forEach((candidate) => {
			if (!availableTags.has(candidate)) {
				return;
			}
			final.add(candidate);
		});

		$tags = new Set([...final]);
		defaultTags = [...final];
	}

	const updateQueries = (queries: string[]) => {
		$tags = new Set([...queries]);
	};

	const updateProjects = (tags: Set<string>) => {
		if (tags.size) {
			filteredProjects = projects.filter((project) => {
				return project.tags.some((tag) => tags.has(tag));
			});
			if (browser) {
				replaceStateWithQuery({
					tags: [...tags].join(',')
				});
			}
			return;
		}

		if (browser) {
			replaceStateWithQuery({
				tags: ''
			});
		}

		filteredProjects = projects;
	};

	$: updateProjects($tags);

	const baseEasing = BezierEasing(0.4, 0, 0.2, 1);
	const reversedEasing = BezierEasing(0.8, 0, 0.6, 1);
	function slideLeft(
		_: HTMLElement,
		{ start = -34, end = 0, duration = 150, easing = baseEasing }
	) {
		return {
			duration,
			css: (t: number) => {
				const eased = easing(t);
				const mapped = mapToRange(eased, 0, 1, start, end);
				return `margin-left: ${mapped}px;`;
			}
		};
	}

	const getProjectMediaData = (slug: string) => {
		if (Object.keys(projectsMediaData).includes(slug)) {
			return projectsMediaData[slug];
		}
	};
</script>

<Tags.Root
	defaultValue={defaultTags}
	on:valueChange={(e) => updateQueries(e.detail.value)}
>
	<Tags.List
		label="Filter Projects"
		class="ocus:outline-none flex flex-wrap border-b border-mauve-6 p-1 ring-inset ring-mauve-6 transition-all focus:ring-1"
	>
		{#if $tags.size}
			<div in:slideLeft={{}} out:slideLeft={{ easing: reversedEasing }}>
				<Tags.Unset
					class="m-1 touch-manipulation rounded-full border border-mauve-12 p-1 text-xs ring-mauve-12 focus:outline-none focus:ring-1"
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
				class=" m-1 touch-manipulation rounded-full border border-mauve-12 bg-white px-4 py-1 text-xs ring-mauve-12 transition-[margin] focus:outline-none focus:ring-1 data-[state=active]:bg-green-6"
			>
				{tag}
			</Tags.Tag>
		{/each}
	</Tags.List>
	<Headline containerClass="py-8 md:py-16">
		<span aria-hidden="true" class="select-none">::</span>
		Projects
	</Headline>

	<div class={$tags.size ? 'pb-32' : ''}>
		{#each filteredProjects as project, index (project.title)}
			{@const projectMediaData = getProjectMediaData(project.slug)}
			<AnimatedEntry
				as="section"
				class="mb-8 border-b border-t border-mauve-6 first:border-t-0 last:mb-0 md:mb-16"
			>
				<Headline
					as="h2"
					type="secondary"
					containerClass="bg-white border-b-0"
					id="gallery-headline-{encodeURIComponent(project.title)}"
				>
					<a
						class="growing-underline focus:outline-none"
						href="projects/{project.slug}"
					>
						{project.title}
					</a>
				</Headline>
				<Gallery.Root
					class="relative bg-white/[.85]"
					step={0.6}
					labelledby="gallery-headline-{encodeURIComponent(
						project.title
					)}"
				>
					<Gallery.Previous
						class="absolute right-0 top-0 z-10 block -translate-x-[calc(100%+16px)] -translate-y-1/2 transform cursor-w-resize touch-manipulation rounded-full border bg-white p-1 text-xs ring-mauve-12  focus:outline-none focus:ring-1 lg:left-2 lg:right-auto lg:top-1/2 lg:translate-x-0"
					>
						<AccessibleIcon label="Go to previous">
							<West />
						</AccessibleIcon>
					</Gallery.Previous>
					<Gallery.Next
						class="absolute right-0 top-0 z-10 block -translate-x-2 -translate-y-1/2 transform cursor-e-resize touch-manipulation rounded-full border bg-white p-1 text-xs ring-mauve-12 focus:outline-none focus:ring-1 lg:right-2 lg:top-1/2 lg:translate-x-0"
					>
						<AccessibleIcon label="Go to next">
							<East />
						</AccessibleIcon>
					</Gallery.Next>
					<Gallery.Content
						class="no-scrollbar flex h-96 border-b border-r-0 border-t border-mauve-6 ring-mauve-6 focus:outline-none focus:ring-1 md:h-[32rem]"
					>
						{#if project.vertical && projectMediaData && projectMediaData[project.vertical]}
							<Media
								media={projectMediaData[project.vertical]}
								src="/assets/projects/{project.slug}/{projectMediaData[
									project.vertical
								].src}"
								alt=""
								class="block h-full max-w-none border-r border-mauve-6 last:border-r-0"
								loading={index > 1 ? 'lazy' : undefined}
							/>
						{/if}
						{#if project.horizontal && projectMediaData && projectMediaData[project.horizontal]}
							<Media
								media={projectMediaData[project.horizontal]}
								src="/assets/projects/{project.slug}/{projectMediaData[
									project.horizontal
								].src}"
								alt=""
								class="block h-full max-w-none border-r border-mauve-6 last:border-r-0"
								loading={index > 1 ? 'lazy' : undefined}
							/>
						{/if}
						{#if project.media}
							{#each project.media as media (media)}
								{#if media && projectMediaData && projectMediaData[media]}
									<Media
										media={projectMediaData[media]}
										src="/assets/projects/{project.slug}/{projectMediaData[
											media
										].src}"
										class="block h-full max-w-none border-r border-mauve-6 last:border-r-0"
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
						class="m-2 inline-flex items-center gap-2 border border-mauve-12 bg-white p-1 px-4 text-xs ring-mauve-12 transition-[gap,padding] hover:gap-4 hover:pr-2 focus:gap-4 focus:pr-2 focus:outline-none focus:ring-1 md:justify-between"
						href="projects/{project.slug}"
						title="Read more about the project {project.slug}"
					>
						Read More <AccessibleIcon
							label={`about the project ${project.slug}`}
						>
							<East16 />
						</AccessibleIcon>
					</a>
				</div>
			</AnimatedEntry>
		{/each}
	</div>
</Tags.Root>

{#if !$tags.size && experimental.length}
	<Headline
		as="h2"
		containerClass="py-8 md:py-16"
		id="experimental"
	>
		<span aria-hidden="true" class="select-none">::</span>
		Experi&shy;mental
	</Headline>

	<section class="mb-32">
		{#each experimental as experiment, i}
			{@const computed = experiment.slug.replace('-', ' ')}
			<!-- content here -->
			<AnimatedEntry>
				<Headline
					as="h3"
					type="secondary"
					containerClass="!p-0 bg-white"
				>
					<a
						class="group flex items-center justify-between bg-white pr-4 transition-[padding] hover:pr-2 focus:pr-2 focus:outline-none md:justify-between"
						href="experimental/{experiment.slug}"
						title="Read more about the project {experiment.slug}"
					>
						<span class="flex">
							<img
								loading="lazy"
								alt="Thumbnail for experimental Project {computed}"
								width="40"
								height="40"
								class="block h-12 w-12 max-w-none bg-white"
								src="/assets/experimental/{experiment.slug}.png"
							/>
							<span
								class={`block p-2 decoration-from-font group-hover:underline group-focus:underline ${
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
			</AnimatedEntry>
		{/each}
	</section>
{/if}
