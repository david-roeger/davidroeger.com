<script lang="ts">
	let c = '';
	export { c as class };

	import { getContext } from 'svelte';
	import type { RootContext } from './types';
	const { min, max, value }: RootContext = getContext('root');
</script>

<div
	style="width: {$value}%; height: 100%; transform-origin: left;"
	class={c}
	data-min={min}
	data-max={max}
	data-value={$value}
>
	<slot />
</div>
