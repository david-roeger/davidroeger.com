<script lang="ts">
	import type { Media } from '$lib/types';
	export let media: Media;
	export let src = 'src';
	export let loading: 'lazy' | undefined = undefined;
	export let alt: string;

	let c = '';
	export { c as class };
</script>

{#if media.src}
	{#if media.src.includes('mp4')}
		<video
			width={media.width || undefined}
			height={media.height || undefined}
			{loading}
			muted
			autoplay
			loop
			playsInline
			controls={false}
			{alt}
			class={c}
			src={src || media.src}
		/>
	{:else}
		<img
			width={media.width || undefined}
			height={media.height || undefined}
			{loading}
			{alt}
			class={c}
			src={src || media.src}
		/>
	{/if}
{/if}
