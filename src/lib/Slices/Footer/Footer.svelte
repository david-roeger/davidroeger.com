<script lang="ts">
	import { building, version } from '$app/environment';
	import { BeKind } from '../BeKind';

	let c = '';
	export { c as class };
</script>

<footer class="xl:max-w-7xl border-t border-mauve-6 {c}">
	<BeKind class="z-30" />
	<div class="p-2">
		<p>Building: {building}</p>
		<!-- svelte-ignore missing-declaration -->
		<p>Last updated at: {__BUILD_TIME__}</p>
		<p>Version: {version}</p>
		<p>hi luca</p>
	</div>
</footer>
