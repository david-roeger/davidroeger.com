<script lang="ts">
	logger.page('projects/(ssg)/[slug]/[[gallery]]: +page.svelte');
	// ----------------------------------------------------------------

	import { pushState } from '$app/navigation';

	import { Head } from '$components/Head';
	import { Headline } from '$components/Headline';
	import { AccessibleIcon } from '$components/AccessibleIcon';

	import { ContactForm } from '$slices/ContactForm';
	import { LightBox } from '$slices/LightBox';

	import TagIcon from '$assets/Icons/24/tag.svg?component';
	import LinkIcon from '$assets/Icons/24/link.svg?component';
	import GithubIcon from '$assets/Icons/24/github.svg?component';
	import pmd from '$assets/projectsMediaData.json';

	import { logger } from '$utils/logger';

	import type { Media as MediaType, ProjectsMediaData } from '$types';
	// ----------------------------------------------------------------

	import type { PageData } from './$types';
	import { AnimatedEntry } from '$components/AnimatedEntry';

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

<article class="mb-32">
	{#if data.project.tags.length}
		<div
			class="flex items-center border-b border-mauve-6 p-1 text-xs text-mauve-11"
		>
			<AccessibleIcon label="Tags"><TagIcon /></AccessibleIcon>
			{#each data.project.tags as tag (tag)}
				<a
					href="/projects?tags={tag}"
					class="m-1 decoration-from-font hover:underline focus:underline focus:outline-none"
				>
					{tag}
				</a>
			{/each}
		</div>
	{/if}
	<section class="mb-32 border-b border-mauve-6">
		{#if data.project.title}
			<Headline containerClass="py-8 md:py-16">
				<span aria-hidden="true" class="select-none">::</span>
				{data.project.title}
			</Headline>
		{/if}
		{#if data.project.meta}
			<div class="border-b border-mauve-6">
				<div
					class="flex-grow-1 flex flex-wrap items-baseline border-mauve-6 bg-white/[.85] p-1 md:w-3/4 md:border-r"
				>
					<p class="text m-1">{data.project.meta}</p>
				</div>
			</div>
		{/if}
		{#if (data.project.team && data.project.team.length > 0) || data.project.place}
			<div class="border-b border-mauve-6">
				<div
					class="flex-grow-1 border-mauve-6 bg-white/[.85] p-1 md:w-3/4 md:border-r"
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
					class="flex-grow-1 border-mauve-6 bg-white/[.85] p-1 md:w-3/4 md:border-r"
				>
					{#if data.project.link}
						<p class="m-1 text-xs text-mauve-11">
							<a
								class="flex items-center space-x-1 decoration-from-font hover:underline focus:underline focus:outline-none"
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
								class="flex items-center space-x-1 decoration-from-font hover:underline focus:underline focus:outline-none"
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
		<AnimatedEntry class="flex">
			<div
				class="grow border-mauve-6 bg-white/[.85] px-2 py-8 md:w-3/4 md:grow-0 md:border-r md:p-8 xl:p-16"
			>
				<div class="readable markdown">
					{@html data.project.html}
				</div>
			</div>
		</AnimatedEntry>
	</section>
	<AnimatedEntry>
		<LightBox
			{mediaArray}
			title={`Fullscreen Gallery for ${data.project.title}`}
			description={`Currently showing media ${
				data.gallery !== undefined ? data.gallery + 1 : 0
			} of ${mediaArray.length}`}
			defaultIndex={data.gallery}
			assetPath={data.project.slug}
			on:mediaChange={(e) => {
				const { index } = e.detail;
				if (index === undefined) {
					pushState(`/projects/${data.project.slug}`, {});
					return;
				}

				pushState(`/projects/${data.project.slug}/${index}`, {});
			}}
			on:dialogChange={(e) => {
				const { open, index } = e.detail;
				if (!open || index === undefined) {
					pushState(`/projects/${data.project.slug}`, {});
					return;
				}

				pushState(`/projects/${data.project.slug}/${index}`, {});
			}}
		/>
	</AnimatedEntry>
	<AnimatedEntry>
		<ContactForm variant="green" borderTop={true}>
			<span slot="headline">Bla Bla Bla</span>
		</ContactForm>
	</AnimatedEntry>
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
