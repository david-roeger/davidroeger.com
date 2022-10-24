<script lang="ts">
	export let center: string;
	export let outside: string;

	export let position: 'absolute' | 'fixed' = 'fixed';
</script>

<div
	class="{position} top-0 bottom-0 w-full h-full pointer-events-none xl:max-w-7xl -z-10"
	style="background: radial-gradient(50% 50% at 50% 50%, {center}, {outside} 100%);"
/>
