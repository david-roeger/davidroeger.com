<script lang="ts">
	export let href: string;
	export let type: 'primary' | 'icon' | 'button' = 'primary';
	export let activePath: string | undefined = undefined;
	export let activeRegEx: RegExp | undefined = undefined;
	export let activeClass = '';
	export let role: string | undefined = undefined;

	let customClass = '';
	export { customClass as class };

	import { page } from '$app/stores';

	const primaryClass = 'px-4 py-2';
	const buttonClass = 'px-4 py-2 rounded-full';
	const iconClass = '';

	let variantClass = '';
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

	$: getActiveClass = () => {
		if ($page.error) {
			return '';
		}
		if (activePath && $page.url.pathname === activePath) {
			return activeClass;
		}
		if (activeRegEx && activeRegEx.exec($page.url.pathname)) {
			return activeClass;
		}
		return '';
	};
</script>

<a
	{role}
	sveltekit:prefetch
	{href}
	class="border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 transition-colors {variantClass} {customClass} {getActiveClass()}"
>
	<slot />
</a>
