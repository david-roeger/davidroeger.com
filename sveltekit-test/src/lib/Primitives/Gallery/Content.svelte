<script lang="ts">
	let c;
	export { c as class };
	import { onMount } from 'svelte';
	let outer: HTMLDivElement;
	let inner: HTMLDivElement;
	onMount(() => {});
</script>

<div bind:this={outer} style="width: 100%" class="w-full overflow-y-auto">
	<div bind:this={inner} style="width: 100%" class="flex border-b h-96 last:border-r-0 ${c}">
		<slot />

		<!-- implement image galery with intersection observer-->
		<!-- https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API -->
		<!-- scroll by 80% container width on click -->
		<!-- outer and inner container check inner container against outer-->
		<!-- margins ? -->
		<!-- thresholds 4%? + 0, 1 maybe set max as 0.02, 0.98 -->

		<!-- https://codepen.io/aartyparty/pen/bGVzKjM?editors=1111 -->
		<!-- observe first and last item -->

		<!-- https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollBy -->

		<!-- hidden={!filteredProjects.includes(project)}
						aria-hidden={!filteredProjects.includes(project)} hide or remove?-->

		<!-- use blurhash?-->
		<!-- use vite imahge plugin?-->
		<div class="flex overflow-y-auto border-b h-96 last:border-r-0">
			<img
				class="border-r"
				src="https://images.unsplash.com/photo-1640693102313-9bae6ec69c3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
			/>
			<img
				class="border-r"
				src="https://images.unsplash.com/photo-1640693102313-9bae6ec69c3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
			/>
			<img
				class="border-r"
				src="https://images.unsplash.com/photo-1638913970961-1946e5ee65c4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3132&q=80"
			/>
			<img
				class="border-r"
				src="https://images.unsplash.com/photo-1638913970961-1946e5ee65c4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3132&q=80"
			/>
		</div>
	</div>
</div>
