<script lang="ts">
	export let href: string;
	export let type: 'primary' | 'icon' | 'button' = 'primary';
	export let activePath: string = undefined;
	export let activeRegEx: RegExp = undefined;
	export let activeClass = '';

	let customClass = '';
	export { customClass as class };

	import { page } from '$app/stores';

	const primaryClass = 'p-2';
	const buttonClass = 'px-4 py-2 rounded-full';
	const iconClass = '';

	let variantClass;
	switch (type) {
		case 'primary':
		default:
			variantClass = primaryClass;
			break;
		case 'icon':
			variantClass = iconClass;
			break;
		case 'button':
			variantClass = buttonClass;
			break;
	}
</script>

<a
	sveltekit:prefetch
	{href}
	class={`block m-2 border focus:outline-none ring-mauve-12 focus:ring-1 ${variantClass} ${customClass} ${
		(activePath !== undefined && $page.path === activePath) ||
		(activeRegEx !== undefined && activeRegEx.exec($page.path))
			? activeClass
			: ''
	}`}
>
	<slot />
</a>
