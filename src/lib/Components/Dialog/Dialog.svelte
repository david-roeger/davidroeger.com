<script lang="ts">
	import AccessibleIcon from '$components/AccessibleIcon/AccessibleIcon.svelte';
	import * as Dialog from '$primitives/Dialog';
	import type { Writable } from 'svelte/store';
	import Close from '$assets/Icons/24/close.svg?component';

	export let trigger = '';
	export let triggerClass: string;
	export let triggerRounded = false;
	const roundedClass = triggerRounded ? 'rounded-full' : '';
	export let disabled = false;
	const disabledClass =
		'cursor-not-allowed !bg-white border-mauve-11 ring-mauve-11 text-mauve-11';

	export let contentContainerClass = 'fixed bottom-0 bg-mauve-1';
	export let contentClass = '';

	export let title = '';
	export let titleClass = '';

	export let description = '';
	export let descriptionClass = '';

	export let close = true;

	export let setClose: Writable<(() => void) | undefined> | undefined =
		undefined;
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
		<Dialog.Overlay
			class="fixed top-0 w-full h-full opacity-0 data-[state=open]:opacity-100 transition-opacity bg-mauve-12/50"
		/>
		<Dialog.Content class={contentContainerClass}>
			<div class="relative">
				<div class={contentClass}>
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
						<Dialog.Close
							class="focus:outline-none ring-mauve-12 focus:ring-1"
						>
							Close
						</Dialog.Close>
					{/if}
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
