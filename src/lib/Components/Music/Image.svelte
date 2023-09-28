<script lang="ts">
	export let url: string;
	export let alt: string;
</script>

<img
	loading="lazy"
	width="60"
	height="60"
	class="h-[64px] md:h-[88px] w-[64px] md:w-[88px] object-cover bg-mauve-3"
	src={url}
	{alt}
/>
