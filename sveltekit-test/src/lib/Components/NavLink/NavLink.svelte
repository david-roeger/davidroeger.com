<script lang="ts">
	export let href: string;
	export let type: 'primary' | 'icon' | 'button' = 'primary';
	export let activePath: string = undefined;
	export let activeRegEx: RegExp = undefined;
	export let activeClass = '';
	export let role: string = undefined;

	let customClass = '';
	export { customClass as class };

	import { page } from '$app/stores';

	const primaryClass = 'px-4 py-2';
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
	{role}
	sveltekit:prefetch
	{href}
	class="border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 {variantClass} {customClass} {(activePath !==
		undefined &&
		$page.url.pathname === activePath) ||
	(activeRegEx !== undefined && activeRegEx.exec($page.url.pathname))
		? activeClass
		: ''}"
>
	<slot />
</a>
