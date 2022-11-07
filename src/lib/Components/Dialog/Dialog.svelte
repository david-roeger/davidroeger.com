<script lang="ts">
	import * as Dialog from '$primitives/Dialog';
	import type { Writable } from 'svelte/store';

	export let trigger = '';
	export let triggerClass: string;
	export let triggerRounded = false;
	const roundedClass = triggerRounded ? 'rounded-full' : '';
	export let disabled = false;
	const disabledClass =
		'cursor-not-allowed !bg-white border-mauve-11 ring-mauve-11 text-mauve-11';

	export let title = '';
	export let titleClass = '';

	export let description = '';
	export let descriptionClass = '';

	export let close = true;
	export let closeClass = '';

	export let setClose: Writable<(() => void) | undefined> | undefined;
</script>

<Dialog.Root bind:setClose defaultOpen={false} on:openChange>
	<Dialog.Trigger
		{disabled}
		class={`border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 transition-colors px-4 py-2 ${roundedClass} ${triggerClass} ${
			disabled ? disabledClass : ''
		}`}
	>
		{trigger}
		<slot name="trigger" />
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed top-0 w-full h-full bg-mauve-12/50" />
		<Dialog.Content class="fixed top-0 bg-mauve-1">
			{#if title}
				<Dialog.Title class={titleClass}>{title}</Dialog.Title>
			{/if}
			{#if description}
				<Dialog.Description class={descriptionClass}>
					{description}
				</Dialog.Description>
			{/if}
			<slot />
			{#if close}
				<Dialog.Close class={closeClass}>Close</Dialog.Close>
			{/if}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
