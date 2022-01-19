<script lang="ts">
	let c = '';
	export { c as class };

	import { getContext } from 'svelte';
	import type { RootContext } from './types';
	import { convertValueToPercentage } from './utils';
	const { orientation, disabled, min, max, start, end, activeValues }: RootContext =
		getContext('root');

	let computedStart = '';
	let computedEnd = '';

	$: {
		const percentages = $activeValues.map((value) =>
			convertValueToPercentage(value.value, min, max)
		);
		const offsetStart = $activeValues.length > 1 ? Math.min(...percentages) : 0;
		const offsetEnd = 100 - Math.max(...percentages);
		computedStart = `${start}: ${offsetStart}%;`;
		computedEnd = `${end}: ${offsetEnd}%;`;
	}
</script>

<span
	style={`position: absolute; ${computedStart} ${computedEnd}`}
	class={c}
	data-disabled={disabled}
	data-orientation={orientation}
>
	<slot />
</span>
