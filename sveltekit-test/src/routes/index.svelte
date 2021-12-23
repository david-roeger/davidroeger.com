<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import * as Dialog from '$primitives/Dialog';
</script>

<svelte:head>
	<title>David Roeger Web</title>
</svelte:head>

<section>
	<h1>
		<div class="welcome">
			<picture>
				<source srcset="svelte-welcome.webp" type="image/webp" />
				<img src="svelte-welcome.png" alt="Welcome" />
			</picture>
		</div>

		to your new<br />SvelteKit app
	</h1>

	<h2 class="text-mauve-9">
		try editing <strong>src/routes/index.svelte</strong>
	</h2>
	<div class="bg-blue-5 h-[500px]" />
	<Dialog.Root defaultOpen={false} id="0">
		<Dialog.Trigger>Hallo</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Overlay class="fixed top-0 w-full h-full bg-mauve-12/50" />
			<Dialog.Content class="fixed top-0 bg-mauve-1">
				<Dialog.Title>Title 1</Dialog.Title>
				<Dialog.Description>Description 1</Dialog.Description>
				<Dialog.Close>Close</Dialog.Close>
				<Dialog.Root defaultOpen={false} id="0">
					<Dialog.Trigger>Dialog 2</Dialog.Trigger>
					<Dialog.Portal>
						<Dialog.Overlay class="fixed top-0 w-full h-full bg-mauve-12/50" />
						<Dialog.Content class="fixed top-0 bg-mauve-1">
							<Dialog.Title>Title 2</Dialog.Title>
							<Dialog.Description>Description 2</Dialog.Description>
							<Dialog.Close>Close</Dialog.Close>
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</section>
