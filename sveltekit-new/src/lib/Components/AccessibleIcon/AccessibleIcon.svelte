<script lang="ts">
	export let label: string;
	import { onMount } from 'svelte';
	import * as VisuallyHidden from '$primitives/VisuallyHidden';

	let root: HTMLSpanElement;
	onMount(() => {
		if (root) {
			const svgs = Array.from(root.querySelectorAll('svg'));
			if (svgs.length) {
				svgs.forEach((svg) => {
					svg.setAttribute('aria-hidden', 'true');
					svg.setAttribute('focusable', 'false');
				});
			}
		}
	});
</script>

<span bind:this={root} class="contents">
	<slot />
	<VisuallyHidden.Root>{label}</VisuallyHidden.Root>
</span>
