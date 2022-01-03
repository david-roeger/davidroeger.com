<script lang="ts">
	let c = '';
	export { c as class };

	import { getContext } from 'svelte';
	import type { RootContext } from './types';
	const { id }: RootContext = getContext('root');
</script>

<h3 id={`${id}-title`} class={`${c}`}>
	<slot />
</h3>
