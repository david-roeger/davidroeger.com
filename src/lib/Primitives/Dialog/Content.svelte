<script lang="ts">
	let c = '';
	export { c as class };

	import { createFocusTrap, type Options } from 'focus-trap';

	export let focusTrapOptions: Options = {};

	import { getContext, onMount, tick } from 'svelte';
	import { derived, writable } from 'svelte/store';

	import type { RootContext } from './types';
	import { ticked } from '$utils/Store/ticked';

	const { open, id, trap, setClose }: RootContext = getContext('root');

	const tickedDataState = ticked(
		open,
		($open) => ($open ? 'open' : 'closed'),
		$open ? 'open' : 'closed',
		($open) => $open
	);

	let content: HTMLElement;
	let mounted = false;
	$: activateTrap($open);

	onMount(() => {
		mounted = true;
		activateTrap($open);
	});

	const activateTrap = async (state: boolean) => {
		if (state && !$trap && mounted) {
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
		data-state={$tickedDataState}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		id="{id}-content"
		aria-labelledby="{id}-title"
		aria-describedby="{id}-description"
		class="group/dr-ds-dialog {c}"
		bind:this={content}
		on:keydown
		on:keydown={handleKeyDown}
	>
		<slot />
	</div>
{/if}
