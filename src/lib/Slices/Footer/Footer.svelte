<script lang="ts">
	import { version } from '$app/environment';
	import { BeKind } from '../BeKind';
	import North from '$assets/Icons/24/north.svg?component';
	import { AccessibleIcon } from '$components/AccessibleIcon';
	import { onMount } from 'svelte';
	import { mapToRange } from '$utils';
	import BezierEasing from 'bezier-easing';

	let c = '';
	export { c as class };

	const handleClick = (
		event: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		}
	) => {
		document.body.scrollTop = 0;
		document.documentElement.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
		event.currentTarget.blur();
	};

	const baseEasing = BezierEasing(0.4, 0, 0.2, 1);
	const reversedEasing = BezierEasing(0.8, 0, 0.6, 1);

	function slideUp(
		_: HTMLElement,
		{ start = -42, end = 0, duration = 150, easing = baseEasing }
	) {
		return {
			duration,
			css: (t: number) => {
				const eased = easing(t);
				const mapped = mapToRange(eased, 0, 1, start, end);
				return `bottom: ${mapped}px;`;
			}
		};
	}

	// bttbutton handling
	let showBttButton = false;
	const handleScroll = () => {
		if (
			(document.body.scrollTop > 120 ||
				document.documentElement.scrollTop > 120) &&
			document.body.offsetHeight > window.innerHeight
		) {
			showBttButton = true;
			return;
		}
		showBttButton = false;
	};

	onMount(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
	});
</script>

<footer class="xl:max-w-7xl border-t border-mauve-6 {c}">
	<BeKind class="z-30" />
	<div class="p-2">
		<!-- svelte-ignore missing-declaration -->
		<p>Last updated at: {__BUILD_TIME__}</p>
		<p>Version: {version}</p>
		<!-- svelte-ignore missing-declaration -->
		<p>Hash: {__BUILD_HASH__}</p>
	</div>
</footer>

<div
	class="sticky bottom-0 left-0 z-30 p-2 overflow-hidden pointer-events-none"
>
	<button
		in:slideUp={{}}
		out:slideUp={{ easing: reversedEasing }}
		disabled={!showBttButton}
		aria-hidden={!showBttButton ? true : undefined}
		tabindex={showBttButton ? 0 : -1}
		on:click={handleClick}
		on:click
		type="button"
		class="{showBttButton
			? 'pointer-events-auto'
			: 'translate-y-[42px] pointer-events-none'} block p-1 text-xs transition-transform bg-white border rounded-full cursor-n-resize touch-manipulation focus:outline-none ring-mauve-12 focus:ring-1"
	>
		<AccessibleIcon label="Back to top">
			<North />
		</AccessibleIcon>
	</button>
</div>
