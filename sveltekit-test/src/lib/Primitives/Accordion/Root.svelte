<script lang="ts">
	export let type: 'single' | 'multiple';
	export let value: string | string[];
	export let defaultValue: string | string[];
	export let disabled: boolean = false;
	export let collapsible: boolean = false;

	export let id: string;
	let c = '';
	export { c as class };

	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import type { RootContext } from './types';

	const rootContext: RootContext = {
		id: id,
		type: type,
		disabled: disabled,
		collapsible: collapsible,
		activeValues: writable(Array.isArray(defaultValue) ? defaultValue : [defaultValue])
	};
	setContext('root', rootContext);
	const { activeValues } = rootContext;
	const dispatch = createEventDispatcher();
	function handleItem(e: CustomEvent<{ value: string }>) {
		/*
            set state
        */
		dispatch('valueChange', {
			value: value
		});
	}

	let root;
	let triggerElements: HTMLElement[] = [];
	onMount(() => {
		triggerElements = Array.from(root.querySelectorAll(':scope > * > * > [aria-expanded]'));
	});

	const handleKeyDown = (e: KeyboardEvent) => {
		let activeTriggerIndex = triggerElements.findIndex(
			(trigger) => trigger === document.activeElement
		);
		if (activeTriggerIndex != -1) {
			debugger;
			switch (e.key) {
				case 'ArrowUp':
					e.preventDefault();
					e.stopPropagation();
					activeTriggerIndex--;
					if (activeTriggerIndex < 0) {
						activeTriggerIndex = triggerElements.length - 1;
					}
					triggerElements[activeTriggerIndex].focus();
					break;
				case 'ArrowDown':
					e.preventDefault();
					e.stopPropagation();
					activeTriggerIndex++;
					if (activeTriggerIndex >= triggerElements.length) {
						activeTriggerIndex = 0;
					}
					triggerElements[activeTriggerIndex].focus();
					break;
				case 'Home':
					e.preventDefault();
					e.stopPropagation();
					triggerElements[0].focus();
					break;
				case 'End':
					e.preventDefault();
					e.stopPropagation();
					triggerElements[triggerElements.length - 1].focus();
					break;
				default:
					break;
			}
		}
	};
</script>

<div class={c} bind:this={root} on:keydown={handleKeyDown}>
	<!-- listen for on:item-->
	<slot />
</div>
