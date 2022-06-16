<script lang="ts">
	import * as Dialog from '$primitives/Dialog';
	export let title = '';

	export let trigger: string = '';
	export let triggerClass: string;
	export let triggerRounded: boolean = false;
	export let disabled = false;

	let disabledClass =
		'cursor-not-allowed !bg-white border-mauve-11 ring-mauve-11 text-mauve-11';

	let roundedClass = triggerRounded ? 'rounded-full' : '';

	export let description = '';
</script>

<Dialog.Root defaultOpen={false} on:openChange>
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
				<Dialog.Title>{title}</Dialog.Title>
			{/if}
			{#if description}
				<Dialog.Description>{description}</Dialog.Description>
			{/if}
			<slot />
			<Dialog.Close>Close</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
