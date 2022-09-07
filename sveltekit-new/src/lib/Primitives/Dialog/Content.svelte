<script lang="ts">
	let c = '';
	export { c as class };

	import { getContext, tick } from 'svelte';
	import { derived } from 'svelte/store';

	import { createFocusTrap } from 'focus-trap';

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
		style="pointer-events: auto;"
		id="{id}-content"
		aria-labelledby="{id}-title"
		aria-describedby="{id}-description"
		class={c}
		bind:this={content}
		on:keydown={handleKeyDown}
	>
		<slot />
	</div>
{/if}
