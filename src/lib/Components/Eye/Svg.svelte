<script lang="ts">
	export let viewBox = { x: 80, y: 40 };
</script>

<svg
	width="0"
	height="0"
	viewBox="0 0 {viewBox.x} {viewBox.y}"
	class="w-full h-full m-auto"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<slot />
</svg>
