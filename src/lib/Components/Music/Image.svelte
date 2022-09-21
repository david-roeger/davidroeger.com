<script lang="ts">
	export let url: string;
	export let alt: string;
</script>

<img
	loading="lazy"
	width="60"
	height="60"
	class="h-[68px] md:h-[92px] w-[68px] md:w-[92px] object-cover bg-mauve-3"
	src={url}
	{alt}
/>
