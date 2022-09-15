<script lang="ts">
	console.info('contact: +page.svelte');

	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$lib/Components/Button/Button.svelte';
	import type { ActionData } from './$types';

	// this seems to be a bug right now
	// so we alwyays need to have all properties on the object
	// some weird union stuff?
	// https://github.com/sveltejs/kit/issues/6823
	export let form: ActionData;

	const email = (form?.values?.email ?? '') as string;
	const name = (form?.values?.name ?? '') as string;
	const message = (form?.values?.message ?? '') as string;

	const getValValidationClass = (
		value: string | undefined,
		state: string | undefined,
		successClass: string
	) => {
		if (!state || state === 'success') return '';
		if (value) return successClass;
		return 'to-red-5';
	};
</script>

<section class="mb-32">
	<p>contact me</p>
	{#if form?.state}<p class="error">{form.state}</p>{/if}
	{#if form?.id}<p class="error">{form.id}</p>{/if}

	<form method="POST" class="flex flex-col max-w-xs space-y-4 m-4">
		<input type="hidden" name="url" value={$page.url.toString()} />
		<div class="flex flex-col items-start">
			<label
				for="email"
				class="border-mauve-12 border border-b-0 text-xs group-focus-within:bg-mauve-12 group-focus-within:text-mauve-1 ring-mauve-12 group-focus-within:ring-1 px-4"
			>
				Mail
			</label>
			<input
				id="email"
				class="py-2 px-4 border-mauve-12 border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent {getValValidationClass(
					email,
					form?.state,
					'valid:to-green-5'
				)}"
				name="email"
				type="email"
				value={email}
			/>
			<p class="" />
		</div>

		<div class="flex flex-col items-start group">
			<label
				for="name"
				class="border-mauve-12 border border-b-0 text-xs group-focus-within:bg-mauve-12 group-focus-within:text-mauve-1 ring-mauve-12 group-focus-within:ring-1 px-4"
			>
				Name
			</label>
			<input
				id="name"
				class="py-2 px-4 border-mauve-12 border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent {getValValidationClass(
					name,
					form?.state,
					'valid:to-green-5'
				)}"
				name="name"
				type="text"
				value={name}
			/>
		</div>

		<div class="flex flex-col items-start group">
			<label
				for="message"
				class="border-mauve-12 border border-b-0 text-xs group-focus-within:bg-mauve-12 group-focus-within:text-mauve-1 ring-mauve-12 group-focus-within:ring-1 px-4"
			>
				Message
			</label>
			<textarea
				rows="5"
				name="message"
				id="message"
				class="py-2 px-4 border-mauve-12 border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent {getValValidationClass(
					message,
					form?.state,
					'valid:to-green-5'
				)}"
				value={message}
			/>
		</div>

		<Button type="submit" variant="rounded" class="bg-orange-5">
			Submit!
		</Button>
	</form>
</section>
