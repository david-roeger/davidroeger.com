<script context="module">
	let id = 0;
</script>

<script lang="ts">
	export let defaultValue: string;
	export let name: string;

	export let loop = true;
	export let labelledby: string;

	let orient: 'horizontal' | 'vertical' = 'horizontal';
	export { orient as orientation };
	let mode: 'automatic' | 'manual' = 'automatic';
	export { mode as activationMode };

	let req = false;
	export { req as required };

	let c = '';
	export { c as class };

	import { setContext, onMount } from 'svelte';

	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import type { RootContext } from './types';

	id++;
	const rootContext: RootContext = {
		id: `drds-radiogroup-${id.toString()}`,
		name: name,
		activationMode: mode,
		orientation: orient,
		required: req,
		activeValue: writable(defaultValue),
		setRadio: writable(undefined)
	};
	setContext('root', rootContext);

	const { activeValue, setRadio, orientation, activationMode } = rootContext;

	$setRadio = (value: string) => {
		if ($activeValue !== value) {
			$activeValue = value;
		}
	};

	const dispatch = createEventDispatcher<{ valueChange: { value: string } }>();
	$: dispatch('valueChange', {
		value: $activeValue
	});

	let root: HTMLElement;
	let triggerElements: HTMLButtonElement[] = [];

	onMount(() => {
		triggerElements = Array.from(root.querySelectorAll(':scope button[data-state]'));
		triggerElements = triggerElements.filter((triggerElement) => !triggerElement.disabled);
	});

	const nextKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
	const prevKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';

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
					if (activationMode === 'automatic') triggerElements[activeTriggerIndex].click();

					e.preventDefault();
					e.stopPropagation();
					break;
				case prevKey:
					if (!loop && activeTriggerIndex === triggerElements.length - 1) return;

					activeTriggerIndex++;
					if (activeTriggerIndex >= triggerElements.length) {
						activeTriggerIndex = 0;
					}

					triggerElements[activeTriggerIndex].focus();
					if (activationMode === 'automatic') triggerElements[activeTriggerIndex].click();
					e.preventDefault();
					e.stopPropagation();
					break;
				case 'Home':
					triggerElements[0].focus();
					if (activationMode === 'automatic') triggerElements[activeTriggerIndex].click();
					e.preventDefault();
					e.stopPropagation();
					break;
				case 'End':
					triggerElements[triggerElements.length - 1].focus();
					if (activationMode === 'automatic') triggerElements[activeTriggerIndex].click();
					e.preventDefault();
					e.stopPropagation();
					break;
				default:
					break;
			}
		}
	};
</script>

<div
	role="radiogroup"
	aria-labelledby={labelledby}
	aria-orientation={orientation}
	data-orientation={orientation}
	class={c}
	bind:this={root}
	on:keydown={handleKeyDown}
>
	<slot />
</div>
