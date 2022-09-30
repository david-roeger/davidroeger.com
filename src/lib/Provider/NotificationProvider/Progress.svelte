<script lang="ts">
	import * as Progress from '$primitives/Progress';
	import type { Tweened } from '$lib/Utils/Store/pausibleTween';

	export let min: number;
	export let max: number;
	export let value: Tweened<number>;
</script>

<Progress.Root
	class="w-full h-0.5"
	{min}
	{max}
	value={$value}
	getValueLabel={(value) => `Remaining: ${value}ms`}
>
	<Progress.Indicator class="bg-mauve-12 will-change-[width]" />
</Progress.Root>
