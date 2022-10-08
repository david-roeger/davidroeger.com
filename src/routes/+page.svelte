<script lang="ts">
	import { displace } from '$actions';
	import { applyAction, enhance } from '$app/forms';
	import Head from '$lib/Components/Head/Head.svelte';
	import Headline from '$lib/Components/Headline/Headline.svelte';
	import ContactForm from '$lib/Slices/ContactForm/ContactForm.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import { writable } from 'svelte/store';
	import type { ActionData } from './$types';

	console.info('index: +page.svelte');

	let defaultForm: ActionData;
	export { defaultForm as form };

	let form = writable<ActionData | undefined>(undefined);

	const updateForm = (data: ActionData) => {
		if (data && data.defaultForm) {
			form.set(data);
		}
	};
	$: updateForm(defaultForm);

	$: first =
		$form && $form.defaultForm && 'first' in $form.defaultForm.values
			? $form.defaultForm.values.first
			: '';
	$: second =
		$form && $form.defaultForm && 'second' in $form.defaultForm.values
			? $form.defaultForm.values.second
			: '';
	$: message =
		$form && $form.defaultForm ? $form.defaultForm.message : 'No message';

	async function handleSubmit(
		e: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		const target = e.currentTarget;

		if (e.target) {
			// TODO: add delay handling
			const data = new FormData(target);

			const response = await fetch(target.action, {
				method: 'POST',
				body: data
			});

			const result: ActionResult = await response.json();
			console.log(target, result);

			if (result.type === 'success') {
				target.reset();
			}

			await applyAction(result);
		}
	}
</script>

<Head />

<section class="mb-32">
	<Headline containerClass="py-8 md:py-16">Welcome</Headline>
	<ContactForm variant="blue">
		<span slot="headline">Hallo</span>
	</ContactForm>

	<p />

	<p>Message: {message}</p>
	<form
		action="?/second"
		method="post"
		on:submit|preventDefault={handleSubmit}
	>
		<input
			type="text"
			name="first"
			class="p-2 border border-mauve-12"
			value={first}
		/>
		<input
			type="text"
			name="second"
			class="p-2 border border-mauve-12"
			value={second}
		/>
		<button>Send</button>
	</form>

	<h1 class="text-12xl">
		<span class="break-all">DAVID_ROEGER</span>
	</h1>
	<h2 class="text-8xl">
		<span class="break-all" use:displace>PROJECTS</span>
		<span class="break-all" use:displace>ABOUT</span>
		<span class="break-all" use:displace>SAY HI</span>
	</h2>
</section>
