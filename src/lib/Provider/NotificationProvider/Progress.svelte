<script lang="ts">
	import * as Progress from '$primitives/Progress';
	import type { Tweened } from '$lib/Utils/Store/pausibleTween';

	export let min: number;
	export let max: number;
	export let value: Tweened<number>;

	let c = '';
	export { c as class };
</script>

<Progress.Root
	class={c}
	{min}
	{max}
	value={$value}
	getValueLabel={(value) => `Remaining: ${Math.round(value)}ms`}
>
	<Progress.Indicator class="bg-mauve-12 will-change-[width]" />
</Progress.Root>
