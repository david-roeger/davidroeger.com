<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { Counter } from '$lib/Components/Counter';
	import * as Accordion from '$lib/Primitives/Accordion';
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

	<Counter />
	<Accordion.Root type="single" value="" defaultValue="item-2" id="0">
		<Accordion.Item value="item-1"
			><Accordion.Header>
				<Accordion.Trigger>Header 1</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content>Content für 2</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="item-2">
			<Accordion.Header>
				<Accordion.Trigger>Header 2</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content>Content für 2</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="item-3">
			<Accordion.Header>
				<Accordion.Trigger>Header 3</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content>
				<p>Content für 3</p>
				<Accordion.Root type="single" value="" defaultValue="item-2-1" id="1">
					<Accordion.Item value="item-2-1"
						><Accordion.Header>
							<Accordion.Trigger>Header 2-1</Accordion.Trigger>
						</Accordion.Header>

						<Accordion.Content>Content für 2-2</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item value="item-2-2">
						<Accordion.Header>
							<Accordion.Trigger>Header 2-3</Accordion.Trigger>
						</Accordion.Header>

						<Accordion.Content>Content für 2-3</Accordion.Content>
					</Accordion.Item>
					<Accordion.Item value="item-2-3">
						<Accordion.Header>
							<Accordion.Trigger>Header 2-3</Accordion.Trigger>
						</Accordion.Header>
						<Accordion.Content>Content für 2-3</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</section>
