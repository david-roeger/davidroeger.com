<script>
	import * as Dialog from '$lib/Primitives/Dialog';

	export let media = [];
	export let vertical;
	export let horizontal;
	export let tags;
	export let title;

	import AccessibleIcon from '$components/AccessibleIcon/AccessibleIcon.svelte';
	import { Media } from '$lib/Components/Media';

	import TagIcon from '$assets/Icons/24/tag.svg';
	import Close from '$assets/Icons/24/close.svg';

	import Headline from '$components/Headline/Headline.svelte';

	import projectsMediaData from '$assets/projectsMediaData.json';
	import { page } from '$app/stores';

	const slug = $page.url.pathname.split('/').pop();
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

	const cols = 3;
	const nestedMediaArray = [];
	for (let i = 0; i < cols; i++) {
		nestedMediaArray.push([]);
	}
	/* place mediaarray items insted nested media with three levels*/
	mediaArray.forEach((medium, index) => {
		nestedMediaArray[index % cols].push(medium);
	});
</script>

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
		<div class="border-b border-mauve-6">
			<div
				class="p-1 md:w-3/4 md:border-r flex-grow-1 border-mauve-6 bg-white/[.85] flex flex-wrap items-baseline"
			>
				<p class="m-1 text">Type Design & Web Development</p>
			</div>
		</div>

		<div class="border-b border-mauve-6">
			<div
				class="p-1 md:w-3/4 md:border-r flex-grow-1 border-mauve-6 bg-white/[.85]"
			>
				<p class="m-1 text-xs text-mauve-11">
					Akina Hocke, Jessica Wiest
				</p>
				<p class="m-1 text-xs text-mauve-11">
					Hochschule der Medien (2021)
				</p>
				<p class="m-1 text-xs text-mauve-11">
					Hochschule der Medien (2021)
				</p>
			</div>
		</div>
		<!--div class="border-b border-mauve-6">
			{#if horizontalMedia}
				<div class="md:border-r border-mauve-6 md:w-3/4">
					<Media
						media={horizontalMedia}
						src="../assets/projects/{slug}/{horizontalMedia.src}"
						alt=""
						class="block"
					/>
				</div>
			{/if}
		</div-->
		<div class="flex">
			<div
				class="p-8 grow md:grow-0 md:w-3/4 md:border-r border-mauve-6 md:p-8 xl:p-16 bg-white/[.85]"
			>
				<div class="max-w-[60ch]">
					<slot />
				</div>
			</div>
		</div>

		<div class="flex p-1 border-t border-mauve-6">
			{#each nestedMediaArray as nestedMedia}
				<div class="flex flex-col m-1">
					{#each nestedMedia as medium (medium.src)}
						<Dialog.Root defaultOpen={false}>
							<Dialog.Trigger
								class="m-1 border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
							>
								<Media
									media={medium}
									src="../assets/projects/{slug}/{medium.src}"
									alt=""
									class="border-r last:border-r-0 border-mauve-6"
								/>
							</Dialog.Trigger>
							<Dialog.Portal>
								<Dialog.Overlay
									class="fixed top-0 bottom-0 left-0 right-0 bg-mauve-12/50"
								/>
								<Dialog.Content
									class="fixed -translate-y-1/2 pointer-events-none top-1/2 "
								>
									<Media
										media={medium}
										src="../assets/projects/{slug}/{medium.src}"
										alt=""
										class="block portrait:h-auto portrait:w-full portrait:max-w-[100vw] landscape:w-auto landscape:h-full landscape:max-h-screen"
									/>
									<Dialog.Close
										class="absolute top-0 right-0 p-1 m-1 text-xs bg-white border rounded-full touch-manipulation border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1"
									>
										<AccessibleIcon label="Close">
											<Close />
										</AccessibleIcon>
									</Dialog.Close>
								</Dialog.Content>
							</Dialog.Portal>
						</Dialog.Root>
					{/each}
				</div>
			{/each}
		</div>
	</section>
</article>
