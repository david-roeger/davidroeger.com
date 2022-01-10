<script lang="ts">
	export let href: string;
	export let type: 'primary' | 'secondary' | 'ghost' = 'primary';
	let c = '';
	export { c as class };

	const primaryClass = 'growing-underline';
	const secondaryClass = 'ring-mauve-12 focus:ring-1 underline decoration-from-font';
	const ghostClass = '';
	let variantClass;
	switch (type) {
		case 'primary':
		default:
			variantClass = primaryClass;
			break;
		case 'ghost':
			variantClass = ghostClass;
			break;
		case 'secondary':
			variantClass = secondaryClass;
			break;
	}
</script>

<a
	{href}
	target="_blank"
	rel="noopener nofollow"
	tabIndex={type === 'ghost' ? -1 : 0}
	class="focus:outline-none {variantClass} {c}"
>
	<slot />
</a>
