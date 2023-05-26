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
		<p>Last updated at: {process.env.VITE_BUILD_TIME}</p>
		<p>Version: {version}</p>
	</div>
</footer>
