<script>
	export let media;
	export let vertical;
	export let horizontal;
	export let tags;
	export let title;

	import AccessibleIcon from '$components/AccessibleIcon/AccessibleIcon.svelte';
	import { Media } from '$lib/Components/Media';

	import TagIcon from '$assets/Icons/24/tag.svg';
	import Headline from '$components/Headline/Headline.svelte';

	import projectsMediaData from '$assets/projectsMediaData.json';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const slug = $page.url.pathname.split('/').pop();
	const projectMediaData = projectsMediaData[slug];

	const verticalMedia = vertical ? projectMediaData[vertical] : undefined;
	const horizontalMedia = horizontal
		? projectMediaData[horizontal]
		: undefined;

	const mediaArray = [];
	if (verticalMedia) mediaArray.push(verticalMedia);
	if (media && Array.isArray(media)) {
		media.forEach((medium) => {
			if (projectMediaData[medium]) {
				mediaArray.push(projectMediaData[medium]);
			}
		});
	}

	import ColorThief from 'colorthief';

	let thumbnailContainer;
	let colorSquare;
	onMount(() => {
		if (verticalMedia) {
			let img = thumbnailContainer.querySelector('img');

			/* could also be video so we need to check */
			if (!img) {
				const video = thumbnailContainer.querySelector('video');
				if (!video) return;
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
				if (video.readyState >= 2) {
					canvas.width = video.videoWidth;
					canvas.height = video.videoHeight;
					ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
					img = new Image();
					img.src = canvas.toDataURL();
					colorThiefImage(img);
					return;
				}
				video.addEventListener('loadeddata', () => {
					canvas.width = video.videoWidth;
					canvas.height = video.videoHeight;
					ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
					img = new Image();
					img.src = canvas.toDataURL();
					colorThiefImage(img);
				});
				return;
			}
			colorThiefImage(img);

			// Make sure image is finished loading
		}
	});

	let stopColors = [];
	const colorThiefImage = (img) => {
		if (img.complete) {
			generatePallette(img);
		} else {
			img.addEventListener('load', function () {
				generatePallette(img);
			});
		}
	};

	function generatePallette(img) {
		const colorThief = new ColorThief();
		let colors = colorThief.getPalette(img, 10);
		if (colors) {
			colors = shuffle(colors);
			colorSquare.style.background = generateGradient(
				colors.splice(0, 5),
			);
		}
	}

	let newColors = [];

	function generateGradient(colors) {
		newColors = [];
		shuffle(colors).forEach((color) => {
			newColors.push(`rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`);
			newColors.push(`rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
		});
		newColors = [...newColors];
		return `linear-gradient(45deg, ${newColors[0]} 0%, ${newColors[1]} 100%), linear-gradient(315deg, ${newColors[2]} 0%, ${newColors[3]} 100%), linear-gradient(225deg, ${newColors[4]} 0%, ${newColors[5]} 100%), linear-gradient(135deg, ${newColors[6]} 0%, ${newColors[7]} 100%), ${newColors[8]}`;
	}

	function shuffle(a) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}
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
	<section class="border-b border-mauve-6">
		{#if title}
			<Headline containerClass="py-8 md:py-16">
				{title}
			</Headline>
		{/if}
		<div
			class="border-b p-1 flex-grow-1 border-mauve-6 bg-white/[.85] flex flex-wrap items-baseline"
		>
			<p class="m-1 text">Type Design & Web Development</p>
			<!--p class="text-xs">Akina Hocke, Jessica Wiest</p-->
			<p class="m-1 text-xs text-mauve-11">
				Hochschule der Medien (2021)
			</p>
		</div>
		<div class="border-b border-mauve-6">
			{#if horizontalMedia}
				<div
					class="md:border-r border-mauve-6 md:w-3/4"
					bind:this={thumbnailContainer}
				>
					<Media
						media={horizontalMedia}
						src="../assets/projects/{slug}/{horizontalMedia.src}"
						alt=""
						class="block"
					/>
				</div>
			{/if}
		</div>
		<div class="flex">
			<div
				class="p-8 grow md:grow-0 md:w-3/4 md:border-r border-mauve-6 md:p-8 xl:p-16 bg-white/[.85]"
			>
				<div class="max-w-[60ch]">
					<slot />
				</div>
			</div>
			<div class="md:grow bg-mauve-5" bind:this={colorSquare} />
		</div>

		<div class="flex border-t border-mauve-6">
			{#each mediaArray as medium (medium.src)}
				<Media
					media={medium}
					src="../assets/projects/{slug}/{medium.src}"
					alt=""
					class="flex-1 block border border-mauve-6"
				/>
			{/each}
		</div>
	</section>
</article>
