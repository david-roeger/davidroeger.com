<script context="module" lang="ts">
	export const prerender = false;
</script>

<script lang="ts">
	import * as Tabs from '$primitives/Tabs';
	import * as Dialog from '$primitives/Dialog';
	import * as Accordion from '$primitives/Accordion';

	import Logo from '$components/Logo/Logo.svelte';
	import AccessibleIcon from '$components/AccessibleIcon/AccessibleIcon.svelte';

	let content = [
		{ value: '1' },
		{ value: '2', disabled: true },
		{ value: '3' },
		{ value: '4' },
		{ value: '5' },
		{ value: '6' },
		{ value: '7' },
		{ value: '8' },
		{ value: '9' }
	];
	const d = content[0].value;
	let acc = d;
</script>

<section>
	Learn more about me -> or look at some stuff I´ve built downArow
	<Dialog.Root defaultOpen={false} on:openChange={(e) => console.log(e.detail.open)}>
		<Dialog.Trigger>Hallo</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Overlay class="fixed top-0 w-full h-full bg-mauve-12/50" />
			<Dialog.Content class="fixed top-0 bg-mauve-1">
				<Dialog.Title>Title 1</Dialog.Title>
				<Dialog.Description>Description 1</Dialog.Description>
				<Dialog.Close>Close</Dialog.Close>
				<Dialog.Root defaultOpen={false}>
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
	<Tabs.Root
		defaultValue={d}
		activationMode="manual"
		on:valueChange={({ detail }) => (acc = detail.value)}
		class="m-2 border"
	>
		<Tabs.List ariaLabel="trigger list" class="flex p-2 space-x-2 overflow-x-auto ">
			{#each content as { value, disabled }}
				<Tabs.Trigger
					disabled={disabled ? true : false}
					class="{acc === value
						? 'bg-purple-5'
						: 'bg-white'} p-2 border border-mauve-6 focus:outline-none ring-mauve-12 focus:ring-1 disabled:text-mauve-7 disabled:border-mauve-6"
					{value}>Trigger {value}</Tabs.Trigger
				>
			{/each}
		</Tabs.List>
		{#each content as { value }}
			<Tabs.Content
				class="p-2 m-2 mt-0 border border-mauve-6 focus:outline-none ring-mauve-12 focus:ring-1"
				{value}>Content {value}</Tabs.Content
			>
		{/each}
	</Tabs.Root>

	<Accordion.Root type="multiple" defaultValue="2" class="m-2 border border-mauve-6">
		{#each content as { value, disabled }}
			<Accordion.Item {value} disabled={disabled ? true : false} class="m-2">
				<Accordion.Header>
					<Accordion.Trigger
						class="p-2 border border-mauve-6 focus:outline-none ring-mauve-12 focus:ring-1 disabled:text-mauve-7 disabled:border-mauve-6"
						>Trigger {value}</Accordion.Trigger
					>
				</Accordion.Header>
				<Accordion.Content
					class="p-2 border border-mauve-6 focus:outline-none ring-mauve-12 focus:ring-1 disabled:text-mauve-7 disabled:border-mauve-6"
					>Content {value}</Accordion.Content
				>
			</Accordion.Item>
		{/each}
	</Accordion.Root>

	<AccessibleIcon label="this is a hidden label"><Logo /></AccessibleIcon>
	<div class="bg-blue-5 h-[500px]" />
</section>
