<script lang="ts">
	console.info('projects/[slug]: +page.svelte');

	import { getContext, tick } from 'svelte';
	import * as Dialog from '$primitives/Dialog';

	import type { PageData } from './$types';

	export let data: PageData;

	console.info(`projects/[slug]: +page.svelte // ${data.slug}`);
	import { cubicInOut } from 'svelte/easing';

	import AccessibleIcon from '$components/AccessibleIcon/AccessibleIcon.svelte';
	import { Media } from '$components/Media';

	import TagIcon from '$assets/Icons/24/tag.svg';
	import LinkIcon from '$assets/Icons/24/link.svg';
	import GithubIcon from '$assets/Icons/24/github.svg';

	import Headline from '$components/Headline/Headline.svelte';

	import pmd from '$assets/projectsMediaData.json';
	import Head from '$components/Head/Head.svelte';
	import type { Media as MediaType, ProjectsMediaData } from '$lib/types';
	import type { BreakpointContext } from '$lib/Provider/Breakpoint/types';
	import { spring, tweened } from 'svelte/motion';

	import { get, type Writable } from 'svelte/store';
	import Close16 from '$assets/Icons/16/close.svg';

	const projectsMediaData: ProjectsMediaData = { ...pmd };

	const projectMediaData = projectsMediaData[data.slug];

	const verticalMedia = data.vertical
		? projectMediaData[data.vertical]
		: undefined;
	const horizontalMedia = data.horizontal
		? projectMediaData[data.horizontal]
		: undefined;

	const mediaArray: MediaType[] = [];

	let innerWidth: number;
	let innerHeight: number;

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

	const createNestedMediaArray = (md: boolean) => {
		const array: MediaType[][] = [];
		const cols = md ? 3 : 2;
		for (let i = 0; i < cols; i++) {
			array.push([]);
		}
		/* place media array items in nested media with <col> levels*/
		mediaArray.forEach((medium, index) => {
			array[index % cols].push(medium);
		});

		return array;
	};

	const { MD }: BreakpointContext = getContext('breakpoints');
	$: nestedMediaArray = createNestedMediaArray($MD);
	$: console.log(nestedMediaArray);

	interface ActiveMedia {
		media: MediaType | undefined;
		left: number;
		top: number;
		width: number;
		height: number;
	}

	let overlay = false;

	let activeMedia: ActiveMedia = {
		media: undefined,
		left: 0,
		top: 0,
		width: 0,
		height: 0
	};

	let scale = tweened(1, {
		easing: cubicInOut,
		duration: 300
	});
	let offsetX = tweened(0, {
		easing: cubicInOut,
		duration: 300
	});
	let offsetY = tweened(0, {
		easing: cubicInOut,
		duration: 300
	});

	let opacity = tweened(0, {
		easing: cubicInOut,
		duration: 300
	});

	const getTargetScale = (
		mediaWidth: number,
		mediaHeight: number,
		windowWidth: number,
		windowHeight: number
	) => {
		const widthScale = windowWidth / mediaWidth;
		const heightScale = windowHeight / mediaHeight;

		return Math.min(widthScale, heightScale);
	};

	const dialogs: {
		[key: string]: Writable<(() => void) | undefined>;
	} = {};

	let section: HTMLElement;
	const handleDialogOpen = async (media: MediaType) => {
		console.log(media);

		await tick();
		const button = section.querySelector('button[data-state="open"]');
		if (!button) return;

		const { x, y, width, height } = button.getBoundingClientRect();

		activeMedia.media = media;
		activeMedia.left = x;
		activeMedia.top = y;
		activeMedia.width = width;
		activeMedia.height = height;

		overlay = !overlay;

		const targetScale = getTargetScale(
			width,
			height,
			innerWidth,
			innerHeight
		);

		// center element
		console.log(innerWidth, width, x, y);

		console.log(0 - x + innerWidth / 2 - width / 2);
		console.log(0 - y + innerHeight / 2 - height / 2);
		requestAnimationFrame(() => {
			scale.set(targetScale);
			offsetX.set(0 - x + innerWidth / 2 - width / 2);
			offsetY.set(0 - y + innerHeight / 2 - height / 2);
			opacity.set(1);
		});
	};

	async function handleDialogClose(media: MediaType) {
		requestAnimationFrame(async () => {
			await Promise.all([
				scale.set(1),
				offsetX.set(0),
				offsetY.set(0),
				opacity.set(0)
			]);

			activeMedia = {
				media: undefined,
				left: 0,
				top: 0,
				width: 0,
				height: 0
			};
			overlay = false;

			if (dialogs[media.src]) {
				const setClose = get(dialogs[media.src]);
				if (setClose) setClose();
			}
		});
	}
</script>

<svelte:window
	bind:innerWidth
	bind:innerHeight
	on:scroll={(e) => e.preventDefault()}
/>

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

<article>
	{#if data.tags.length}
		<div
			class="flex items-center p-1 text-xs border-b text-mauve-11 border-mauve-6"
		>
			<AccessibleIcon label="Tags"><TagIcon /></AccessibleIcon>
			{#each data.tags as tag (tag)}
				<a
					data-sveltekit-prefetch
					href={`../projects?tags=${tag}`}
					class="m-1 hover:underline focus:underline decoration-from-font focus:outline-none"
				>
					{tag}
				</a>
			{/each}
		</div>
	{/if}
	<section class="mb-32 border-b border-mauve-6" bind:this={section}>
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
				<div
					class="p-1 md:w-3/4 md:border-r flex-grow-1 border-mauve-6 bg-white/[.85]"
				>
					{#if data.team && data.team.length > 0}
						<p class="m-1 text-xs text-mauve-11">
							{data.team.join(', ')}{!data.place && data.date
								? ` (${data.date})`
								: ''}
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
				<div
					class="p-1 md:w-3/4 md:border-r flex-grow-1 border-mauve-6 bg-white/[.85]"
				>
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
							<Dialog.Root
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
									class="p-1"
									title="Open Overlay"
								>
									<Media
										key={medium.src}
										media={medium}
										src="../assets/projects/{data.slug}/{medium.src}"
										alt=""
									/>
								</Dialog.Trigger>
								<Dialog.Portal>
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
											returnFocusOnDeactivate: false
										}}
										on:keydown={async (e) => {
											if (e.key === 'Escape') {
												e.stopImmediatePropagation();
												await handleDialogClose(medium);
											}
										}}
										class="fixed top-0 bg-mauve-1"
									>
										{#if activeMedia.media}
											<Media
												key={medium.src}
												media={activeMedia.media}
												src="../assets/projects/{data.slug}/{activeMedia
													.media.src}"
												alt=""
												class=" border-mauve-6 p-1 fixed"
												style="left: {activeMedia.left}px; top: {activeMedia.top}px; width: {activeMedia.width}px; height: {activeMedia.height}px; transform: translate({$offsetX}px, {$offsetY}px) scale({$scale}) ;"
											/>
										{/if}
										<Dialog.Close
											on:click={async (e) => {
												e.stopImmediatePropagation();
												await handleDialogClose(medium);
											}}
											class="fixed bg-white/80 rounded-full top-0 right-0 m-1 p-1 border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
											style="opacity: {$opacity};"
										>
											<AccessibleIcon
												label="Close Fullscreen"
											>
												<Close16 />
											</AccessibleIcon>
										</Dialog.Close>
									</Dialog.Content>
								</Dialog.Portal>
							</Dialog.Root>
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
