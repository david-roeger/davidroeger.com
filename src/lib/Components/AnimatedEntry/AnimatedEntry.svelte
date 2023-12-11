<script lang="ts">
	import IntersectionObserver from 'svelte-intersection-observer';

	export let delay = 100;
	let c = '';
	export { c as class };
	let element: HTMLElement;
	export let as = 'div';

	let initial = true;
	let intersecting = true;
	let timeout: NodeJS.Timeout;
</script>

<IntersectionObserver
	{element}
	once
	on:observe={(e) => {
		if (e.detail.isIntersecting) {
			timeout = setTimeout(() => {
				intersecting = true;
			}, delay);
		} else {
			clearTimeout(timeout);
			intersecting = false;
		}
		initial = false;
	}}
>
	<svelte:element
		this={as}
		bind:this={element}
		class="transition-[transform,opacity] transition-quart {intersecting
			? 'translate-y-0 opacity-100'
			: 'translate-y-12 opacity-0'} {c}"
	>
		<slot />
	</svelte:element>
</IntersectionObserver>
