<script lang="ts">
	logger.page('blank: +layout.svelte');
	// ----------------------------------------------------------------

	import { Head } from '$components/Head';

	import { logger } from '$utils/logger';
</script>

<Head />

<slot />
