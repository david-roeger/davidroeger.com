<script lang="ts">
	import { browser, prerendering } from '$app/env';

	let c = '';
	export { c as class };

	console.log(browser);
	console.log('pre', prerendering);
</script>

<footer class={`border-t xl:max-w-7xl border-mauve-6 p-2 ${c}`}>
	<div>
		<p>Prerendering: {prerendering}</p>
		<p>Last updated at: {process.env.VITE_BUILD_TIME}</p>
	</div>
</footer>
