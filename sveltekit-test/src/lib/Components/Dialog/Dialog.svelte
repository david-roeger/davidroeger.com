<script lang="ts">
	import * as Dialog from '$primitives/Dialog';
	export let title = '';
	export let trigger: string;
	export let description = '';
</script>

<Dialog.Root defaultOpen={false} on:openChange>
	<Dialog.Trigger>{trigger}</Dialog.Trigger>
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
