<script lang="ts">
	let c = '';
	export { c as class };

	import { createFocusTrap, type Options } from 'focus-trap';

	export let focusTrapOptions: Options = {};

	import { getContext, tick } from 'svelte';
	import { derived } from 'svelte/store';

	import type { RootContext } from './types';

	const { open, id, trap, setClose }: RootContext = getContext('root');

	const dataState = derived(open, ($open) => ($open ? 'open' : 'closed'));

	let content: HTMLElement;
	$: activateTrap($open);

	const activateTrap = async (state: boolean) => {
		if (state && !$trap) {
			await tick();
			$trap = createFocusTrap(content, {
				allowOutsideClick: true,
				escapeDeactivates: false,
				fallbackFocus: content,
				...focusTrapOptions
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
</script>

{#if $open}
	<div
		data-state={$dataState}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		id="{id}-content"
		aria-labelledby="{id}-title"
		aria-describedby="{id}-description"
		class={c}
		bind:this={content}
		on:keydown
		on:keydown={handleKeyDown}
	>
		<slot />
	</div>
{/if}
