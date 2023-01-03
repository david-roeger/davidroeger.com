<script lang="ts">
	console.info('projects/(ssg)/[slug]/[[gallery]]: +page.svelte');

	import type { PageData } from './$types';

	export let data: PageData;
	console.info(
		`projects/(ssg)/[slug]/[[gallery]]: +page.svelte // ${data.project.slug} / ${data.gallery}`
	);

	import AccessibleIcon from '$components/AccessibleIcon/AccessibleIcon.svelte';

	import TagIcon from '$assets/Icons/24/tag.svg?component';
	import LinkIcon from '$assets/Icons/24/link.svg?component';
	import GithubIcon from '$assets/Icons/24/github.svg?component';

	import Headline from '$components/Headline/Headline.svelte';

	import pmd from '$assets/projectsMediaData.json';
	import Head from '$components/Head/Head.svelte';
	import type { Media as MediaType, ProjectsMediaData } from '$lib/types';

	import ContactForm from '$lib/Slices/ContactForm/ContactForm.svelte';
	import MediaGalery from '$lib/Slices/MediaGalery/MediaGalery.svelte';

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

		<!-- {#if nestedMediaArray?.[0].length > 0}
			<div class="flex p-1 border-t border-mauve-6">
				{#each nestedMediaArray as nestedMedia}
					<div class="flex flex-col flex-1 ">
						{#each nestedMedia as medium (medium.src)}
							<Dialog.Root
								class="m-1 flex"
								bind:setClose={dialogs[medium.src]}
								defaultOpen={false}
								on:openChange={async (e) => {
									if (e.detail.open) {
										await handleDialogOpen(medium);
									} else {
										if (activeMedia.media)
											await handleDialogClose(medium);
									}
								}}
							>
								<Dialog.Trigger
									title="Open Overlay"
									class="focus:outline-none ring-mauve-6 focus:ring-2"
								>
									<Media
										media={medium}
										src="/assets/projects/{data.project.slug}/{medium.src}"
										alt=""
										class="block"
									/>
								</Dialog.Trigger>
								<Dialog.Portal>
									{#if activeMedia.media}
										<Dialog.Overlay
											on:click={async (e) => {
												e.stopImmediatePropagation();
												await handleDialogClose(medium);
											}}
											class="fixed top-0 w-full h-full bg-mauve-12/80"
											style="opacity: {$opacity};"
										/>
										<Dialog.Content
											focusTrapOptions={{
												preventScroll: true
											}}
											on:keydown={async (e) => {
												if (e.key === 'Escape') {
													e.stopImmediatePropagation();
													await handleDialogClose(
														medium
													);
												}
											}}
											class="fixed inset-0 pointer-events-none"
										>
											<div
												style:width="{activeMedia.width}px"
												style:height="{activeMedia.height}px"
												style:transform="translate({$offsetX}px,
												{$offsetY}px) scale({$scale})"
												class="origin-top-left"
											>
												<Media
													media={activeMedia.media}
													src="/assets/projects/{data.project.slug}/{activeMedia
														.media.src}"
													alt=""
													class="border-mauve-6 w-full h-full block"
												/>
												<div
													class="absolute p-2 transform left-0  -translate-x-full top-1/2 -translate-y-1/2"
												>
													<button
														class="z-10 block p-1 text-xs bg-white border rounded-full cursor-e-resize touch-manipulation focus:outline-none ring-mauve-12 focus:ring-1 pointer-events-none"
														style="opacity: {$opacity};"
													>
														<AccessibleIcon
															label="Go to previous"
														>
															<West16 />
														</AccessibleIcon>
													</button>
												</div>
												<div
													class="absolute p-2 transform right-0 top-1/2 translate-x-full -translate-y-1/2"
												>
													<button
														class="z-10 block p-1 text-xs bg-white border rounded-full cursor-e-resize touch-manipulation focus:outline-none ring-mauve-12 focus:ring-1 pointer-events-none"
														style="opacity: {$opacity};"
													>
														<AccessibleIcon
															label="Go to next"
														>
															<East16 />
														</AccessibleIcon>
													</button>
												</div>
											</div>
											<Dialog.Close
												on:click={async (e) => {
													e.stopImmediatePropagation();
													await handleDialogClose(
														medium
													);
												}}
												class="fixed bg-white/[.85] rounded-full top-0 right-0 m-2 p-1 border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
												style="opacity: {$opacity};"
											>
												<AccessibleIcon
													label="Close Fullscreen"
												>
													<Close16 />
												</AccessibleIcon>
											</Dialog.Close>
										</Dialog.Content>
									{/if}
								</Dialog.Portal>
							</Dialog.Root>
						{/each}
					</div>
				{/each}
			</div>
		{/if} -->
	</section>
	<MediaGalery
		{mediaArray}
		defaultIndex={data.gallery !== undefined
			? parseInt(data.gallery)
			: undefined}
		assetPath={data.project.slug}
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
