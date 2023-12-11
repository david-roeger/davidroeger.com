<script lang="ts">
	import { AnimatedEntry } from '$components/AnimatedEntry';

	export let as = 'li';
	let c = '';
	export { c as class };
</script>

<AnimatedEntry {as} class="border-b last:border-b-0 border-mauve-6 {c}">
	<slot />
</AnimatedEntry>
