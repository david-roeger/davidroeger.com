<script lang="ts">
	let c = '';
	export { c as class };

	import { getContext, onMount, tick } from 'svelte';
	import { derived } from 'svelte/store';

	import { createFocusTrap } from 'focus-trap';

	import type { RootContext, Options } from './types';
	import { auto } from '@popperjs/core';

	export let placement: Options['placement'] = 'auto';
	export let strategy: Options['strategy'] = 'absolute';
	export let offset: [number, number] = [0, 0];

	let options: Options = {
		placement: placement,
		strategy: strategy,
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: offset
				}
			},
			{
				name: 'preventOverflow',
				options: {
					mainAxis: false // true by default
				}
			}
		]
	};

	const { open, id, trap, setClose, contentElement, popperOptions }: RootContext =
		getContext('root');

	$popperOptions = options;
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
	data-state={$dataState}
	role="dialog"
	aria-modal="true"
	tabindex="-1"
	style="pointer-events: auto; position: absolute"
	id="{id}-content"
	aria-labelledby="{id}-title"
	aria-describedby="{id}-description"
	class={`${c} ${$open ? 'visible opacity-100' : 'invisible opacity-0'}`}
	bind:this={content}
	on:keydown={handleKeyDown}
	aria-hidden={!$open}
>
	<slot />
</div>
