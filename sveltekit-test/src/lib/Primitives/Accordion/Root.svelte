<script lang="ts">
	export let type: 'single' | 'multiple';
	export let defaultValue: string | string[];
	export let id: string;

	export const disabled: boolean = false;
	export const collapsible: boolean = false;

	let c = '';
	export { c as class };

	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import type { RootContext } from './types';

	import { createFocusTrap } from 'focus-trap';
	import type { FocusTrap } from 'focus-trap';

	const rootContext: RootContext = {
		id: id,
		disabled: disabled,
		activeValues: writable(Array.isArray(defaultValue) ? defaultValue : [defaultValue]),
		setAccordion: writable(undefined)
	};
	setContext('root', rootContext);
	const { activeValues, setAccordion } = rootContext;
	const dispatch = createEventDispatcher<{ valueChange: { value: string | string[] } }>();

	$setAccordion = (value: string, active: boolean) => {
		if (type === 'single') {
			if (active) {
				if (collapsible) $activeValues = [];
				return;
			}
			$activeValues = [value];
			return;
		}

		const length = $activeValues.length;
		if (active) {
			if (length > 1) {
				$activeValues = $activeValues.filter((activeValue) => activeValue !== value);
				return;
			}
			if (collapsible) $activeValues = [];
			return;
		}
		$activeValues = [...$activeValues, value];
		return;
	};

	$: {
		const returnValue =
			!Array.isArray(defaultValue) && $activeValues.length < 2
				? $activeValues.join('')
				: $activeValues;
		dispatch('valueChange', {
			value: returnValue
		});
	}

	let root: HTMLElement;
	let trap: FocusTrap | undefined;
	let triggerElements: HTMLElement[] = [];
	onMount(() => {
		triggerElements = Array.from(root.querySelectorAll(':scope > * > * > [aria-expanded]'));
		trap = createFocusTrap(root);
	});

	const handleKeyDown = (e: KeyboardEvent) => {
		let activeTriggerIndex = triggerElements.findIndex(
			(trigger) => trigger === document.activeElement
		);
		if (activeTriggerIndex != -1) {
			switch (e.key) {
				case 'ArrowUp':
					activeTriggerIndex--;
					if (activeTriggerIndex < 0) {
						activeTriggerIndex = triggerElements.length - 1;
					}
					triggerElements[activeTriggerIndex].focus();
					e.preventDefault();
					e.stopPropagation();
					break;
				case 'ArrowDown':
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

	const handleClick = () => {
		if (trap) trap.activate();
	};
</script>

<div class={`focus:border-2 border-black ${c}`} bind:this={root} on:keydown={handleKeyDown}>
	<slot />
</div>
<button on:click={handleClick} class="focus:border-2 border-black">activate Trap</button>
