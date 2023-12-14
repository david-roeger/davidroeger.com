<script lang="ts">
	export let center: string;
	export let outside: string;

	export let position: 'absolute' | 'fixed' = 'fixed';
</script>

<div
	class="{position} pointer-events-none bottom-0 top-0 -z-10 h-full w-full xl:max-w-7xl"
	style="background: radial-gradient(50% 50% at 50% 50%, {center}, {outside} 100%);"
/>
