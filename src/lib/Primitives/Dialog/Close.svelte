<script lang="ts">
	let c = '';
	export { c as class };
	let t = '';
	export { t as type };
	import { getContext } from 'svelte';
	import type { RootContext } from './types';
	import { buttonType } from '$actions';

	const { setClose }: RootContext = getContext('root');
</script>

<button
	on:click
	on:click={() => {
		if ($setClose) $setClose();
	}}
	class={c}
	use:buttonType={t}
	{...$$restProps}
>
	<slot />
</button>
