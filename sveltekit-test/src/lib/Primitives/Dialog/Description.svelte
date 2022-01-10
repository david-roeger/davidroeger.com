<script lang="ts">
	let c = '';
	export { c as class };

	import { getContext } from 'svelte';
	import type { RootContext } from './types';
	const { id }: RootContext = getContext('root');
</script>

<div id="{id}-description" class={c}>
	<slot />
</div>
