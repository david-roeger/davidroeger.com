<script lang="ts">
	export let type: 'primary' | 'secondary' | 'tertiary' | 'quaternary' =
		'primary';
	export let asTag: 'h1' | 'h2' | 'h3' | 'h4' = undefined;
	export { asTag as as };

	export let id: string = undefined;
	export let unstyled = false;
	let c = '';
	export let containerClass = '';
	export { c as class };

	import { replaceTag } from '$lib/Actions';

	const primaryClass = 'text-6xl';
	const secondaryClass = 'text-2xl';
	const tertiaryClass = 'text-xl';
	const quaternaryClass = 'text-base';

	let variantClass;
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

	let computedAs = (() => {
		if (asTag === undefined) {
			if (type === 'secondary') {
				return 'h2';
			}

			if (type === 'tertiary') {
				return 'h3';
			}

			if (type === 'quaternary') {
				return 'h4';
			}

			return 'h1';
		}
		return asTag;
	})();
</script>

<div class="{unstyled ? '' : 'border-b border-mauve-6 p-2'} {containerClass}">
	<h1
		{id}
		use:replaceTag={computedAs}
		class={unstyled ? '' : variantClass}
		class:c
	>
		<slot />
	</h1>
</div>
