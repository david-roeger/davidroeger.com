<script lang="ts">
	let c = '';
	export { c as class };

	import { getContext } from 'svelte';
	import type { RootContext } from './types';
	const { orientation, disabled }: RootContext = getContext('root');
</script>

<span
	style={`position: relative; flex-grow: 1;`}
	class={c}
	data-disabled={disabled}
	data-orientation={orientation}
>
	<slot />
</span>
