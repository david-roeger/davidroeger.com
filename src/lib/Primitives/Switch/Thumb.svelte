<script lang="ts">
	let c = '';
	export { c as class };

	import { getContext } from 'svelte';
	import type { RootContext } from './types';

	const { id, disabled, checked }: RootContext = getContext('root');

	const computedId = `${id}-thumb`;
</script>

<span
	id={computedId}
	data-state={$checked ? 'checked' : 'unchecked'}
	data-disabled={disabled ? '' : undefined}
	class={c}
	style="display: block;"
>
	<slot />
</span>
