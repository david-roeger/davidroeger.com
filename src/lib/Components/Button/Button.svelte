<script lang="ts">
	import { buttonType } from '$actions';
	import type { Colors } from '$utils/colors';
	import { BUTTON_COLOR_CLASSES } from './constants';

	export let form: 'primary' | 'icon' | 'rounded' | 'custom' = 'primary';
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let variant: Colors = 'default';
	export let filled = false;
	export let role: string | undefined = undefined;
	export let disabled: boolean | undefined = undefined;

	let customClass = '';
	export { customClass as class };
	export let style = '';

	const primaryClass = 'px-4 py-2';
	const roundedClass = 'px-4 py-2 rounded-full';
	const iconClass = '';

	let disabledClass =
		'disabled:cursor-not-allowed disabled:!bg-white disabled:border-mauve-11 disabled:ring-mauve-11 disabled:text-mauve-11';

	let formClass = '';
	switch (form) {
		case 'primary':
		default:
			formClass = primaryClass;
			break;
		case 'icon':
			formClass = iconClass;
			break;
		case 'rounded':
			formClass = roundedClass;
			break;
		case 'custom':
			formClass = '';
			break;
	}

	export let button: HTMLButtonElement | undefined = undefined;
</script>

<button
	bind:this={button}
	{disabled}
	{role}
	use:buttonType={type}
	on:click
	{style}
	class="border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 transition-colors {formClass} {BUTTON_COLOR_CLASSES[
		variant
	][filled ? 'filled' : 'default']} {customClass} {disabled
		? disabledClass
		: ''}"
	{...$$restProps}
>
	<slot />
</button>
