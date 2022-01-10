<script>
	export let thumbnail;
	export let tags;
	export let title;

	import AccessibleIcon from '$components/AccessibleIcon/AccessibleIcon.svelte';
	import TagIcon from '$assets/Icons/24/tag.svg';
	import Headline from '$components/Headline/Headline.svelte';
</script>

<section>
	{#if tags?.length}
		<p class="flex items-center p-1 text-xs border-b text-mauve-11 border-mauve-6">
			<AccessibleIcon label="Tags"><TagIcon /></AccessibleIcon>
			{#each tags as tag (tag)}
				<span class="m-1">{tag} </span>
			{/each}
		</p>
	{/if}
	<div class="border-b border-mauve-6">
		{#if thumbnail}
			<img
				height="120"
				loading="lazy"
				alt="img"
				class="block border-r h-44 border-mauve-6"
				src="../assets/projects/{thumbnail}"
			/>
		{/if}
		{#if title}
			<Headline class="py-8 border-b-0 md:py-16">{title}</Headline>
		{/if}
	</div>
	<slot />
</section>
