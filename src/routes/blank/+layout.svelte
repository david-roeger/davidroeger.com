<script lang="ts">
	logger.page('blank: +layout.svelte');
	// ----------------------------------------------------------------

	import Head from '$components/Head/Head.svelte';

	import { logger } from '$utils';
</script>

<Head />

<slot />
