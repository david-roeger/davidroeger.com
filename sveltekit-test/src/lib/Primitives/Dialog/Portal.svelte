<script lang="ts">
	let c = '';
	export { c as class };
	export const target: HTMLElement | string = '#portal';
	console.log(target);
	import { portal } from '$actions';
</script>

<div class={c} use:portal={target}>
	<slot />
</div>
