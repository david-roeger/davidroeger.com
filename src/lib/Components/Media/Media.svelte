<script lang="ts">
	import type { Media } from '$lib/types';
	export let media: Media | undefined = undefined;
	export let src = 'src';
	export let loading: 'lazy' | undefined = undefined;
	export let alt: string;
	export let id: string | undefined = undefined;

	let c = '';
	export { c as class };
</script>

{#if media && media.src}
	{#if media.src.includes('mp4')}
		<video
			width={media.width || undefined}
			height={media.height || undefined}
			{id}
			muted
			autoplay
			loop
			playsInline
			controls={undefined}
			class={c}
			src={src || media.src}
			{...$$restProps}
		/>
	{:else}
		<img
			width={media.width || undefined}
			height={media.height || undefined}
			{id}
			{loading}
			{alt}
			class={c}
			src={src || media.src}
			{...$$restProps}
		/>
	{/if}
{/if}
