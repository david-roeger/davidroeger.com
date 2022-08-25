<script lang="ts">
	export let type: 'primary' | 'secondary' | 'tertiary' | 'quaternary' =
		'primary';
	export let asTag: 'h1' | 'h2' | 'h3' | 'h4' = 'h1';
	export { asTag as as };

	export let id: string | undefined = undefined;
	export let unstyled = false;
	let c = '';
	export let containerClass = '';
	export { c as class };

	const primaryClass = 'text-6xl';
	const secondaryClass = 'text-2xl';
	const tertiaryClass = 'text-xl';
	const quaternaryClass = 'text-base';

	let variantClass = '';
	switch (type) {
		case 'primary':
		default:
			variantClass = primaryClass;
			break;
		case 'secondary':
			variantClass = secondaryClass;
			break;
		case 'tertiary':
			variantClass = tertiaryClass;
			break;
		case 'quaternary':
			variantClass = quaternaryClass;
			break;
	}
</script>

<div class="{unstyled ? '' : 'border-b border-mauve-6 p-2'} {containerClass}">
	<svelte:element
		this={asTag}
		{id}
		class="{unstyled ? '' : variantClass} {c}"
		{...$$restProps}
	>
		<slot />
	</svelte:element>
</div>
