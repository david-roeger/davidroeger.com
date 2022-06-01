<script lang="ts">
	import { buttonType } from '$lib/Actions';

	export let variant: 'primary' | 'icon' | 'rounded' = 'primary';
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let role: string = undefined;
	export let disabled: boolean = undefined;

	let customClass = '';
	export { customClass as class };
	export let style = '';

	const primaryClass = 'px-4 py-2';
	const roundedClass = 'px-4 py-2 rounded-full';
	const iconClass = '';

	let disabledClass =
		'cursor-not-allowed !bg-white border-mauve-11 ring-mauve-11 text-mauve-11';

	let variantClass;
	switch (variant) {
		case 'primary':
		default:
			variantClass = primaryClass;
			break;
		case 'icon':
			variantClass = iconClass;
			break;
		case 'rounded':
			variantClass = roundedClass;
			break;
	}
</script>

<button
	{disabled}
	{role}
	use:buttonType={type}
	on:click
	{style}
	class="border border-mauve-12 focus:outline-none ring-mauve-12 focus:ring-1 transition-colors {variantClass} {customClass} {disabled
		? disabledClass
		: ''}"
>
	<slot />
</button>
