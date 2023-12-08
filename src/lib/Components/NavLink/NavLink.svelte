<script lang="ts">
	export let href: string;
	export let form: 'primary' | 'icon' | 'button' = 'primary';
	export let variant: Colors = 'default';
	export let activePath: string | undefined = undefined;
	export let activeRegEx: RegExp | undefined = undefined;
	export let role: string | undefined = undefined;

	let customClass = '';
	export { customClass as class };

	import { page } from '$app/stores';
	import type { Colors } from '$utils/colors';
	import { derived } from 'svelte/store';
	import { LINK_COLOR_CLASSES } from './constants';

	const primaryClass = 'px-4 py-2';
	const buttonClass = 'px-4 py-2 rounded-full';
	const iconClass = '';

	let formClass = '';
	switch (form) {
		case 'primary':
		default:
			formClass = primaryClass;
			break;
		case 'icon':
			formClass = iconClass;
			break;
		case 'button':
			formClass = buttonClass;
			break;
	}

	const currentPage = derived([page], ([$page]) => {
		if ($page.error) {
			return false;
		}
		if (activePath && $page.url.pathname === activePath) {
			return true;
		}
		if (activeRegEx && activeRegEx.exec($page.url.pathname)) {
			return true;
		}
		return false;
	});
</script>

<a
	{role}
	{href}
	aria-current={$currentPage ? 'page' : undefined}
	class="border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 transition-colors {formClass} {LINK_COLOR_CLASSES[
		variant
	].default} {customClass} "
>
	<slot />
</a>
