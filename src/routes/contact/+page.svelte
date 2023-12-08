<script lang="ts">
	logger.page('contact: +page.svelte');
	// ----------------------------------------------------------------

	import { Displace } from '$components/Displace';
	import { Headline } from '$components/Headline';

	import { ContactForm } from '$slices/ContactForm';

	import { logger } from '$utils/logger';
</script>

<section class="mb-32">
	<Headline containerClass="py-8 md:py-16">
		<span aria-hidden="true" class="select-none">::</span>
		Welcome
	</Headline>
	<ContactForm variant="orange" />
</section>
