<script lang="ts">
	import Head from '$lib/Components/Head/Head.svelte';
	import Headline from '$lib/Components/Headline/Headline.svelte';
	import ContactForm from '$lib/Slices/ContactForm/ContactForm.svelte';

	console.info('index: +page.svelte');
</script>

<Head />

<section class="mb-32">
	<Headline containerClass="py-8 md:py-16">Welcome</Headline>
	<ContactForm
		highlightClass="bg-purple-5"
		labelDefaultClass="group-focus-within:bg-purple-5"
	>
		<span slot="headline">Hallo</span>
	</ContactForm>
</section>
