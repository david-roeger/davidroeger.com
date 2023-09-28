<script lang="ts">
	export let show = false;
	export let play = false;
	console.log(show);
</script>

<div
	class="h-[64px] md:h-[88px] overflow-hidden relative transition-[transform,width] {show
		? 'w-[32px] md:w-[44px]'
		: 'w-0 md:w-0'}"
>
	<div
		class="absolute right-0 h-full w-full flex items-center justify-end p-2"
	>
		<div
			class="border-mauve-12 mask h-full my-2 border-2 flex items-center justify-center rounded-full"
			style="aspect-ratio: 1/1"
			class:animate-spin={play}
		>
			<div
				class="bg-white border-mauve-12 border-2 w-1/4 h-1/4 rounded-full position"
			/>
		</div>
	</div>
</div>
