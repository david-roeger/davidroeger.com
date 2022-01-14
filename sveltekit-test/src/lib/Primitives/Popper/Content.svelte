<script lang="ts">
	let c = '';
	export { c as class };

	import { getContext, onMount, tick } from 'svelte';
	import { derived } from 'svelte/store';

	import { createFocusTrap } from 'focus-trap';
	import { clickOutside } from '$lib/Actions';

	import type { RootContext, Options } from './types';

	export let options: Options = {
		placement: 'auto',
		strategy: 'absolute'
	};

	const { open, id, trap, setClose, contentElement }: RootContext = getContext('root');

	const dataState = derived(open, ($open) => ($open ? 'open' : 'closed'));

	let content: HTMLElement;
	$: activateTrap($open);

	const activateTrap = async (state: boolean) => {
		if (state && !$trap) {
			await tick();
			$trap = createFocusTrap(content, {
				allowOutsideClick: true,
				escapeDeactivates: false,
				fallbackFocus: content
			});
			$trap.activate();
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			if ($setClose) $setClose();
			e.preventDefault();
			e.stopPropagation();
		}
	};

	onMount(() => {
		$contentElement = content;
	});
</script>

<div
	use:clickOutside={() => {
		if ($setClose) $setClose();
	}}
	data-state={$dataState}
	role="dialog"
	aria-modal="true"
	tabindex="-1"
	style="pointer-events: auto;"
	id="{id}-content"
	aria-labelledby="{id}-title"
	aria-describedby="{id}-description"
	class={c}
	bind:this={content}
	on:keydown={handleKeyDown}
	hidden={!$open}
	aria-hidden={!$open}
>
	<slot />
</div>
