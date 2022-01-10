<script lang="ts">
	let c = '';
	export { c as class };
	import { onMount, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { RootContext } from './types';
	const { id, container, step, computedStep, start, end, labelledby }: RootContext =
		getContext('root');

	let content: HTMLDivElement;

	onMount(() => {
		$container = content;
		let children = content.children;

		let first = children[0] as HTMLElement;
		let last = children[children.length - 1] as HTMLElement;

		createObserver(first, start);
		createObserver(last, end);

		$computedStep = content.getBoundingClientRect().width * step;
	});

	const createObserver = (element: HTMLElement, store: Writable<boolean>) => {
		let observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						store.set(true);
					} else {
						store.set(false);
					}
				});
			},
			{
				root: $container,
				rootMargin: '0px',
				threshold: 0.98
			}
		);
		observer.observe(element);
	};
</script>

<div
	role={labelledby ? 'region' : ''}
	aria-roledescription={labelledby ? 'galerypanel' : ''}
	aria-labelledby={labelledby}
	id="{id}-content"
	tabindex="0"
	bind:this={content}
	class={c}
	style="overflow-y: auto;"
>
	<slot />
</div>
