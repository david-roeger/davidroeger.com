<script lang="ts">
	export let tag = 'div';
	let c = '';
	export { c as class };
	import { replaceTag } from '$lib/Actions';
</script>

<div class={`border-b backdrop-blur-xl bg-white/[0.85] ${c}`} use:replaceTag={tag}>
	<slot />
</div>
