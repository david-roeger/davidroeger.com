<script lang="ts">
	console.info('projects/(ssr): +layout.svelte');
	import { Background } from '$components/Background';
</script>

<Background
	center="hsla(146, 38%, 69%, 0.4)"
	outside="hsla(146, 38%, 69%, 0)"
/>

<slot />
