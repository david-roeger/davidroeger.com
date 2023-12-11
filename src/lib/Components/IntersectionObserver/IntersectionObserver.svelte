<script context="module">
	let id = 0;
</script>

<script lang="ts">
	/**
	 * The HTML Element to observe.
	 */
	export let element: HTMLElement;

	/**
	 * Set to `true` to unobserve the element
	 * after it intersects the viewport.
	 */
	export let once = false;

	/**
	 * `true` if the observed element
	 * is intersecting the viewport.
	 */
	export let intersecting = false;

	/**
	 * Specify the containing element.
	 * Defaults to the browser viewport.
	 */
	export let root: HTMLElement;

	/** Margin offset of the containing element. */
	export let rootMargin = '0px';

	/**
	 * Percentage of element visibility to trigger an event.
	 * Value must be between 0 and 1.
	 */
	export let threshold = 0;

	/**
	 * Observed element metadata.
	 */
	export let entry: IntersectionObserverEntry;

	/**
	 * `IntersectionObserver` instance.
	 */
	export let observer: IntersectionObserver | undefined;

	import { tick, createEventDispatcher, afterUpdate, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	let prevRootMargin: string;
	let prevElement: HTMLElement | undefined;

	const initialize = () => {
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((_entry) => {
					entry = _entry;
					intersecting = _entry.isIntersecting;
				});
			},
			{ root, rootMargin, threshold }
		);
	};

	onMount(() => {
		initialize();

		return () => {
			if (observer) {
				observer.disconnect();
				observer = undefined;
			}
		};
	});

	afterUpdate(async () => {
		if (entry !== undefined) {
			dispatch('observe', entry);

			if (entry.isIntersecting) {
				dispatch('intersect', entry);

				if (once) observer.unobserve(element);
			}
		}

		await tick();

		if (element !== undefined && element !== prevElement) {
			observer.observe(element);

			if (prevElement !== undefined) observer.unobserve(prevElement);
			prevElement = element;
		}

		if (prevRootMargin && rootMargin !== prevRootMargin) {
			observer.disconnect();
			prevElement = undefined;
			initialize();
		}

		prevRootMargin = rootMargin;
	});
</script>

<slot {intersecting} {entry} {observer} />
