<script lang="ts">
	export let tag = 'div';
	let c = '';
	export { c as class };
	import { replaceTag } from '$lib/Actions';
</script>

<div class={`border-b bg-white/60 backdrop-blur-xl ${c}`} use:replaceTag={tag}>
	<slot />
</div>
