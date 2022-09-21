<script lang="ts">
	export let fill: string | string[] = 'icon-white';
	let c = '';
	export { c as class };
</script>

<div class="grid w-6 h-6 grid-cols-1 grid-rows-1 {c}">
	<svg
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="14"
		viewBox="0 0 24 14"
		class="animate-wave-1 mt-[5px] origin-bottom col-start-1 row-start-1"
	>
		<path
			d="M5 0H7V14H5V0Z"
			fill="currentColor"
			class={typeof fill === 'string' ? fill : fill[0] || 'icon-white'}
		/>
	</svg>
	<svg
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="14"
		viewBox="0 0 24 14"
		class="animate-wave-2 mt-[5px] origin-bottom col-start-1 row-start-1"
	>
		<path
			d="M9 0H11V14H9V0Z"
			fill="currentColor"
			class={typeof fill === 'string' ? fill : fill[1] || 'icon-white'}
		/>
	</svg>
	<svg
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="14"
		viewBox="0 0 24 14"
		class="animate-wave-3 mt-[5px] origin-bottom col-start-1 row-start-1"
	>
		<path
			d="M13 0H15V14H13V0Z"
			fill="currentColor"
			class={typeof fill === 'string' ? fill : fill[2] || 'icon-white'}
		/>
	</svg>
	<svg
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="14"
		viewBox="0 0 24 14"
		class="animate-wave-4 mt-[5px] origin-bottom col-start-1 row-start-1"
	>
		<path
			d="M17 0H19V14H17V0Z"
			fill="currentColor"
			class={typeof fill === 'string' ? fill : fill[3] || 'icon-white'}
		/>
	</svg>
</div>
