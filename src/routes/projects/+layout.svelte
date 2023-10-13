<script lang="ts">
	logger.page('projects: +layout.svelte');
	// ----------------------------------------------------------------

	import { Background } from '$components/Background';

	import { logger } from '$utils/logger';
</script>

<Background
	center="hsl(var(--drds-green-5) / 0.4)"
	outside="hsl(var(--drds-green-5) / 0)"
/>

<slot />
