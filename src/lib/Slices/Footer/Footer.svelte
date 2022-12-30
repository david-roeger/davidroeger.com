<script lang="ts">
	import { building, version } from '$app/environment';

	let c = '';
	export { c as class };
</script>

<footer class={`border-t xl:max-w-7xl border-mauve-6 p-2 ${c}`}>
	<div>
		<p>Building: {building}</p>
		<p>Last updated at: {process.env.VITE_BUILD_TIME}</p>
		<p>Version: {version}</p>
	</div>
</footer>
