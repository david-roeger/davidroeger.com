<script lang="ts">
	import { getContext } from 'svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	console.info(`projects/slug (${data.slug}) Page: script call`);

	import AccessibleIcon from '$components/AccessibleIcon/AccessibleIcon.svelte';
	import { Media } from '$components/Media';

	import TagIcon from '$assets/Icons/24/tag.svg';
	import LinkIcon from '$assets/Icons/24/link.svg';
	import GithubIcon from '$assets/Icons/24/github.svg';

	import Headline from '$components/Headline/Headline.svelte';

	import pmd from '$assets/projectsMediaData.json';
	import Head from '$components/Head/Head.svelte';
	import type { Media as MediaType, ProjectsMediaData } from '$lib/types';

	const projectsMediaData: ProjectsMediaData = { ...pmd };

	const projectMediaData = projectsMediaData[data.slug];

	const verticalMedia = data.vertical ? projectMediaData[data.vertical] : undefined;
	const horizontalMedia = data.horizontal ? projectMediaData[data.horizontal] : undefined;

	const mediaArray: MediaType[] = [];

	if (data.media && Array.isArray(data.media)) {
		data.media.forEach((medium) => {
			if (projectMediaData[medium]) {
				mediaArray.push(projectMediaData[medium]);
			}
		});
	}

	if (verticalMedia) {
		mediaArray.push(verticalMedia);
	}

	if (horizontalMedia) {
		mediaArray.push(horizontalMedia);
	}

	const getNestedMedia = (md: boolean, lg: boolean) => {
		const array: MediaType[][] = [];
		const cols = lg ? 3 : md ? 2 : 1;
		for (let i = 0; i < cols; i++) {
			array.push([]);
		}
		/* place media array items in nested media with <col> levels*/
		mediaArray.forEach((medium, index) => {
			array[index % cols].push(medium);
		});

		return array;
	};

	const { MD, LG } = getContext('breakpoints');
	$: nestedMediaArray = getNestedMedia($MD, $LG);
</script>

<Head
	additionalMetaTags={[
		{
			name: 'theme-color',
			content: '#E9F9EE'
		}
	]}
/>

<article>
	{#if data.tags.length}
		<div class="flex items-center p-1 text-xs border-b text-mauve-11 border-mauve-6">
			<AccessibleIcon label="Tags"><TagIcon /></AccessibleIcon>
			{#each data.tags as tag (tag)}
				<a
					sveltekit:prefetch
					href={`../projects?tags=${tag}`}
					class="m-1 hover:underline focus:underline decoration-from-font focus:outline-none"
				>
					{tag}
				</a>
			{/each}
		</div>
	{/if}
	<section class="mb-32 border-b border-mauve-6">
		{#if data.title}
			<Headline containerClass="py-8 md:py-16">
				{data.title}
			</Headline>
		{/if}
		{#if data.meta}
			<div class="border-b border-mauve-6">
				<div
					class="p-1 md:w-3/4 md:border-r flex-grow-1 border-mauve-6 bg-white/[.85] flex flex-wrap items-baseline"
				>
					<p class="m-1 text">{data.meta}</p>
				</div>
			</div>
		{/if}
		{#if (data.team && data.team.length > 0) || data.place}
			<div class="border-b border-mauve-6">
				<div class="p-1 md:w-3/4 md:border-r flex-grow-1 border-mauve-6 bg-white/[.85]">
					{#if data.team && data.team.length > 0}
						<p class="m-1 text-xs text-mauve-11">
							{data.team.join(', ')}{!data.place && data.date ? ` (${data.date})` : ''}
						</p>
					{/if}
					{#if data.place}
						<p class="m-1 text-xs text-mauve-11">
							{data.place}{data.date ? ` (${data.date})` : ''}
						</p>
					{/if}
				</div>
			</div>
		{/if}
		{#if data.github || data.project}
			<div class="border-b border-mauve-6">
				<div class="p-1 md:w-3/4 md:border-r flex-grow-1 border-mauve-6 bg-white/[.85]">
					{#if data.project}
						<p class="m-1 text-xs text-mauve-11">
							<a
								class="flex items-center space-x-1 hover:underline focus:underline decoration-from-font focus:outline-none"
								href={data.project}
								rel="noopener noreferrer"
								target="_blank"
							>
								<LinkIcon aria-hidden />
								<span>View Project</span>
							</a>
						</p>
					{/if}
					{#if data.github}
						<p class="m-1 text-xs text-mauve-11">
							<a
								class="flex items-center space-x-1 hover:underline focus:underline decoration-from-font focus:outline-none"
								href={data.github}
								rel="noopener noreferrer"
								target="_blank"
							>
								<GithubIcon aria-hidden />
								<span>Github</span>
							</a>
						</p>
					{/if}
				</div>
			</div>
		{/if}
		<div class="flex">
			<div
				class="py-8 px-2 grow md:grow-0 md:w-3/4 md:border-r border-mauve-6 md:p-8 xl:p-16 bg-white/[.85]"
			>
				<div class="readable markdown">
					{@html data.html}
				</div>
			</div>
		</div>

		{#if nestedMediaArray?.[0].length > 0}
			<div class="flex p-1 border-t border-mauve-6">
				{#each nestedMediaArray as nestedMedia}
					<div class="flex flex-col flex-1 ">
						{#each nestedMedia as medium (medium.src)}
							<Media
								media={medium}
								src="../assets/projects/{data.slug}/{medium.src}"
								alt=""
								class="p-1 border-mauve-6"
							/>
						{/each}
					</div>
				{/each}
			</div>
		{/if}
	</section>
</article>

<style global>
	.markdown > * {
		@apply mb-2;
	}
	.markdown > *:last-child {
		@apply mb-0;
	}
	.markdown h1 {
		@apply text-6xl;
	}
	.markdown h2 {
		@apply text-4xl;
	}

	.markdown h3 {
		@apply text-2xl;
	}

	.markdown h4 {
		@apply text-xl;
	}
</style>
