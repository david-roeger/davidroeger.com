<script lang="ts">
	import { page } from '$app/stores';
	import Head from '$lib/Components/Head/Head.svelte';
	import Headline from '$lib/Components/Headline/Headline.svelte';
	import ContactForm from '$lib/Slices/ContactForm/ContactForm.svelte';
	import type { ActionData } from './$types';

	console.info('index: +page.svelte');

	export let form: ActionData;

	$: console.log('form', form);
	$: first = form && 'first' in form.values ? form.values.first : '';
	$: second = form && 'second' in form.values ? form.values.second : '';
	$: message = form ? form.message : 'No message';
</script>

<Head />

<section class="mb-32">
	<Headline containerClass="py-8 md:py-16">Welcome</Headline>
	<ContactForm variant="blue">
		<span slot="headline">Hallo</span>
	</ContactForm>

	<p />

	<p>Message: {message}</p>
	<form action="?/second" method="post">
		<input
			type="text"
			name="first"
			class="p-2 border border-mauve-12"
			bind:value={first}
		/>
		<input
			type="text"
			name="second"
			class="p-2 border border-mauve-12"
			bind:value={second}
		/>
		<button>Send</button>
	</form>
</section>
