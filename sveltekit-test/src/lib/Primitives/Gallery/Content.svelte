<script lang="ts">
	let c = '';
	export { c as class };
	import { onMount, getContext } from 'svelte';
	import { spring } from 'svelte/motion';
	import type { Writable } from 'svelte/store';
	import type { RootContext } from './types';
	const { id, container, step, computedStep, start, end }: RootContext = getContext('root');

	let content: HTMLDivElement;

	/*

	const slider = document.querySelector('.parent');

	});


	*/

	let scrollLeft = spring(0, {
		stiffness: 0.1,
		damping: 0.25
	});

	onMount(() => {
		$container = content;
		let children = content.children;

		let first = children[0] as HTMLElement;
		let last = children[children.length - 1] as HTMLElement;

		createObserver(first, start);
		createObserver(last, end);

		$computedStep = content.getBoundingClientRect().width * step;

		let mouseDown = false;
		let startX;

		let startDragging = function (e: MouseEvent) {
			mouseDown = true;
			startX = e.pageX - content.offsetLeft;
			//scrollLeft = content.scrollLeft;
			scrollLeft = spring(content.scrollLeft, {
				stiffness: 0.1,
				damping: 1
			});
		};
		let stopDragging = function () {
			mouseDown = false;
		};

		content.addEventListener('mousemove', (e: MouseEvent) => {
			e.preventDefault();
			if (!mouseDown) {
				return;
			}
			const x = e.pageX - content.offsetLeft;
			const scroll = x - startX;
			$scrollLeft = $scrollLeft - scroll;
			//content.scrollLeft =
		});

		content.addEventListener('mousedown', startDragging, false);
		content.addEventListener('mouseup', stopDragging, false);
		content.addEventListener('mouseleave', stopDragging, false);
		// set intersection observer
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

	$: if (content) content.scrollLeft = $scrollLeft;
</script>

<div
	role="region"
	aria-roledescription={'galerypanel'}
	id={`${id}-content`}
	tabindex="0"
	bind:this={content}
	class={`${c}`}
	style="overflow-y: auto;"
>
	<slot />
</div>
