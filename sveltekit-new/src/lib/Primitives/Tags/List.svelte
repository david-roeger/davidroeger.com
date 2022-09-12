<script lang="ts">
	export let loop = true;
	export let direction: 'horizontal' | 'vertical' = 'horizontal';

	export let label: string;

	let c = '';
	export { c as class };

	import { getContext, onMount } from 'svelte';
	import type { RootContext } from './types';

	let root: HTMLElement;
	let triggerElements: HTMLButtonElement[] = [];

	const { id, activeValues }: RootContext = getContext('root');

	onMount(() => {
		triggerElements = Array.from(
			root.querySelectorAll(':scope > button[data-state]')
		);
		triggerElements = triggerElements.filter(
			(triggerElement) => !triggerElement.disabled
		);
	});

	const nextKey = direction === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
	const prevKey = direction === 'horizontal' ? 'ArrowRight' : 'ArrowDown';

	const handleKeyDown = (e: KeyboardEvent) => {
		let activeTriggerIndex = triggerElements.findIndex(
			(trigger) => trigger === document.activeElement
		);
		if (activeTriggerIndex != -1) {
			switch (e.key) {
				case nextKey:
					if (!loop && activeTriggerIndex === 0) return;

					activeTriggerIndex--;
					if (activeTriggerIndex < 0) {
						activeTriggerIndex = triggerElements.length - 1;
					}
					triggerElements[activeTriggerIndex].focus();
					e.preventDefault();
					e.stopPropagation();
					break;
				case prevKey:
					if (
						!loop &&
						activeTriggerIndex === triggerElements.length - 1
					)
						return;

					activeTriggerIndex++;
					if (activeTriggerIndex >= triggerElements.length) {
						activeTriggerIndex = 0;
					}
					triggerElements[activeTriggerIndex].focus();
					e.preventDefault();
					e.stopPropagation();
					break;
				case 'Home':
					triggerElements[0].focus();
					e.preventDefault();
					e.stopPropagation();
					break;
				case 'End':
					triggerElements[triggerElements.length - 1].focus();
					e.preventDefault();
					e.stopPropagation();
					break;
				default:
					break;
			}
		}
	};

	$: activeDescendant = $activeValues[$activeValues.length - 1]
		? `${id}-${$activeValues[$activeValues.length - 1]}-tag`
		: undefined;
</script>

<div
	tabindex="0"
	role="listbox"
	id="{id}-list"
	aria-label={label}
	aria-multiselectable="true"
	aria-activedescendant={activeDescendant}
	aria-orientation={direction}
	data-orientation={direction}
	class={c}
	bind:this={root}
	on:keydown={handleKeyDown}
>
	<slot />
</div>
