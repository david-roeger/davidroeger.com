<script lang="ts">
	logger.page('contact: +page.svelte');
	// ----------------------------------------------------------------

	import {Headline} from '$components/Headline';

	import {ContactForm} from '$slices/ContactForm';

	import { logger } from '$utils';
</script>

<section class="mb-32">
	<Headline containerClass="py-8 md:py-16">Welcome</Headline>
	<ContactForm variant="orange" />
</section>
