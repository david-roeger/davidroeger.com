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
	import { Media } from '$components/Media';
	import { Head } from '$components/Head';
	import { AccessibleIcon } from '$components/AccessibleIcon';

	import East from '$assets/Icons/24/east.svg?component';
	import West from '$assets/Icons/24/west.svg?component';
	import Close16 from '$assets/Icons/16/close.svg?component';
	import East16 from '$assets/Icons/16/east.svg?component';
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

<Head
	additionalMetaTags={[
		{
			name: 'theme-color',
			// green 3
			content: '#E9F9EE',
			media: '(prefers-color-scheme: light)'
		},
		{
			name: 'theme-color',
			content: '#0F291E',
			media: '(prefers-color-scheme: dark)'
		}
	]}
/>

<Tags.Root
	defaultValue={defaultTags}
	on:valueChange={(e) => updateQueries(e.detail.value)}
>
	<Tags.List
		label="Filter Projects"
		class="flex flex-wrap p-1 border-b transition-all border-mauve-6 ocus:outline-none ring-mauve-6 ring-inset focus:ring-1"
	>
		{#if $tags.size}
			<div in:slideLeft={{}} out:slideLeft={{ easing: reversedEasing }}>
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
					tag
				)
					? 'bg-green-5'
					: 'bg-white'}"
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
						project.title
					)}"
				>
					<Gallery.Previous
						class="cursor-w-resize bg-white absolute top-0 lg:top-1/2 right-0 lg:left-2 lg:right-auto z-10 transform -translate-y-1/2 -translate-x-[calc(100%+16px)] lg:translate-x-0 block p-1 text-xs  border rounded-full touch-manipulation focus:outline-none ring-mauve-12 focus:ring-1"
					>
						<AccessibleIcon label="Go to previous">
							<West />
						</AccessibleIcon>
					</Gallery.Previous>
					<Gallery.Next
						class="absolute top-0 right-0 z-10 block p-1 text-xs bg-white border rounded-full transform -translate-x-2 -translate-y-1/2 cursor-e-resize lg:translate-x-0 lg:top-1/2 lg:right-2 touch-manipulation focus:outline-none ring-mauve-12 focus:ring-1"
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
								src="/assets/projects/{project.slug}/{projectMediaData[
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
								src="/assets/projects/{project.slug}/{projectMediaData[
									project.horizontal
								].src}"
								alt=""
								class="block h-full border-r last:border-r-0 border-mauve-6 max-w-none"
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
						class="inline-flex items-center gap-2 px-4 p-1 m-2 text-xs transition-[gap,padding] border border-mauve-12 bg-white md:justify-between hover:gap-4 hover:pr-2 focus:gap-4 focus:pr-2 focus:outline-none ring-mauve-12 focus:ring-1"
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
			</section>
		{/each}
	</div>
</Tags.Root>

{#if !$tags.size && experimental.length}
	<Headline as="h2" containerClass="py-8 md:py-16" id="experimental">
		<span aria-hidden="true" class="select-none">::</span>
		Experi&shy;mental
	</Headline>

	<section class="mb-32">
		{#each experimental as experiment}
			{@const computed = experiment.slug.replace('-', ' ')}
			<!-- content here -->
			<Headline as="h3" type="secondary" containerClass="!p-0 bg-white">
				<a
					class="group flex justify-between items-center pr-4 transition-[padding] bg-white md:justify-between hover:pr-2 focus:pr-2 focus:outline-none"
					href="experimental/{experiment.slug}"
					title="Read more about the project {experiment.slug}"
				>
					<span class="flex">
						<img
							loading="lazy"
							alt="Thumbnail for experimental Project {computed}"
							width="40"
							height="40"
							class="block w-12 h-12 bg-white max-w-none"
							src="/assets/experimental/{experiment.slug}.png"
						/>
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
