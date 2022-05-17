<script context="module" lang="ts">
	console.info('projects/slug Page: script module call');

	import { browser, dev } from '$app/env';

	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ fetch, params }) {
		const { slug } = params;
		console.info(`projects/slug (${slug}) Page: load call`);

		const res = await fetch(`/projects/${slug}.json`);
		console.log('running load', slug);
		if (res.ok) {
			const project = await res.json();
			return {
				props: { ...project },
			};
		}

		return {
			status: 404,
			error: new Error(`Project not found: ${slug}`),
		};
	}

	export const hydrate = browser;
	export const router = browser;
	export const prerender = dev;
</script>

<script lang="ts">
	import { getContext } from 'svelte';

	export let slug: string;
	console.info(`projects/slug (${slug}) Page: script call`);

	export let title: string;
	export let meta: string;

	export let media: string[] = [];
	export let vertical: string;
	export let horizontal: string;
	export let tags: string[] = [];

	export let team: string[];
	export let place: string;
	export let date: string;

	export let github: string = '';
	export let project: string = '';

	export let html: string = '';

	import AccessibleIcon from '$components/AccessibleIcon/AccessibleIcon.svelte';
	import { Media } from '$lib/Components/Media';

	import TagIcon from '$assets/Icons/24/tag.svg';
	import LinkIcon from '$assets/Icons/24/link.svg';
	import GithubIcon from '$assets/Icons/24/github.svg';

	import Headline from '$components/Headline/Headline.svelte';

	import projectsMediaData from '$assets/projectsMediaData.json';
	import { page } from '$app/stores';
	import Head from '$lib/Components/Head/Head.svelte';

	const projectMediaData = projectsMediaData[slug];

	const verticalMedia = vertical ? projectMediaData[vertical] : undefined;
	const horizontalMedia = horizontal
		? projectMediaData[horizontal]
		: undefined;

	const mediaArray = [];

	if (media && Array.isArray(media)) {
		media.forEach((medium) => {
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

	const getNestedMedia = (md, lg) => {
		const array = [];
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
			content: '#E9F9EE',
		},
	]}
/>

<article>
	{#if tags?.length}
		<p
			class="flex items-center p-1 text-xs border-b text-mauve-11 border-mauve-6"
		>
			<AccessibleIcon label="Tags"><TagIcon /></AccessibleIcon>
			{#each tags as tag (tag)}
				<a
					sveltekit:prefetch
					href={`../projects?tags=${tag}`}
					class="m-1 hover:underline focus:underline decoration-from-font focus:outline-none"
				>
					{tag}
				</a>
			{/each}
		</p>
	{/if}
	<section class="mb-32 border-b border-mauve-6">
		{#if title}
			<Headline containerClass="py-8 md:py-16">
				{title}
			</Headline>
		{/if}
		{#if meta}
			<div class="border-b border-mauve-6">
				<div
					class="p-1 md:w-3/4 md:border-r flex-grow-1 border-mauve-6 bg-white/[.85] flex flex-wrap items-baseline"
				>
					<p class="m-1 text">{meta}</p>
				</div>
			</div>
		{/if}
		{#if (team && team.length > 0) || place}
			<div class="border-b border-mauve-6">
				<div
					class="p-1 md:w-3/4 md:border-r flex-grow-1 border-mauve-6 bg-white/[.85]"
				>
					{#if team && team.length > 0}
						<p class="m-1 text-xs text-mauve-11">
							{team.join(', ')}{!place && date
								? ` (${date})`
								: ''}
						</p>
					{/if}
					{#if place}
						<p class="m-1 text-xs text-mauve-11">
							{place}{date ? ` (${date})` : ''}
						</p>
					{/if}
				</div>
			</div>
		{/if}
		{#if github || project}
			<div class="border-b border-mauve-6">
				<div
					class="p-1 md:w-3/4 md:border-r flex-grow-1 border-mauve-6 bg-white/[.85]"
				>
					{#if project}
						<p class="m-1 text-xs text-mauve-11">
							<a
								class="flex items-center space-x-1 hover:underline focus:underline decoration-from-font focus:outline-none"
								href={project}
								rel="noopener noreferrer"
								target="_blank"
							>
								<LinkIcon aria-hidden />
								<span>View Project</span>
							</a>
						</p>
					{/if}
					{#if github}
						<p class="m-1 text-xs text-mauve-11">
							<a
								class="flex items-center space-x-1 hover:underline focus:underline decoration-from-font focus:outline-none"
								href={github}
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
				<div class="max-w-[60ch]">
					{@html html}
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
								src="../assets/projects/{slug}/{medium.src}"
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
