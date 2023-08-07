<script lang="ts">
	logger.page('projects/(ssg)/[slug]/[[gallery]]: +page.svelte');
	// ----------------------------------------------------------------

	import { goto } from '$app/navigation';

	import {Head} from '$components/Head';
	import {Headline} from '$components/Headline';
	import {AccessibleIcon} from '$components/AccessibleIcon';

	import {ContactForm} from '$slices/ContactForm';
	import {LightBox} from '$slices/LightBox';

	import TagIcon from '$assets/Icons/24/tag.svg?component';
	import LinkIcon from '$assets/Icons/24/link.svg?component';
	import GithubIcon from '$assets/Icons/24/github.svg?component';
	import pmd from '$assets/projectsMediaData.json';

	import { logger } from '$utils';

	import type { Media as MediaType, ProjectsMediaData } from '$types';
	// ----------------------------------------------------------------

	import type { PageData } from './$types';

	export let data: PageData;

	logger.page(
		`projects/(ssg)/[slug]/[[gallery]]: +page.svelte // ${data.project.slug} / ${data.gallery}`
	);

	const projectsMediaData: ProjectsMediaData = { ...pmd };

	const projectMediaData = projectsMediaData[data.project.slug];

	const verticalMedia = data.project.vertical
		? projectMediaData[data.project.vertical]
		: undefined;
	const horizontalMedia = data.project.horizontal
		? projectMediaData[data.project.horizontal]
		: undefined;

	const mediaArray: MediaType[] = [];

	if (data.project.media && Array.isArray(data.project.media)) {
		data.project.media.forEach((medium) => {
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

<article class="mb-32">
	{#if data.project.tags.length}
		<div
			class="flex items-center p-1 text-xs border-b text-mauve-11 border-mauve-6"
		>
			<AccessibleIcon label="Tags"><TagIcon /></AccessibleIcon>
			{#each data.project.tags as tag (tag)}
				<a
					href="/projects?tags={tag}"
					class="m-1 hover:underline focus:underline decoration-from-font focus:outline-none"
				>
					{tag}
				</a>
			{/each}
		</div>
	{/if}
	<section class="mb-32 border-b border-mauve-6">
		{#if data.project.title}
			<Headline containerClass="py-8 md:py-16">
				{data.project.title}
			</Headline>
		{/if}
		{#if data.project.meta}
			<div class="border-b border-mauve-6">
				<div
					class="p-1 md:w-3/4 md:border-r flex-grow-1 border-mauve-6 bg-white/[.85] flex flex-wrap items-baseline"
				>
					<p class="m-1 text">{data.project.meta}</p>
				</div>
			</div>
		{/if}
		{#if (data.project.team && data.project.team.length > 0) || data.project.place}
			<div class="border-b border-mauve-6">
				<div
					class="p-1 md:w-3/4 md:border-r flex-grow-1 border-mauve-6 bg-white/[.85]"
				>
					{#if data.project.team && data.project.team.length > 0}
						<p class="m-1 text-xs text-mauve-11">
							{data.project.team.join(', ')}{!data.project
								.place && data.project.date
								? ` (${data.project.date})`
								: ''}
						</p>
					{/if}
					{#if data.project.place}
						<p class="m-1 text-xs text-mauve-11">
							{data.project.place}{data.project.date
								? ` (${data.project.date})`
								: ''}
						</p>
					{/if}
				</div>
			</div>
		{/if}
		{#if data.project.github || data.project.link}
			<div class="border-b border-mauve-6">
				<div
					class="p-1 md:w-3/4 md:border-r flex-grow-1 border-mauve-6 bg-white/[.85]"
				>
					{#if data.project.link}
						<p class="m-1 text-xs text-mauve-11">
							<a
								class="flex items-center space-x-1 hover:underline focus:underline decoration-from-font focus:outline-none"
								href={data.project.link}
								rel="noopener noreferrer"
								target="_blank"
							>
								<LinkIcon aria-hidden />
								<span>View Project</span>
							</a>
						</p>
					{/if}
					{#if data.project.github}
						<p class="m-1 text-xs text-mauve-11">
							<a
								class="flex items-center space-x-1 hover:underline focus:underline decoration-from-font focus:outline-none"
								href={data.project.github}
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
					{@html data.project.html}
				</div>
			</div>
		</div>
	</section>
	<LightBox
		{mediaArray}
		title={`Fullscreen Gallery for ${data.project.title}`}
		description={`Currently showing media ${
			data.gallery !== undefined ? data.gallery + 1 : 0
		} of ${mediaArray.length}`}
		defaultIndex={data.gallery !== undefined ? data.gallery : undefined}
		assetPath={data.project.slug}
		on:mediaChange={(e) => {
			const { index } = e.detail;
			if (index === undefined) {
				// this should be shallow routing
				// https://github.com/sveltejs/kit/issues/2673
				goto(`/projects/${data.project.slug}`, {
					replaceState: false,
					keepFocus: true,
					noScroll: true
				});
				return;
			}
			goto(`/projects/${data.project.slug}/${index}`, {
				replaceState: false,
				keepFocus: true,
				noScroll: true
			});
		}}
	/>

	<ContactForm variant="green" borderTop={true}>
		<span slot="headline">Bla Bla Bla</span>
	</ContactForm>
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
