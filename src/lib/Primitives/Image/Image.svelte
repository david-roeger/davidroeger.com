<script lang="ts">
	import type { Picture } from './types';

	/**
	 * the output of a vite-imagetools import, using the `picture` query for output
	 */

	export let picture: Picture;

	export let alt: string;
	export let loading: 'eager' | 'lazy' | undefined = undefined;

	let c = '';
	export { c as class };
	export let imgClass = '';
</script>

<picture class={c}>
	{#each Object.keys(picture.sources) as format}
		{@const srcset = picture.sources[format]
			.map((s) => `${s.src} ${s.w}w`)
			.join(', ')}
		<source type="image/{format}" {srcset} />
	{/each}
	<img
		width={picture.fallback.w}
		height={picture.fallback.h}
		{alt}
		{loading}
		class={imgClass}
	/>
</picture>
