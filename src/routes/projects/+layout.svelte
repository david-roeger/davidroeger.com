<script lang="ts">
	logger.page('projects: +layout.svelte');
	// ----------------------------------------------------------------

	import { Background } from '$components/Background';

	import { logger } from '$utils';
</script>

<Background
	center="hsla(146, 38%, 69%, 0.4)"
	outside="hsla(146, 38%, 69%, 0)"
/>

<slot />
