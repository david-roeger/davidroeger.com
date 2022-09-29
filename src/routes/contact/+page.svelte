<script lang="ts">
	import Headline from '$lib/Components/Headline/Headline.svelte';
	import ContactForm from '$lib/Slices/ContactForm/ContactForm.svelte';

	console.info('contact: +page.svelte');
</script>

<section class="mb-32">
	<Headline containerClass="py-8 md:py-16">Welcome</Headline>
	<ContactForm />
</section>
