<script lang="ts">
	console.info('contact: +page.svelte');

	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$lib/Components/Button/Button.svelte';
	import type { ActionData } from './$types';

	// this seems to be a bug right now
	// so we alwyays need to have all properties on the object
	// some weird union stuff?
	// https://github.com/sveltejs/kit/issues/6823
	export let form: ActionData;

	$: name =
		form?.values?.name && typeof form.values.name === 'string'
			? form.values.name
			: '';
	$: email =
		form?.values?.email && typeof form.values.email === 'string'
			? form.values.email
			: '';
	$: tel =
		form?.values?.tel && typeof form.values.tel === 'string'
			? form.values.tel
			: '';
	$: message =
		form?.values?.message && typeof form.values.message === 'string'
			? form.values.message
			: '';

	const getValValidationClass = (
		value: string | undefined,
		state: string | undefined,
		classes: {
			successClass?: string;
			errorClass?: string;
			defaultClass?: string;
		},
		required = false
	) => {
		if (!state || state === 'success' || (!value && !required))
			return classes.defaultClass ?? '';
		if (value) return classes.successClass ?? '';
		return classes.errorClass ?? '';
	};

	const focusInvalid = (missing: ActionData['missing']) => {
		if (missing) {
			for (const [key, value] of Object.entries(missing)) {
				if (value) {
					const element = document.getElementsByName(key)[0];
					element?.focus();
					return;
				}
			}
		}
	};
</script>

<section class="mb-32">
	<p>contact me</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	<p>Test</p>
	{#if form?.state}<p class="error">{form.state}</p>{/if}
	{#if form?.id}<p class="error">{form.id}</p>{/if}
	{#if form?.values}<p class="error">{JSON.stringify(form.values)}</p>{/if}

	<p>{JSON.stringify(form?.state, undefined, 2)}</p>
	<form
		method="POST"
		use:enhance={({ form }) => {
			return async ({ result }) => {
				if (result.type === 'success') {
					form.reset();
				}
				if (result.type === 'invalid') {
					focusInvalid(result.data?.missing);
				}
				await applyAction(result);
			};
		}}
		class="flex flex-col max-w-xs space-y-4 m-4 text-mauve-12"
	>
		<input type="hidden" name="url" value={$page.url.toString()} />
		<div class="flex flex-col items-start group">
			<label
				for="name"
				class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1 {getValValidationClass(
					name,
					form?.state,
					{
						successClass: 'group-focus-within:bg-green-5',
						errorClass: 'group-focus-within:bg-red-5',
						defaultClass: 'group-focus-within:bg-orange-5'
					},
					true
				)}"
			>
				Name*
			</label>
			<input
				id="name"
				class="py-2 px-4 border-mauve-12 rounded-none border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent {getValValidationClass(
					name,
					form?.state,
					{ successClass: 'to-green-5', errorClass: 'to-red-5' },
					true
				)}"
				name="name"
				autocomplete="name"
				type="text"
				value={name}
			/>
			{#if form?.missing?.name}
				<p class="text-xs">Name is required</p>
			{/if}
		</div>
		<div class="flex flex-col items-start group">
			<label
				for="email"
				class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1 {getValValidationClass(
					email,
					form?.state,
					{
						successClass: 'group-focus-within:bg-green-5',
						errorClass: 'group-focus-within:bg-red-5',
						defaultClass: 'group-focus-within:bg-orange-5'
					},
					true
				)}"
			>
				E-Mail*
			</label>
			<input
				id="email"
				class="py-2 px-4 border-mauve-12 rounded-none border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent {getValValidationClass(
					email,
					form?.state,
					{ successClass: 'to-green-5', errorClass: 'to-red-5' },
					true
				)}"
				name="email"
				autocomplete="email"
				type="email"
				value={email}
			/>
			{#if form?.missing?.email}
				<p class="text-xs">E-Mail is required</p>
			{/if}
		</div>

		<div class="flex flex-col items-start group">
			<label
				for="tel"
				class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1 {getValValidationClass(
					tel,
					form?.state,
					{
						successClass: 'group-focus-within:bg-green-5',
						errorClass: 'group-focus-within:bg-red-5',
						defaultClass: 'group-focus-within:bg-orange-5'
					}
				)}"
			>
				Phone
			</label>
			<input
				id="tel"
				class="py-2 px-4 border-mauve-12 rounded-none border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent {getValValidationClass(
					tel,
					form?.state,
					{ successClass: 'to-green-5', errorClass: 'to-red-5' }
				)}"
				name="tel"
				autocomplete="tel"
				type="tel"
				value={tel}
			/>
		</div>

		<div class="flex flex-col items-start group">
			<label
				for="message"
				class="border-mauve-12 rounded-none border border-b-0 text-xs ring-mauve-12 group-focus-within:ring-1 px-4 py-1 {getValValidationClass(
					message,
					form?.state,
					{
						successClass: 'group-focus-within:bg-green-5',
						errorClass: 'group-focus-within:bg-red-5',
						defaultClass: 'group-focus-within:bg-orange-5'
					},
					true
				)}"
			>
				Message*
			</label>
			<textarea
				rows="5"
				name="message"
				id="message"
				class="py-2 px-4 border-mauve-12 rounded-none resize-none border w-full group-focus-within:outline-none ring-mauve-12 group-focus-within:ring-1 bg-gradient-to-r from-transparent {getValValidationClass(
					message,
					form?.state,
					{ successClass: 'to-green-5', errorClass: 'to-red-5' },
					true
				)}"
				value={message}
			/>
			{#if form?.missing?.message}
				<p class="text-xs">Message is required</p>
			{/if}
		</div>

		<Button type="submit" variant="rounded" class="bg-orange-5">
			Submit!
		</Button>
	</form>
</section>
