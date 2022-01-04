<script lang="ts">
	export let href: string;
	export let type: 'primary' | 'ghost' = 'primary';
	let c = '';
	export { c as class };

	const primaryClass = 'ring-mauve-12 focus:ring-1 hover:underline decoration-from-font';
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
	}
</script>

<a
	{href}
	target="_blank"
	rel="noopener nofollow"
	tabIndex={type === 'ghost' ? -1 : 0}
	class={`focus:outline-none ${variantClass} ${c}`}
>
	<slot />
</a>
